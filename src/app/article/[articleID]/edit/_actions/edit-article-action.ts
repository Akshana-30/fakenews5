"use server";

import z from "zod";
import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";
import { categoryArray } from "@/lib/category";

const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
    summary: z.string().min(1, "Summary is required").max(1000, "Between 1-1000 characters"),
    content: z.string().min(1, "Content text is required"),
    image: z.string(),
    category: z
        .string()
        .min(1, "Category is required")
        .refine((val) => (categoryArray as readonly string[]).includes(val), {
            message: "Select a valid category",
        }),
    subcategory: z.array(z.string()),
    location: z.string(),
    author: z.array(z.string()),
});

type EditArticleValues = z.infer<typeof formSchema>;

export type CategoryConflict = {
    name: string;
    currentParentName: string | null;
    requestedParentName: string | null;
};

class TopLevelReassignmentBlockedError extends Error {}

// Same resolution logic as add-article-action: find-or-create under the
// desired parent, reuse if already correctly placed, or log a conflict
// (leaving it untouched) if it exists under a different parent and hasn't
// been confirmed for reassignment yet.
async function resolveCategory(
    name: string,
    desiredParentId: string | null,
    desiredParentName: string | null,
    confirmed: Set<string>,
    conflicts: CategoryConflict[],
    isSubcategoryCall: boolean = false,
) {
    const existing = await prisma.category.findFirst({
        where: { name: { equals: name, mode: "insensitive" } },
    });

    if (!existing) {
        return prisma.category.create({ data: { name, parentId: desiredParentId } });
    }
    if (existing.parentId === desiredParentId) {
        return existing;
    }

    if (isSubcategoryCall && existing.parentId === null) {
        throw new TopLevelReassignmentBlockedError(
            `"${existing.name}" already exists as a top-level category and can't be used as a subcategory. Please choose a different subcategory name.`,
        );
    }

    if (confirmed.has(existing.name.toLowerCase())) {
        return prisma.category.update({ where: { id: existing.id }, data: { parentId: desiredParentId } });
    }

    const currentParent = existing.parentId
        ? await prisma.category.findUnique({ where: { id: existing.parentId }, select: { name: true } })
        : null;

    conflicts.push({
        name: existing.name,
        currentParentName: currentParent?.name ?? null,
        requestedParentName: desiredParentName,
    });
    return existing;
}

export default async function editArticle(
    articleId: string,
    values: EditArticleValues,
    confirmedReassignments: string[] = [],
): Promise<Result<string> | { success: false; needsConfirmation: true; conflicts: CategoryConflict[] }> {
    const data = formSchema.parse(values);
    const confirmed = new Set(confirmedReassignments.map((n) => n.toLowerCase()));

    const uniqueSubNames = Array.from(
        new Map(data.subcategory.map((n) => [n.toLowerCase(), n])).values(),
    );

    const clashingNames = uniqueSubNames.filter((n) =>
        categoryArray.some((c) => c.toLowerCase() === n.toLowerCase()),
    );
    if (clashingNames.length > 0) {
        return {
            success: false,
            error: `Subcategory can't share a name with a main category (${clashingNames.join(", ")}).`,
        };
    }

    const authors = await prisma.author.findMany({
        where: { alias: { in: data.author } },
        select: { id: true },
    });

    try {
        const conflicts: CategoryConflict[] = [];
        const parentCategory = await resolveCategory(data.category, null, null, confirmed, conflicts);

        const subcategories = [];
        for (const name of uniqueSubNames) {
            subcategories.push(
                await resolveCategory(
                    name,
                    parentCategory.id,
                    parentCategory.name,
                    confirmed,
                    conflicts,
                    true,
                ),
            );
        }

        if (conflicts.length > 0) {
            return { success: false, needsConfirmation: true, conflicts };
        }

        const updated = await prisma.article.update({
            where: { id: articleId },
            data: {
                title: data.title,
                content: data.content,
                summary: data.summary,
                image: data.image ?? "",
                location: data.location,
                author: {
                    set: authors.map(({ id }) => ({ id })),
                },
                category: {
                    set: [],
                    connect: [
                        { id: parentCategory.id },
                        ...subcategories.map((c) => ({ id: c.id })),
                    ],
                },
            },
        });
        return { success: true, data: updated.id };
    } catch (err) {
        if (err instanceof TopLevelReassignmentBlockedError) {
            return { success: false, error: err.message };
        }
        return { success: false, error: `Error updating article: ${err}` };
    }
}