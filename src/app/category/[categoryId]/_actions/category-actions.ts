"use server";

import prisma from "@/lib/prisma";

export default async function getCategoryById(categoryId: string) {
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: { article: true },
    });
    if (category) {
        return { success: true, data: category };
    }
}
