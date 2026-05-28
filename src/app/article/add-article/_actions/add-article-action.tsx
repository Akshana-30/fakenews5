"use server";

import z from "zod";
import prisma from "@/lib/prisma";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
  summary: z
    .string()
    .min(20, "Title is required")
    .max(200, "Between 20-200 characters"),
  content: z.string(),
  image: z.string(),
  category: z.array(z.string()),
  location: z.string(),
  author: z.array(z.string()),
});

type AddArticleValues = z.infer<typeof formSchema>;

export default async function addArticle(values: AddArticleValues) {
  const data = formSchema.parse(values);
  const authors = await prisma.author.findMany({
    where: {
      alias: { in: data.author },
    },
    select: { id: true },
  });

  try {
    const newArticle = await prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        summary: data.summary,
        image: data.image,
        location: data.location,
        author: {
          connect: authors.map(({ id }) => ({ id })),
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
    return {error: null, articleId: newArticle.id};
  } catch {
    return {error: "Unknown error occurred", articleId: null}
  }
}
