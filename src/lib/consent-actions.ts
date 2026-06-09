"use server";

import { cookies } from "next/headers";

export async function saveConsent(choice: "accepted" | "essential_only") {
    const cookieStore = await cookies();
    cookieStore.set("cookie_consent", choice, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
    });
}
