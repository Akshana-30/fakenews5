"use server";

import z from "zod";
import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
  summary: z
    .string()
    .min(1, "Summary is required")
    .max(200, "Between 1-200 characters"),
  content: z.string().min(1, "Content text is required"),
  image: z.string(),
  category: z.array(z.string()),
  location: z.string(),
  author: z.array(z.string()),
});

type AddArticleValues = z.infer<typeof formSchema>;

export default async function addArticle(values: AddArticleValues): Promise<Result<string>> {
    const data = formSchema.parse(values);

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return { success: false, error: "You must be signed in to publish an article." };
    }

    try {
        // The writer must have a registered Author profile to publish.
        const writerAuthor = await prisma.author.findUnique({
            where: { userId: session.user.id },
        });

        if (!writerAuthor) {
            return {
                success: false,
                error: "You need an Author profile to publish articles. Ask an admin to register you as an author.",
            };
        }

        // Connect any co-authors typed in the form that already exist as registered authors.
        // Aliases with no matching Author record are silently skipped — no auto-create.
        const coAuthors = await prisma.author.findMany({
            where: { alias: { in: data.author } },
            select: { id: true },
        });

        const authorIds = coAuthors.map(({ id }) => ({ id }));

        if (!authorIds.some(({ id }) => id === writerAuthor.id)) {
            authorIds.push({ id: writerAuthor.id });
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
                    connectOrCreate: data.category.map((category) => ({
                        where: { name: category },
                        create: {
                            name: category,
                        },
                    })),
                },
            },
        });
        return { success: true, data: newArticle.id };
    } catch (err) {
        return { success: false, error: `Error ${err}` };
    }
}
