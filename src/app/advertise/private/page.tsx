import type { Metadata } from "next";
import Link from "next/link";
import {
  Car,
  Anchor,
  Building2,
  Bike,
  Tv,
  Sofa,
  Baby,
  Shirt,
  Flower2,
  Package,
  Mail,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { CATEGORIES } from "./_data/categories";

export const metadata: Metadata = { title: "Classifieds | The Daily Commit" };

const ICONS: Record<string, React.ReactNode> = {
  Car: <Car size={22} />,
  Anchor: <Anchor size={22} />,
  Building2: <Building2 size={22} />,
  Bike: <Bike size={22} />,
  Tv: <Tv size={22} />,
  Sofa: <Sofa size={22} />,
  Baby: <Baby size={22} />,
  Shirt: <Shirt size={22} />,
  Flower2: <Flower2 size={22} />,
  Package: <Package size={22} />,
};

const tiers = [
  {
    name: "Basic",
    price: "Free",
    duration: "7 days",
    features: ["1 photo", "Max 300 characters", "Standard placement"],
  },
  {
    name: "Plus",
    price: "49 kr",
    duration: "21 days",
    features: [
      "Up to 3 photos",
      "Max 800 characters",
      "Highlighted in category listing",
    ],
  },
];

export default function PrivateAdvertisePage() {
  return (
    <div className="h-full flex flex-col mx-auto w-full max-w-5xl px-6 pt-14 pb-16">
      {/* Header */}
      <div className="mb-10">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-primary mb-2">
          Classifieds
        </p>
        <h1 className="font-serif text-4xl font-bold tracking-wide">
          Private Ads
        </h1>
        <p className="mt-2 font-serif italic text-muted-foreground">
          Sell it, find it, swap it — reach thousands of readers in Linköping
          and beyond.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Looking to advertise your business instead?{" "}
          <Link href="/advertise" className="underline hover:opacity-70">
            See our corporate advertising rates.
          </Link>
        </p>
      </div>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="font-serif font-bold text-2xl mb-1">Categories</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click a category to place your ad.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/advertise/private/${cat.slug}`}
              className="rounded-xl border p-4 bg-popover shadow-sm flex gap-3 items-start hover:border-primary hover:bg-primary/5 transition-colors group"
            >
              <div className="mt-0.5 text-primary shrink-0">
                {ICONS[cat.iconName]}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  {cat.examples}
                </p>
              </div>
              <ArrowRight
                size={14}
                className="mt-1 text-muted-foreground group-hover:text-primary transition-colors shrink-0"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mb-12">
        <h2 className="font-serif font-bold text-2xl mb-4">Rates</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="rounded-xl border p-5 bg-popover shadow-sm flex flex-col"
            >
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-primary mb-1">
                {tier.name}
              </p>
              <p className="font-serif text-3xl font-bold mb-0.5">
                {tier.price}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                {tier.duration}
              </p>
              <ul className="space-y-2 mt-auto">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2
                      size={14}
                      className="text-primary mt-0.5 shrink-0"
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          All rates include VAT. Ads may be moderated before publication. The
          Daily Commit reserves the right to reject ads that violate our
          community guidelines or Swedish consumer law.
        </p>
      </section>

      {/* How it works */}
      <section className="mb-12">
        <h2 className="font-serif font-bold text-2xl mb-3">How it works</h2>
        <ol className="space-y-2 text-sm leading-relaxed list-none">
          {[
            "Click a category above to open the ad form.",
            "Fill in your title, description, price, condition, and contact details.",
            "Choose your tier and submit — we review and publish within one business day.",
            "Interested buyers contact you directly via the details you provide.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-serif font-bold text-primary text-lg leading-none w-5 shrink-0">
                {i + 1}.
              </span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="rounded-xl border p-6 bg-popover shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          <Mail size={15} />
          Prefer email?
        </div>
        <p className="text-sm leading-relaxed mb-4 max-w-2xl">
          You can also send your ad text, price, photos, and contact details
          directly to our classifieds desk.
        </p>
        <p className="flex items-center gap-2 text-sm">
          <Mail size={15} className="text-primary" />
          <strong>classifieds@thedailycommit.se</strong>
        </p>
      </section>
    </div>
  );
}
