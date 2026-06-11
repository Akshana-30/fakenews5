"use server";

import prisma from "@/lib/prisma";
import { Result, Plan } from "@/lib/types";
import { success } from "zod";

export async function getPlans(): Promise<Result<Plan[]>> {
    try {
        const plans = await prisma.plan.findMany();
        return { success: true, data: plans };
    } catch (err) {
        const msg = `Couldn't fetch the subscription plans from the database.\n\n${err}`;
        console.error(msg);
        return { success: false, error: msg };
    }
}

export async function getPlanByName(name: string) {
    try {
        const plan = await prisma.plan.findUnique({ where: { name: name } });
        return { success: true, data: plan };
    } catch (err) {
        const msg = `Couldn't fetch subscription plan ${name}.\n\n${err}`;
        console.error(msg);
        return { success: false, error: msg };
    }
}
