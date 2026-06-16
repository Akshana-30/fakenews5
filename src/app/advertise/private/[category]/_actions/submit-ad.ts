"use server";

import z from "zod";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia",
});

const TIER_PRICES: Record<string, { amount: number; label: string }> = {
    plus:     { amount: 4900, label: "Plus — 49 kr" },
    featured: { amount: 9900, label: "Featured — 99 kr" },
};

const schema = z.object({
    listingType:  z.enum(["sell", "wanted"]).default("sell"),
    category:     z.string(),
    subcategory:  z.string().min(1, "Please select a subcategory"),
    title:        z.string().min(3, "Title must be at least 3 characters").max(100),
    description:  z.string().min(10, "Description must be at least 10 characters").max(1500),
    price:        z.string(),
    priceType:    z.enum(["fixed", "negotiable", "free", "contact"]),
    condition:    z.enum(["new", "like-new", "good", "fair", "for-parts", "n-a"]),
    location:     z.string().min(1, "Location is required"),
    contactName:  z.string().min(1, "Name is required"),
    contactEmail: z.string().email("Invalid email address"),
    contactPhone: z.string(),
    tier:         z.enum(["basic", "plus", "featured"]),
    photos:       z.array(z.string()).default([]),
});

export type AdValues = z.infer<typeof schema>;

type Result =
    | { success: true; checkoutUrl?: string }
    | { success: false; error: string };

export async function submitAd(values: AdValues): Promise<Result> {
    const result = schema.safeParse(values);
    if (!result.success) {
        return { success: false, error: result.error.issues[0]?.message ?? "Invalid input" };
    }

    const { listingType, tier, title, category, subcategory, description, price,
            priceType, condition, location, contactName, contactEmail,
            contactPhone, photos } = result.data;

    const ad = await prisma.ad.create({
        data: {
            listingType,
            category,
            subcategory,
            title,
            description,
            price: price ? parseInt(price) : null,
            priceType,
            condition,
            location,
            contactName,
            contactEmail,
            contactPhone,
            tier,
            photos,
            status: "pending",
        },
    });

    console.log("[submitAd] saved ad", ad.id);

    if (tier !== "basic") {
        const { amount, label } = TIER_PRICES[tier];
        const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

        const session = await stripeClient.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "sek",
                        unit_amount: amount,
                        product_data: {
                            name: `Classified Ad — ${label}`,
                            description: `"${title.slice(0, 100)}" · ${category}`,
                        },
                    },
                },
            ],
            customer_email: contactEmail,
            metadata: {
                adId:       ad.id,
                adTitle:    title.slice(0, 200),
                adCategory: category,
                adTier:     tier,
            },
            success_url: `${baseUrl}/advertise/private/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:  `${baseUrl}/advertise/private/${category}`,
        });

        return { success: true, checkoutUrl: session.url! };
    }

    return { success: true };
}
