"use client";

import { useEffect, useRef } from "react";
import { getConsent, markArticleAsViewed } from "@/lib/cookie-actions";

export default function MarkViewed({ articleId }: { articleId: string }) {
    const fired = useRef(false);

    useEffect(() => {
        if (fired.current) return;
        fired.current = true;
        markArticleAsViewed(articleId);
    }, [articleId]);

    return null;
}
