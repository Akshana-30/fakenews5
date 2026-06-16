import { headers } from "next/headers";
import { auth } from "./auth";
import prisma from "./prisma";

export async function userIsAdFree(): Promise<boolean> {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return false;

    const subscription = await prisma.subscription.findFirst({
        where: {
            referenceId: session.user.id,
            status: { in: ["active", "trialing"] },
        },
    });
    if (!subscription) return false;

    const plan = await prisma.plan.findUnique({
        where: { name: subscription.plan },
    });
    return plan?.adFree ?? false;
}
