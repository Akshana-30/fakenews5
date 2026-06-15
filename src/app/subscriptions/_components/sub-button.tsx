"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { User } from "better-auth";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function SubButton({
    plan,
    disabled,
    annual,
}: {
    plan: string;
    annual: boolean | undefined;
    disabled: boolean;
}) {
    const [loading, setLoading] = useState(false);
    const handleClick = async () => {
        setLoading(true);
        if (!annual) {
            const res = await authClient.subscription.upgrade({
                plan: plan,
                successUrl: "http://localhost:3000/dashboard/profile/sub",
                returnUrl: "http://localhost:3000/dashboard/profile/sub",
            });
        } else {
            const res = await authClient.subscription.upgrade({
                plan: plan,
                successUrl: "http://localhost:3000/dashboard/profile/sub",
                returnUrl: "http://localhost:3000/dashboard/profile/sub",
                annual: true,
            });
            console.log(res);
        }
        setLoading(false);
    };

    return (
        <Button className="cursor-pointer" onClick={() => handleClick()} disabled={disabled}>
            {loading ? <Spinner /> : "Subscribe"}
        </Button>
    );
}
