"use server";

import { cookies } from "next/headers";

export async function saveConsent(consent: boolean) {
    const cookieStore = await cookies();
    cookieStore.set("cookie_consent", consent ? "yes" : "no", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
    });
}

export async function getConsent() {
    const cookieStore = await cookies();
    const consent = cookieStore.get("cookie_consent");
}
