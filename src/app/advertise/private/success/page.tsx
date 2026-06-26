import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Ad submitted — Classifieds | The Daily Commit" };

export default function ClassifiedsSuccessPage() {
    return (
        <div className="mx-auto w-full max-w-lg px-6 pt-20 pb-16 flex flex-col items-center text-center gap-5">
            <CheckCircle2 size={52} className="text-primary" />

            <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-primary mb-1">
                    Classifieds
                </p>
                <h1 className="font-serif text-3xl font-bold">Payment received!</h1>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Thank you — your ad has been submitted and your payment was successful.
                    We&apos;ll review it and publish it within one business day. A receipt
                    has been sent to your email address.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Button asChild>
                    <Link href="/advertise/private">Place another ad</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/">Back to front page</Link>
                </Button>
            </div>
        </div>
    );
}
