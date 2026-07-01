"use server";

import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";

type NewsletterSettings = {
    id: string;
    user_id: string;
    email: string;
    active: boolean;
};

export async function setNewsletterSettings(
    userId: string,
    email: string,
    authors: string[],
    categories: string[],
): Promise<Result<NewsletterSettings>> {
    if (!(await isEmailSubscribed(email))) {
        console.error("Email is already in use.");
        return { success: false, error: "Email is already in use." };
    }

    try {
        const authorIds: { id: string }[] = [];
        for (const a of authors) {
            const author = await prisma.author.findUnique({ where: { alias: a } });
            if (author) {
                authorIds.push({ id: author.id });
            }
        }

        const categoryIds: { id: string }[] = [];
        for (const c of categories) {
            const category = await prisma.category.findUnique({ where: { name: c } });
            if (category) {
                categoryIds.push({ id: category.id });
            }
        }

        const res = await prisma.newsletterSettings.create({
            data: {
                user_id: userId,
                email: email,
                active: true,
                authors: { connect: authorIds },
                categories: { connect: categoryIds },
            },
        });
        if (res) {
            return { success: true, data: res };
        } else {
            return { success: false, error: "Couldn't write nesletter registration to database." };
        }
    } catch (err) {
        const msg = `An unknown error occurred when trying to register to the newsletter.\n\n${err}`;
        console.error(msg);
        return { success: false, error: msg };
    }
}

export async function getNewsLettersettingsFromId(
    userId: string,
): Promise<Result<NewsletterSettings>> {
    try {
        const res = await prisma.newsletterSettings.findFirst({
            where: { user_id: userId },
            include: { authors: true, categories: true },
        });
        if (res) {
            return { success: true, data: res };
        } else {
            return {
                success: false,
                error: `Couldn't find newsletter subscription for user id ${userId}.`,
            };
        }
    } catch (err) {
        const msg = `An error occurred when trying to find newsletter settings for user ${userId}.\n\n${err}`;
        console.error(msg);
        return { success: false, error: msg };
    }
}

export async function isEmailSubscribed(email: string) {
    const res = await prisma.newsletterSettings.findFirst({ where: { email: email } });
    if (res && res.email === email) {
        return true;
    } else {
        return false;
    }
}
