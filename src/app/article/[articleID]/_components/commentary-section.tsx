import CommentItem from "./comment-item";
import CommentarySectionClient from "./commentary-section-client";

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

export default function CommentarySection({
    articleId,
    comments,
}: {
    articleId: string;
    comments: Comment[];
}) {
    const topLevel = comments.filter((c) => !c.replyTo);

    const renderedComments = topLevel.map((c, i) => (
        <CommentItem key={c.id} num={i} data={c} articleId={articleId} level={0} />
    ));

    return (
        <CommentarySectionClient totalCount={topLevel.length}>
            {renderedComments}
        </CommentarySectionClient>
    );
}
