"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function setNewsletterSettings(
    userId: string,
    email: string,
    authors: string[],
    categories: string[],
) {
    const authorIds: string[] = [];
    console.log(authorIds);
    authors.map(async (a) => {
        //console.log(a);
        const author = await prisma.author.findUnique({
            where: { alias: a },
            select: { id: true },
        });
        if (author) {
            console.log(author);
            authorIds.push(author.id);
            console.log(author.id);
        }
    });
    console.log(authorIds);

    //const res = await prisma.newsletterSettings.create({data: {user_id: userId, email: email, authors: }})
}
