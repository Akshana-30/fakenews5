"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Title name is required")
    .max(25, "Maximum of 25 characters"),
  parentId: z.string().nullable(),
});

export async function editCategory(
  categoryId: string,
  values: z.infer<typeof formSchema>,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return {
      success: false,
      error: "Only admins can edit categories.",
    };
  }

  const parsed = formSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      error: `Error: ${parsed.error}`,
    };
  }

  if (parsed.data.parentId === categoryId) {
    return {
      success: false,
      error: "A category cannot be its own parent.",
    };
  }

  if (parsed.data.parentId) {
    // Walk up the candidate parent's ancestor chain — if this category
    // shows up along the way, the candidate is one of its own
    // descendants, and assigning it as parent would create a cycle.
    let current: string | null = parsed.data.parentId;
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
    await prisma.category.update({
      where: { id: categoryId },
      data: { name: parsed.data.name, parentId: parsed.data.parentId },
    });
  } catch (err) {
    console.error("Failed to update category", err);
    return {
      success: false,
      error: "Something went wrong while updating the category.",
    };
  }

  revalidatePath(`/category/${categoryId}/edit`);
  revalidatePath("/dashboard/admin/categories");
  revalidatePath(`/category/${categoryId}`);
  return { success: true };
}
