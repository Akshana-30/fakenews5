"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function registerAuthor(userId: string, alias: string) {
    const trimmed = alias.trim();
    if (!trimmed) return { success: false, error: "Alias cannot be empty." };

    await prisma.$transaction([
        prisma.author.create({ data: { alias: trimmed, userId } }),
        prisma.user.update({ where: { id: userId }, data: { role: "author" } }),
    ]);
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
    const author = await prisma.author.findUnique({ where: { id: authorId }, select: { userId: true } });
    if (!author) return;

    await prisma.$transaction([
        prisma.author.delete({ where: { id: authorId } }),
        prisma.user.update({ where: { id: author.userId }, data: { role: "user" } }),
    ]);
    revalidatePath("/dashboard/admin/authors");
}
