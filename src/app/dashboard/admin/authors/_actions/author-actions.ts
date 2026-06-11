"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function registerAuthor(userId: string, alias: string) {
    const trimmed = alias.trim();
    if (!trimmed) return { success: false, error: "Alias cannot be empty." };

    await prisma.author.create({ data: { alias: trimmed, userId } });
    revalidatePath("/dashboard/admin/authors");
    return { success: true };
}

export async function updateAuthorAlias(authorId: string, alias: string) {
    const trimmed = alias.trim();
    if (!trimmed) return { success: false, error: "Alias cannot be empty." };

    await prisma.author.update({ where: { id: authorId }, data: { alias: trimmed } });
    revalidatePath("/dashboard/admin/authors");
    return { success: true };
}

export async function removeAuthor(authorId: string) {
    await prisma.author.delete({ where: { id: authorId } });
    revalidatePath("/dashboard/admin/authors");
}
