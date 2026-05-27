import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { nextCookies } from "better-auth/next-js";
import nodemailer, { SentMessageInfo } from "nodemailer";
import dotenv from "dotenv";
import { admin } from "better-auth/plugins";

dotenv.config();

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
            //console.log(`Password reset url: ${url}`);
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
            transporter.sendMail(
                {
                    from: "info@movieshop.com",
                    to: user.email,
                    subject: "Reset password",
                    text: `Click the link to change your password: ${url}`,
                },
                function (err: Error | null, info: SentMessageInfo) {
                    if (err) {
                        console.error(`Couldn't send email.\n\n${err}` + err);
                        return { error: err, info: null };
                    }
                },
            );
        },
    },
    plugins: [nextCookies(), admin()],
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
            console.log(`Verify your email: ${url}`);
            transporter.sendMail(
                {
                    from: "adam.lundvall@gmail.com",
                    to: user.email,
                    subject: "Verify your email address",
                    text: `Click the link to verify your email: ${url}`,
                },
                function (err: Error | null, info: SentMessageInfo) {
                    if (err) {
                        console.error(`Couldn't send email.\n\n${err}` + err);
                        return { error: err, info: null };
                    }
                },
            );
        },
    },
});
