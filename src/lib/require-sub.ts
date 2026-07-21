import { headers } from "next/headers";
import { auth } from "./auth";
import prisma from "./prisma";

const ACTIVE_STATUSES = ["active", "trialing"];

type PlanName = Awaited<ReturnType<typeof prisma.plan.findMany>>[number]["name"];

export async function requiureSubscription(plan: PlanName) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        return { authorized: false, subscription: null } as const;
    }
    const subscription = await auth.api.listActiveSubscriptions({
        headers: await headers(),
    });

    const match = subscription.find(
        (sub) => sub.plan === plan && ACTIVE_STATUSES.includes(sub.status),
    );

    return match
        ? ({ authorized: true, subscription: match } as const)
        : ({ authorized: false, subscription: null } as const);
}

export async function getActiveSubscriptionsPriceId() {
    const subs = await auth.api.listActiveSubscriptions({ headers: await headers() });
    const match = subs.find((sub) => ACTIVE_STATUSES.includes(sub.status));
    if (match) return match.priceId;
    else return undefined;
}
