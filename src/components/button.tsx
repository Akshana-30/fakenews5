"use client";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Spinner } from "@/components/ui/spinner";

type Props = React.ComponentProps<typeof Button>;

export default function BUTTON({ disabled, onClick, children, ...props }: Props) {
    const [isPending, startTransition] = useTransition();

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        if (!onClick) return;
        startTransition(() => onClick(e));
    }

    return (
        <Button
            className="cursor-pointer"
            disabled={isPending || disabled}
            variant="outline"
            onClick={handleClick}
            {...props}
        >
            {isPending ? <Spinner /> : (children ?? "Click me")}
        </Button>
    );
}
