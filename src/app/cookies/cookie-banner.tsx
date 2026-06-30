"use client";

import { useState } from "react";
import { saveConsent } from "@/lib/cookie-actions";
import Link from "next/link";
import Button from "@/components/button";

export function CookieBanner() {
    const [visible, setVisible] = useState(true);

    async function handleConsent() {
        await saveConsent(true);
        setVisible(false);
    }

    if (visible) {
        return (
            <div className="sticky top-0 z-90 bg-secondary justiy-center items-center">
                <div className="my-auto">
                    <div className="items-center justify-center relative p-2 z-20 text-xs md:w-2xl mx-auto my-auto">
                        <div className="flex">
                            <p className="dark:text-white">
                                This site uses essential cookies only. Disabling cookies may affect
                                how the site functions. You may not be able to stay signed in, if
                                you disable cookies. You can{" "}
                                <Link href="/cookies" className="underline hover:text-primary">
                                    read more
                                </Link>{" "}
                                here.
                            </p>
                            <Button variant={"default"} onClick={handleConsent}>
                                I understand
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
}
