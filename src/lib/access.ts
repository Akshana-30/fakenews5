// lib/access.ts
import { auth } from "@/lib/auth";
import { ROLE_SHOWS_ADS, ROLE_READ_LIMIT } from "@/lib/permissions";

export async function getViewerContext(headers: Headers) {
    const session = await auth.api.getSession({ headers });

    if (!session) {
        return {
            role: "guest" as const,
            showsAds: true,
            readLimit: 500,
            session: null,
        };
    }

    const role = session.user.role ?? "user";
    return {
        role,
        showsAds: ROLE_SHOWS_ADS[role] ?? true,
        readLimit: ROLE_READ_LIMIT[role] ?? null,
        session,
    };
}
