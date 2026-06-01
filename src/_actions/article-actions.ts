import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";

type Article = {
    id: string;
    title: string;
    summary: string | null;
    content: string;
    views: number;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    location: string | null;
    author: Author[];
    category: Category[];
};

type Author = {
    id: string;
    alias: string;
    userId: string;
};

type Category = {
    id: string;
    name: string;
};

export async function getArticle(articleId: string): Promise<Result<Article>> {
    try {
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            include: { author: true, category: true },
        });
        if (article) return { success: true, data: article };
        else return { success: false, error: "Couldn't find article." };
    } catch (err) {
        return { success: false, error: `Couldn't fetch article from database.\n\n${err}` };
    }
}
