import type { Metadata } from "next";
import Link from "next/link";
import { getAds } from "@/_actions/ad-actions";
import AdCard from "./_components/ad-card";
import CategoryFilter from "./_components/category-filter";

export const metadata: Metadata = { title: "Marketplace | Fakenews5" };

type Props = { searchParams: Promise<{ category?: string }> };

export default async function MarketplacePage({ searchParams }: Props) {
    const { category } = await searchParams;
    const result = await getAds(category);
    const ads = result.success ? result.data : [];

    return (
        <div className="w-full max-w-5xl mx-auto px-6 pt-10 pb-16">
            {/* Header */}
            <div className="mb-8">
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-primary mb-1">
                    Marketplace
                </p>
                <h1 className="font-serif text-4xl font-bold tracking-wide">Buy &amp; Sell</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Private ads from people in Linköping and beyond.{" "}
                    <Link href="/advertise/private" className="underline hover:opacity-70">
                        Place your own ad →
                    </Link>
                </p>
            </div>

            {/* Category filter */}
            <div className="mb-6">
                <CategoryFilter activeCategory={category} />
            </div>

            {/* Ad count */}
            {ads.length > 0 && (
                <p className="text-xs text-muted-foreground mb-4">
                    {ads.length} {ads.length === 1 ? "ad" : "ads"}
                    {category ? ` in ${category.replace(/-/g, " ")}` : ""}
                </p>
            )}

            {/* Grid */}
            {ads.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="font-serif text-lg">No ads yet.</p>
                    <p className="text-sm mt-1">
                        Be the first —{" "}
                        <Link href="/advertise/private" className="underline hover:opacity-70">
                            place an ad
                        </Link>
                        .
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {ads.map(ad => (
                        <AdCard key={ad.id} ad={ad} />
                    ))}
                </div>
            )}
        </div>
    );
}
