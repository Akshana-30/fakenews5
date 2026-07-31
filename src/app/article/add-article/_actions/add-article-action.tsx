"use server";

import z from "zod";
import prisma from "@/lib/prisma";
import { Article, Result } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { categoryArray } from "@/lib/category";

const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
    summary: z.string().min(1, "Summary is required").max(1000, "Between 1-1000 characters"),
    content: z.string().min(1, "Content text is required"),
    image: z.string(),
    category: z.string(),
    subcategory: z.string(),
    location: z.string(),
    author: z.array(z.string()),
});

type AddArticleValues = z.infer<typeof formSchema>;

export default async function addArticle(values: AddArticleValues): Promise<Result<Article>> {
    const data = formSchema.parse(values);
    let categoryString = "";
    if (data.category.length > 1 && data.subcategory.length > 1) {
        categoryString = data.category + ", " + data.subcategory;
    } else if (data.category.length > 1 && data.subcategory.length < 1) {
        categoryString = data.category;
    }
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return {
            success: false,
            error: "You must be signed in to publish an article.",
        };
    }
    console.log("category", categoryString);

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
                data.author.find((alias) => !matchedAliases.includes(alias)) ?? session.user.name;

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

        const categoryIds = [];
        const categoryNames = categoryString.split(",");
        for (const c of categoryNames) {
            const category = await prisma.category.findUnique({ where: { name: c.trim() } });
            if (category) {
                categoryIds.push({ id: category?.id });
            }
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
                    connect: categoryIds,
                },
            },
            include: {
                bookmark: true,
                author: true,
                comments: { include: { reactions: true } },
                reactions: true,
                category: true,
            },
        });

        return { success: true, data: newArticle };
    } catch (err) {
        return { success: false, error: `Error ${err}` };
    }
}
