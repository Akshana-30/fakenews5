import { cache } from "react";
import prisma from "@/lib/prisma";
import { Result } from "@/lib/types";

export type Advertisement = {
    id: string;
    createdAt: Date;
    label: string;
    format: string;
    imageUrl: string;
    linkUrl: string;
    active: boolean;
    startsAt: Date | null;
    endsAt: Date | null;
};

// Per-request memo of which ad ids have already been shown for a given
// format, so multiple slots on the same page (e.g. top + bottom banner,
// or two sidebar slots) don't all draw the same random ad when more than
// one is active. cache() resets automatically on the next request.
const getSeenAdIds = cache(() => new Map<string, Set<string>>());

export async function getActiveAd(format: string): Promise<Advertisement | null> {
    try {
        const now = new Date();
        const ads = await prisma.advertisement.findMany({
            where: {
                format,
                active: true,
                OR: [{ startsAt: null }, { startsAt: { lte: now } }],
                AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
            },
        });
        console.log(`[getActiveAd] format="${format}" found=${ads.length} now=${now.toISOString()}`);
        if (ads.length === 0) return null;

        const seenStore = getSeenAdIds();
        const seen = seenStore.get(format) ?? new Set<string>();
        const unseen = ads.filter((a) => !seen.has(a.id));
        const pool = unseen.length > 0 ? unseen : ads;

        const chosen = pool[Math.floor(Math.random() * pool.length)];
        seen.add(chosen.id);
        seenStore.set(format, seen);
        return chosen;
    } catch (err) {
        console.error(`[getActiveAd] format="${format}" ERROR:`, err);
        return null;
    }
}

export async function getAdvertisements(): Promise<Result<Advertisement[]>> {
    try {
        const ads = await prisma.advertisement.findMany({ orderBy: { createdAt: "desc" } });
        return { success: true, data: ads };
    } catch (err) {
        console.error("[getAdvertisements]", err);
        return { success: false, error: `${err}` };
    }
}
