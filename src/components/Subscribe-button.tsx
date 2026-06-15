"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";

export default function SubButton() {
    const handleClick = async () => {
        await authClient.subscription.upgrade({
            plan: "Basic", // USE DATABASE NAME
            successUrl: "http://localhost:3000",
        });
    };

    return <Button onClick={() => handleClick()}>Subscribe</Button>;
}
