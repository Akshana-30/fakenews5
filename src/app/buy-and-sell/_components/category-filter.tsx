"use client";

import Link from "next/link";
import { CATEGORIES } from "@/app/advertise/private/_data/categories";

type Props = {
    activeCategory?: string;
    activeType?: string;
};

export default function CategoryFilter({ activeCategory, activeType }: Props) {
    function href(slug: string | undefined) {
        const params = new URLSearchParams();
        if (slug) params.set("category", slug);
        if (activeType) params.set("type", activeType);
        const qs = params.toString();
        return `/buy-and-sell${qs ? `?${qs}` : ""}`;
    }

    return (
        <div className="flex flex-wrap gap-2">
            <Link
                href={href(undefined)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    !activeCategory
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-popover border-border hover:border-primary hover:text-primary"
                }`}
            >
                All categories
            </Link>
            {CATEGORIES.map(cat => (
                <Link
                    key={cat.slug}
                    href={href(cat.slug)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        activeCategory === cat.slug
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-popover border-border hover:border-primary hover:text-primary"
                    }`}
                >
                    {cat.name}
                </Link>
            ))}
        </div>
    );
}
