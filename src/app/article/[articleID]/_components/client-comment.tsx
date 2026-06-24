"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import CommentaryReactions from "./commentary-reactions";
import { format } from "date-fns";
import { useState, type ReactNode } from "react";
import ReplyForm from "./reply-form";
import { Children } from "react";
import DeleteCommentButton from "../manage-comments/_components/delete-comment-button";

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

type UserInfo = {
    id: string;
    userId: string;
    phoneNumber: string | null;
    address_id: string;
    birthdate: Date;
};
type User = {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: string | null;
    banned: boolean | null;
    banReason: string | null;
    banExpires: Date | null;
};
type AllUserData = { userInfoTable: UserInfo; user: User };

export default function ClientComment({
    num,
    comment,
    commentAuthor,
    currentUserId,
    userReaction,
    articleId,
    level,
    parentComment,
    canDelete = false,
    children,
}: {
    num: number;
    comment: CommentData;
    commentAuthor: AllUserData;
    currentUserId: string;
    userReaction: number | undefined;
    articleId: string;
    level: number;
    parentComment: string | null;
    canDelete: boolean;
    children?: ReactNode;
}) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const totalReactions = comment.reactions.reduce((acc, r) => acc + r.val, 0);
    const replies = Children.toArray(children);
    return (
        <div className="mx-auto">
            <Card className="mb-5">
                <CardHeader className="border-b">
                    <div className="flex items-center">
                        <div className="mr-auto">
                            {level === 0 ? (
                                <strong className="font-extrabold">#{num + 1}</strong>
                            ) : (
                                <span>#{num + 1}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mx-auto font-normal">
                            <span>
                                by {commentAuthor.user.name}{" "}
                                {format(comment.createdAt, "yyyy-MM-dd HH:mm")}
                            </span>
                        </div>

                        <Button
                            className="cursor-pointer"
                            onClick={() => setShowReplyForm((f) => !f)}
                        >
                            {showReplyForm ? "Cancel" : "Reply"}
                        </Button>

                        {canDelete ? <DeleteCommentButton commentId={comment.id} /> : ""}
                    </div>
                </CardHeader>
                <CardContent>
                    <p>{comment.content}</p>
                </CardContent>
                <CardFooter className="flex p-2 items-center">
                    <div className="flex w-full justify-between">
                        <CommentaryReactions
                            commentId={comment.id}
                            userId={currentUserId}
                            userReaction={userReaction}
                            num={totalReactions}
                        />
                        <div>
                            {replies.length > 4 && (
                                <Button className="mx-auto" onClick={() => setCollapsed((c) => !c)}>
                                    {collapsed ? "Show replies" : "Hide replies"}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardFooter>
            </Card>

            {showReplyForm && (
                <ReplyForm
                    articleId={articleId}
                    replyTo={level > 1 ? parentComment : comment.id}
                    edit={false}
                    onDone={() => setShowReplyForm(false)}
                />
            )}

            {!collapsed && children}
        </div>
    );
}
