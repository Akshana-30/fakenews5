/* eslint-disable react-hooks/static-components */
"use client";
import CommentaryReactions from "./commentary-reactions";
import { format, isAfter } from "date-fns";
import { type ReactNode } from "react";
import ReplyForm from "./reply-form";
import { Children } from "react";
import DeleteCommentButton from "../manage-comments/_components/delete-comment-button";
import { updateComment } from "@/_actions/comment-actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import CommentAvatar from "./comment-avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ArrowDown } from "lucide-react";
const formSchema = z.object({
    comment: z
        .string()
        .min(1, "Comment has to be at least one character.")
        .max(2000, "Comment can't be longer than 2000 characters."),
});

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
    canEdit,
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
    canEdit: boolean;
    canDelete: boolean;
    children?: ReactNode;
}) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const totalReactions = comment.reactions.reduce((acc, r) => acc + r.val, 0);
    const replies = Children.toArray(children);

    const hasBeenEdited = isAfter(comment.updatedAt, comment.createdAt);

    function EditComment({ id, content }: { id: string; content: string }) {
        const [loading, setLoading] = useState(false);
        const router = useRouter();
        const form = useForm({
            defaultValues: {
                comment: content,
            },
            validators: {
                onSubmit: formSchema,
            },
            onSubmit: async ({ value }) => {
                setLoading(true);
                await updateComment(id, value.comment);
                setShowEditForm(false);
                setLoading(false);
                router.refresh();
            },
        });

        return (
            <div>
                <form
                    id="comment"
                    onSubmit={(ev) => {
                        ev.preventDefault();
                        form.handleSubmit(ev);
                    }}
                >
                    <FieldGroup>
                        <form.Field name="comment">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <Textarea
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(ev) => field.handleChange(ev.target.value)}
                                        />
                                    </Field>
                                );
                            }}
                        </form.Field>
                        <div className="items-center justify-center flex gap-2">
                            <Button
                                className="cursor-pointer"
                                type="reset"
                                variant={"outline"}
                                onClick={() => form.reset()}
                                size={"xs"}
                            >
                                Clear
                            </Button>
                            <Button
                                className="cursor-pointer"
                                type="submit"
                                disabled={loading}
                                form="comment"
                                size={"xs"}
                            >
                                {loading ? <Spinner /> : "Submit"}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </div>
        );
    }

    return (
        <div className="flex mb-5 justify-center w-full mt-4">
            <div className="relative w-5 shrink-0 h-5 mx-2 hidden md:block">
                <div className="absolute -left-11 w-14 h-14 rounded-full bg-muted-foreground">
                    <div className="flex justify-center mt-0.5">
                        <CommentAvatar
                            imageUrl={commentAuthor.user.image ?? undefined}
                            fallbackTxt={commentAuthor.user.name[0]}
                            size="lg"
                        />
                    </div>
                </div>
                <div className="bg-muted-foreground ml-2.5 mt-4.5 h-5 w-3 [clip-path:polygon(0%_0%,100%_50%,0%_100%)]" />
            </div>

            <div className="w-full border-l-2 border-muted-foreground">
                <div className="">
                    <div className="border-b bg-chart-5 dark:bg-chart-4 py-1 sm:py-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center ml-2">
                                <div className="sm:hidden block">
                                    <CommentAvatar
                                        imageUrl={commentAuthor.user.image ?? undefined}
                                        fallbackTxt={commentAuthor.user.name[0]}
                                        size="sm"
                                    />
                                </div>
                                <div className="ml-2">
                                    <span className="hidden sm:block">
                                        {commentAuthor.user.name}
                                    </span>
                                </div>
                            </div>
                            <div className="sm:hidden">
                                <HoverCard openDelay={10} closeDelay={100}>
                                    <HoverCardTrigger asChild>
                                        <Button variant="link" className="cursor-pointer">
                                            Info <ArrowDown />
                                        </Button>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-auto max-w-sm">
                                        <h3 className="font-semibold">Comment #{num + 1}</h3>
                                        <div>
                                            <p>
                                                Written by {commentAuthor.user.name}{" "}
                                                {format(comment.createdAt, "yyyy-MM-dd HH:mm")}
                                            </p>
                                            {hasBeenEdited && (
                                                <p>
                                                    Edited:{" "}
                                                    {format(comment.updatedAt, "yyyy-MM-dd HH:mm")}
                                                </p>
                                            )}
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                            {hasBeenEdited && (
                                <p className="hidden sm:block">
                                    Edited: {format(comment.updatedAt, "yyyy-MM-dd HH:mm")}
                                </p>
                            )}
                            <div className="hidden gap-2 mx-5 justify-center sm:flex">
                                {format(comment.createdAt, "yyyy-MM-dd HH:mm")}
                                {level === 0 ? (
                                    <strong className="font-extrabold">#{num + 1}</strong>
                                ) : (
                                    <span>#{num + 1}</span>
                                )}
                                {canDelete ? <DeleteCommentButton commentId={comment.id} /> : ""}
                            </div>
                        </div>
                    </div>
                    <div className="px-5 py-2 bg-background">
                        {showEditForm ? (
                            <EditComment id={comment.id} content={comment.content} />
                        ) : (
                            <p>{comment.content}</p>
                        )}
                    </div>
                    <div className="flex items-center px-5 bg-muted dark:bg-background">
                        <div className="flex w-full justify-between ">
                            <CommentaryReactions
                                commentId={comment.id}
                                userId={currentUserId}
                                userReaction={userReaction}
                                num={totalReactions}
                            />
                            <div className="p-1 flex gap-1">
                                {replies.length > 4 && (
                                    <Button
                                        className="mx-auto"
                                        size="xs"
                                        onClick={() => setCollapsed((c) => !c)}
                                    >
                                        {collapsed ? "Show replies" : "Hide replies"}
                                    </Button>
                                )}
                                {currentUserId === commentAuthor.user.id && <Button>Edit</Button>}
                                <Button
                                    className="cursor-pointer"
                                    size="xs"
                                    onClick={() => setShowReplyForm((f) => !f)}
                                >
                                    {showReplyForm ? "Cancel" : "Reply"}
                                </Button>
                                {canEdit && (
                                    <Button
                                        className="cursor-pointer"
                                        size="xs"
                                        onClick={() => setShowEditForm((f) => !f)}
                                    >
                                        {showEditForm ? "Cancel" : "Edit"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {showReplyForm && (
                    <ReplyForm
                        articleId={articleId}
                        replyTo={level > 1 ? parentComment : comment.id}
                        edit={false}
                        onDone={() => setShowReplyForm(false)}
                    />
                )}

                {!collapsed && children && <div className="relative pl-6 pb-2">{children}</div>}
            </div>
        </div>
    );
}
