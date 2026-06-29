import { MapPin, Star } from "lucide-react";
import type { AdRow } from "@/_actions/ad-actions";
import { CATEGORIES } from "@/app/advertise/private/_data/categories";

function formatPrice(price: number | null, priceType: string): string {
    if (priceType === "free") return "Free";
    if (priceType === "contact") return "Contact for price";
    if (priceType === "negotiable" && price) return `${price.toLocaleString("sv-SE")} kr (neg.)`;
    if (price) return `${price.toLocaleString("sv-SE")} kr`;
    return "Negotiable";
}

function timeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

export default function AdCard({ ad }: { ad: AdRow }) {
    const cat = CATEGORIES.find(c => c.slug === ad.category);
    const isFeatured = ad.tier === "featured";
    const isPlus = ad.tier === "plus";
    const isWanted = ad.listingType === "wanted";

    return (
        <div
            className={`rounded-xl border bg-popover shadow-sm flex flex-col overflow-hidden transition-shadow hover:shadow-md ${
                isFeatured ? "border-amber-400 ring-1 ring-amber-400/40" : ""
            }`}
        >
            {/* Photo */}
            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                {ad.photos[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={ad.photos[0]}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                        No photo
                    </div>
                )}
                {isFeatured && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        <Star size={10} fill="currentColor" /> Featured
                    </span>
                )}
                {isPlus && (
                    <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Plus
                    </span>
                )}
                {isWanted && (
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Wanted
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="p-3 flex flex-col gap-1 flex-1">
                <p className="font-semibold text-sm leading-snug line-clamp-2">{ad.title}</p>

                <p className="font-serif text-base font-bold text-primary mt-0.5">
                    {isWanted ? "Budget: " : ""}{formatPrice(ad.price, ad.priceType)}
                </p>

                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {ad.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2 border-t">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={11} /> {ad.location}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{timeAgo(ad.createdAt)}</span>
                </div>

                {cat && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-primary/70 mt-1">
                        {cat.name} · {ad.subcategory}
                    </span>
                )}
            </div>
        </div>
    );
}
