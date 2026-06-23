"use client";

import { BookmarkCheckIcon, BookmarkIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { addBookmark, isBookmarked, removeBookmark } from "@/_actions/bookmark-actions";
import { Button } from "./ui/button";

type BookmarkButtonProps = React.ComponentProps<typeof Button> & {
    articleId: string;
};

const BOOKMARK_ROLES = ["admin", "editor", "basic", "pro"] as const;

export function BookmarkButton({ articleId, ...props }: BookmarkButtonProps) {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isPending, startTransition] = useTransition();

    const { data: session } = authClient.useSession();
    const userId = session?.user.id;

    const canBookmark = BOOKMARK_ROLES.includes(
        session?.user.role as (typeof BOOKMARK_ROLES)[number],
    );

    useEffect(() => {
        if (!userId || !canBookmark) return;

        async function checkBookmark() {
            const bookmarked = await isBookmarked(articleId);
            setIsEnabled(bookmarked);
        }

        checkBookmark();
    }, [userId, articleId, canBookmark]);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const nextState = !isEnabled;
        setIsEnabled(nextState);

        startTransition(async () => {
            if (nextState) await addBookmark(articleId);
            else await removeBookmark(articleId);
        });
    };

    return (
        <Button
            disabled={isPending || !session || !canBookmark}
            onClick={handleToggle}
            suppressHydrationWarning
            {...props}
        >
            {isEnabled ? <BookmarkCheckIcon /> : <BookmarkIcon />}
        </Button>
    );
}
