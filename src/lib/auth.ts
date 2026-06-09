import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { nextCookies } from "better-auth/next-js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { admin as adminPlugin } from "better-auth/plugins";
import { editor, admin, subscriber, ac } from "./permissions";
import Stripe from "stripe";
import { stripe } from "@better-auth/stripe";

dotenv.config();

export const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: "nikki.leuschke@ethereal.email",
        pass: "NWXrggTFV1VkSHmYhd",
    },
});

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia", // Latest API version as of Stripe SDK v22.0.0
});

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    user: {
        changeEmail: {
            enabled: true,
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: true,
        resetPasswordTokenExpiresIn: 60 * 30,
        sendResetPassword: async ({ user, url }) => {
            const text = `Click the link to change your password: ${url}`;
            console.log(text);
            await transporter.sendMail(
                {
                    from: '"Fakenews" <noreply@fakenews.com>',
                    to: user.email,
                    subject: "Reset your password",
                    text: text,
                },
                function (error, info) {
                    console.error(`Unable to send email.\n\n${error}\n${info}`);
                },
            );
        },
    },
    plugins: [
        adminPlugin({ ac, roles: { admin, subscriber, editor } }),
        stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            subscription: {
                enabled: true,
                plans: async () => {
                    const plans = await prisma.plans.findMany();
                    return plans.map((plan) => ({
                        name: plan.name,
                        priceId: plan.priceId,
                    }));
                },
            },
        }),
        nextCookies(),
    ],
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
            const text = `Click the link to verify your email address: ${url}`;
            console.log(text);
            await transporter.sendMail(
                {
                    from: '"Fakenews" <noreply@fakenews.com>',
                    to: user.email,
                    subject: "Verify your email",
                    text: text,
                },
                function (error, info) {
                    console.error(`Unable to send email.\n\n${error} ${info}`);
                },
            );
        },
    },
});
