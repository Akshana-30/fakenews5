"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }
}

export async function registerAuthor(userId: string, alias: string) {
    await requireAdmin();
    const trimmed = alias.trim();
    if (!trimmed) return { success: false, error: "Alias cannot be empty." };

    await prisma.author.create({ data: { alias: trimmed, userId } });
    revalidatePath("/dashboard/admin/authors");
    return { success: true };
}

export async function updateAuthorAlias(authorId: string, alias: string) {
    await requireAdmin();
    const trimmed = alias.trim();
    if (!trimmed) return { success: false, error: "Alias cannot be empty." };

    await prisma.author.update({ where: { id: authorId }, data: { alias: trimmed } });
    revalidatePath("/dashboard/admin/authors");
    return { success: true };
}

export async function removeAuthor(authorId: string) {
    await requireAdmin();
    await prisma.author.delete({ where: { id: authorId } });
    revalidatePath("/dashboard/admin/authors");
}
