"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ToggleChoice from "@/_actions/toggle-editors-choice";
import { Circle, CircleCheckBig } from "lucide-react";
import Button from "@/components/button";
import { deleteArticle, restoreArticle } from "@/_actions/article-actions";
import { toast } from "sonner";

type Props = React.ComponentProps<typeof Button> & {
    articleId: string;
    removed: Date | null;
};

export default function RemovedFromSite({ articleId, removed, disabled, ...props }: Props) {
    const router = useRouter();
    const [isRemoved, setIsRemoved] = useState(removed);

    async function handleClick() {
        if (isRemoved == null) {
            const newValue = await deleteArticle(articleId);
            if (newValue.success && newValue.data) {
                toast.success(`Successfully removed article "${newValue.data.title}" from site.`);
                setIsRemoved(newValue.data.deleted);
                router.refresh();
            } else if (newValue.success == false && newValue.error) {
                toast.error(`Couldn't remove article from site.${newValue.error}`);
            }
        } else {
            const newValue = await restoreArticle(articleId);
            if (newValue.success && newValue.data) {
                toast.success(
                    `Successfully restored article "${newValue.data.title}" to the site.`,
                );
                setIsRemoved(null);
                router.refresh();
            } else if (newValue.success === false && newValue.error) {
                toast.error(`Couldn't restore article to the site.${newValue.error}`);
            }
        }
    }
    return (
        <button className="cursor-pointer" onClick={handleClick} disabled={disabled} {...props}>
            {isRemoved ? <CircleCheckBig /> : <Circle />}
        </button>
    );
}
