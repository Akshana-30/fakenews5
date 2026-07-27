"use server";

import z from "zod";
import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { categoryArray } from "@/lib/category";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
  summary: z
    .string()
    .min(1, "Summary is required")
    .max(1000, "Between 1-1000 characters"),
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

type AddArticleValues = z.infer<typeof formSchema>;

export type CategoryConflict = {
  name: string;
  currentParentName: string | null;
  requestedParentName: string | null;
};

class TopLevelReassignmentBlockedError extends Error {}

export async function getParentCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

// Resolves `name` to a category under `desiredParentId` (null = top-level).
// Creates it if new, reuses it if already correctly placed, or logs a conflict
// (and leaves it untouched) if it exists under a different parent and hasn't
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
    return prisma.category.create({
      data: { name, parentId: desiredParentId },
    });
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
    return prisma.category.update({
      where: { id: existing.id },
      data: { parentId: desiredParentId },
    });
  }

  if (confirmed.has(existing.name.toLowerCase())) {
    return prisma.category.update({
      where: { id: existing.id },
      data: { parentId: desiredParentId },
    });
  }

  const currentParent = existing.parentId
    ? await prisma.category.findUnique({
        where: { id: existing.parentId },
        select: { name: true },
      })
    : null;

  conflicts.push({
    name: existing.name,
    currentParentName: currentParent?.name ?? null,
    requestedParentName: desiredParentName,
  });
  return existing; // ignored by caller once conflicts.length > 0
}

export default async function addArticle(
  values: AddArticleValues,
  confirmedReassignments: string[] = [],
): Promise<
  | Result<string>
  | { success: false; needsConfirmation: true; conflicts: CategoryConflict[] }
> {
  const data = formSchema.parse(values);
  const confirmed = new Set(confirmedReassignments.map((n) => n.toLowerCase()));
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return {
      success: false,
      error: "You must be signed in to publish an article.",
    };
  }

  const { success } = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: { article: ["create"] },
    },
  });
  if (!success) redirect("/");

  try {
    // Connect any typed aliases that already exist as authors
    const existingAuthors = await prisma.author.findMany({
      where: {
        alias: { in: data.author },
      },
      select: { id: true, alias: true },
    });

    const authorIds = existingAuthors.map(({ id }) => ({ id }));

    // The writer is always credited. If they have no Author record yet,
    // create one on the fly — named by their typed alias if it's new,
    // otherwise by their account name.
    let writerAuthor = await prisma.author.findUnique({
      where: { userId: session.user.id },
    });

    if (!writerAuthor) {
      const matchedAliases = existingAuthors.map((a) => a.alias);
      const newAlias =
        data.author.find((alias) => !matchedAliases.includes(alias)) ??
        session.user.name;

      writerAuthor = await prisma.author.create({
        data: {
          alias: newAlias,
          userId: session.user.id,
        },
      });
    }

    if (!authorIds.some(({ id }) => id === writerAuthor.id)) {
      authorIds.push({ id: writerAuthor.id });
    }
    const conflicts: CategoryConflict[] = [];
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

    const parentCategory = await resolveCategory(
      data.category,
      null,
      null,
      confirmed,
      conflicts,
    );

    const subcategories = [];
    for (const name of uniqueSubNames) {
      subcategories.push(
        await resolveCategory(
          name,
          parentCategory.id,
          parentCategory.name,
          confirmed,
          conflicts,
        ),
      );
    }

    if (conflicts.length > 0) {
      return { success: false, needsConfirmation: true, conflicts };
    }
    const newArticle = await prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        summary: data.summary,
        image: data.image,
        location: data.location,
        author: {
          connect: authorIds,
        },
        category: {
          connect: [
            { id: parentCategory.id },
            ...subcategories.map((c) => ({ id: c.id })),
          ],
        },
      },
    });

    return { success: true, data: newArticle.id };
  } catch (err) {
    if (err instanceof TopLevelReassignmentBlockedError) {
      return { success: false, error: err.message };
    }
    return { success: false, error: `Error ${err}` };
  }
}
