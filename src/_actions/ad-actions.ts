"use server";

import prisma from "@/lib/prisma";

export type AdRow = {
    id: string;
    createdAt: Date;
    listingType: string;
    category: string;
    subcategory: string;
    title: string;
    description: string;
    price: number | null;
    priceType: string;
    condition: string;
    location: string;
    tier: string;
    photos: string[];
    status: string;
};

const TIER_ORDER: Record<string, number> = { featured: 0, plus: 1, basic: 2 };

export async function getAds(category?: string): Promise<{ success: true; data: AdRow[] } | { success: false; error: string }> {
    try {
        const ads = await prisma.ad.findMany({
            where: {
                status: { in: ["pending", "published"] },
                ...(category ? { category } : {}),
            },
            select: {
                id: true,
                createdAt: true,
                listingType: true,
                category: true,
                subcategory: true,
                title: true,
                description: true,
                price: true,
                priceType: true,
                condition: true,
                location: true,
                tier: true,
                photos: true,
                status: true,
            },
            orderBy: { createdAt: "desc" },
        });

        // Featured first, then Plus, then Basic — within each tier newest first
        const sorted = ads.sort(
            (a, b) => (TIER_ORDER[a.tier] ?? 2) - (TIER_ORDER[b.tier] ?? 2),
        );

        return { success: true, data: sorted };
    } catch (err) {
        console.error("[getAds]", err);
        return { success: false, error: String(err) };
    }
}
