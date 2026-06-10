"use server";

import prisma from "@/lib/prisma";
import { Category, Result } from "@/lib/types";

export async function getCategories(): Promise<Result<Category[]>> {
    try {
        const categories = await prisma.category.findMany();
        return { success: true, data: categories };
    } catch (err) {
        console.error(`Couldn't fetch categories from the database.\n\n${err}`);
        return { success: false, error: `Couldn't fetch categories from the database.\n\n${err}` };
    }
}
