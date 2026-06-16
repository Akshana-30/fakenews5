"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

async function getSession() {
    return await auth.api.getSession({ headers: await headers() });
}

// Gets UserInfo.id from the logged-in user (needed for Bookmark.user_id)
async function getUserInfoId(userId: string) {
    const userInfo = await prisma.userInfo.findUnique({
        where: { userId },
        select: { id: true },
    });

    if (!userInfo) throw new Error("UserInfo not found");
    return userInfo.id;
}

export async function isBookmarked(articleId: string): Promise<boolean> {
    const session = await getSession();
    if (!session) return false;

    const userInfoId = await getUserInfoId(session.user.id);

    const bookmark = await prisma.bookmark.findFirst({
        where: {
            user_id: userInfoId,
            articleId,
        },
    });

    return !!bookmark;
}

export async function addBookmark(articleId: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const userInfoId = await getUserInfoId(session.user.id);

    // Prevent duplicate bookmarks
    const existing = await prisma.bookmark.findFirst({
        where: { user_id: userInfoId, articleId },
    });

    if (existing) return existing;

    return await prisma.bookmark.create({
        data: {
            user_id: userInfoId,
            articleId,
        },
    });
}

export async function removeBookmark(articleId: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const userInfoId = await getUserInfoId(session.user.id);

    const bookmark = await prisma.bookmark.findFirst({
        where: { user_id: userInfoId, articleId },
    });

    if (!bookmark) return;
    
    return await prisma.bookmark.delete({
        where: { id: bookmark.id },
    });
}