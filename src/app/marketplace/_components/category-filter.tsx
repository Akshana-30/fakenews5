"use client";

import Link from "next/link";
import { CATEGORIES } from "@/app/advertise/private/_data/categories";

export default function CategoryFilter({ activeCategory }: { activeCategory?: string }) {
    return (
        <div className="flex flex-wrap gap-2">
            <Link
                href="/marketplace"
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    !activeCategory
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-popover border-border hover:border-primary hover:text-primary"
                }`}
            >
                All
            </Link>
            {CATEGORIES.map(cat => (
                <Link
                    key={cat.slug}
                    href={`/marketplace?category=${cat.slug}`}
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
