type Comment = {
    id: string;
    articleId: string;
    user_id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    replyTo: string | null;
    reactions: CommentReaction[];
};

type CommentReaction = {
    id: string;
    commentId: string;
    userId: string;
    val: number;
};

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import CommentItem from "./comment-item";
export default function CommentarySection({
    articleId,
    comments,
}: {
    articleId: string;
    comments: Comment[];
}) {
    const topLevelComments = [];
    for (const c of comments) {
        if (!c.replyTo) {
            topLevelComments.push(c);
        }
    }

    return (
        <div>
            {topLevelComments.map((c, i) => {
                return <CommentItem key={i} num={i} data={c} articleId={articleId} level={0} />;
            })}
        </div>
    );
}
