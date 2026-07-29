"use server";

import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import z from "zod";

const formSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Maximum of 50 characters"),
    parentId: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export async function updateCategory(categoryId: string, input: FormValues): Promise<Result<string>> {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return { success: false, error: "You must be signed in." };
    }
    if (session.user.role !== "admin") {
        return { success: false, error: "Only admins can edit categories." };
    }

    const data = formSchema.parse(input);

    if (data.parentId === categoryId) {
        return { success: false, error: "A category cannot be its own parent." };
    }

    if (data.parentId) {
        // Walk up the candidate parent's ancestor chain — if this category
        // shows up along the way, the candidate is one of its own
        // descendants, and assigning it as parent would create a cycle.
        let current: string | null = data.parentId;
        const visited = new Set<string>();
        while (current) {
            if (current === categoryId) {
                return {
                    success: false,
                    error: "Cannot set the parent to one of this category's own subcategories.",
                };
            }
            if (visited.has(current)) break;
            visited.add(current);
            const parent: { parentId: string | null } | null = await prisma.category.findUnique({
                where: { id: current },
                select: { parentId: true },
            });
            current = parent?.parentId ?? null;
        }
    }

    try {
        const updated = await prisma.category.update({
            where: { id: categoryId },
            data: {
                name: data.name,
                parentId: data.parentId,
            },
        });

        revalidatePath("/dashboard/admin/categories");
        revalidatePath(`/category/${categoryId}`);
        return { success: true, data: updated.id };
    } catch (err) {
        if (err instanceof Error && err.message.includes("Unique constraint")) {
            return { success: false, error: `A category named "${data.name}" already exists.` };
        }
        console.error(`[updateCategory] failed for category ${categoryId}`, err);
        return { success: false, error: `An unknown error occurred: ${err}` };
    }
}
