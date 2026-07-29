"use server";

import prisma from "@/lib/prisma";
import { Category, Result } from "@/lib/types";

export async function getCategories(): Promise<Result<Category[]>> {
    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { article: true } } },
        });

        const data: Category[] = categories.map((c) => ({
            id: c.id,
            name: c.name,
            parentId: c.parentId,
            articleCount: c._count.article,
        }));

        return { success: true, data };
    } catch (err) {
        console.error(`Couldn't fetch categories from the database.\n\n${err}`);
        return { success: false, error: `Couldn't fetch categories from the database.\n\n${err}` };
    }
}

export type CategoryLink = {
    title: string;
    href: string;
    children?: CategoryLink[];
};

export async function getCategoryLinks(): Promise<Result<CategoryLink[]>> {
    const result = await getCategories();
    if (!result.success) {
        return result;
    }

    const all = result.data;
    const parents = all.filter((c) => c.parentId === null);

    const links: CategoryLink[] = [];

    for (const p of parents) {
        const children = all
            .filter((c) => c.parentId === p.id && (c.articleCount ?? 0) > 0)
            .map((c) => ({
                title: c.name,
                href: `/category/${p.name}/${c.name}`,
            }));

        const parentHasArticles = (p.articleCount ?? 0) > 0;
        if (!parentHasArticles && children.length === 0) continue;

        links.push({
            title: p.name,
            href: `/category/${p.name}`,
            children,
        });
    }

    return { success: true, data: links };
}

export async function isCategoryNameUnique(name: string): Promise<Result<boolean>> {
    try {
        const res = await prisma.category.findFirst({ where: { name: name.toLocaleLowerCase() } });
        if (res) {
            return { success: true, data: false };
        } else {
            return { success: true, data: true };
        }
    } catch (err) {
        return {
            success: false,
            error: `An unknown error occurred when trying to check if the category name is unique.\n\n${err}`,
        };
    }
}

export async function addCategory(name: string) {
    try {
        const res = await prisma.category.create({ data: { name: name.toLocaleLowerCase() } });
        return { success: true, data: res };
    } catch (err) {
        return {
            success: false,
            error: `An unknown error occurred when trying to create a new category.\n\n${err}`,
        };
    }
}
