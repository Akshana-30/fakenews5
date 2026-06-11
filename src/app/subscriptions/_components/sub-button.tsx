"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { User } from "better-auth";

export default function SubButton({ plan, disabled }: { plan: string; disabled: boolean }) {
    const handleClick = async () => {
        console.log(plan);
        await authClient.subscription.upgrade({
            plan: plan,
            successUrl: "http://localhost:3000/dashboard/profile/sub",
        });
    };

    return (
        <Button className="cursor-pointer" onClick={() => handleClick()} disabled={disabled}>
            Subscribe
        </Button>
    );
}
