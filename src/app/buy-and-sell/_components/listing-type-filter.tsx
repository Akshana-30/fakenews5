"use client";

import Link from "next/link";

type Props = {
    activeType?: string;
    activeCategory?: string;
};

const TYPES = [
    { value: undefined, label: "All" },
    { value: "sell",    label: "Sell" },
    { value: "wanted",  label: "Buy" },
];

export default function ListingTypeFilter({ activeType, activeCategory }: Props) {
    function href(value: string | undefined) {
        const params = new URLSearchParams();
        if (activeCategory) params.set("category", activeCategory);
        if (value) params.set("type", value);
        const qs = params.toString();
        return `/buy-and-sell${qs ? `?${qs}` : ""}`;
    }

    return (
        <div className="flex gap-2">
            {TYPES.map(t => (
                <Link
                    key={t.label}
                    href={href(t.value)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        activeType === t.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-popover border-border hover:border-primary hover:text-primary"
                    }`}
                >
                    {t.label}
                </Link>
            ))}
        </div>
    );
}
