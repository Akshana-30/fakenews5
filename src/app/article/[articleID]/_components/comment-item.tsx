import { getAllUserDataFromId, getUserId } from "@/_actions/user-actions";
import { getReplies, getUserReaction } from "@/_actions/comment-actions";
import ClientComment from "./client-comment";

type CommentData = {
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

export default async function CommentItem({
  num,
  data,
  level,
  articleId,
}: {
  num: number;
  data: CommentData;
  level: number;
  articleId: string;
}) {
  const userData = await getAllUserDataFromId(data.user_id);
  const currentUserId = await getUserId();

  let userReaction: number | undefined;
  let reaction;
  if (currentUserId) {
    reaction = await getUserReaction(data.id, currentUserId);
  }
  if (reaction && reaction.success && reaction.data) {
    userReaction = reaction.data;
  }

  const replies = await getReplies(data.id);

  if (
    !(
      userData.success &&
      userData.data &&
      replies?.success &&
      replies.data &&
      currentUserId
    )
  ) {
    return null;
  }
  const renderedReplies = replies.data.map((c, i) => (
    <div className="ml-6" key={c.id}>
      <CommentItem num={i} data={c} articleId={articleId} level={level + 1} />
    </div>
  ));

  return (
    <ClientComment
      num={num}
      comment={data}
      commentAuthor={userData.data}
      currentUserId={currentUserId}
      userReaction={userReaction}
      articleId={articleId}
      level={level}
      parentComment={data.replyTo}
    >
      {renderedReplies}
    </ClientComment>
  );
}
