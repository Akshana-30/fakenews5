"use client";

import { addComment } from "@/_actions/comment-actions";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
    reply: z
        .string()
        .min(1, "You can't leave an empty comment.")
        .max(2000, "Comment can't be longer than 2000 characters."),
});

export default function ReplyForm({
    articleId,
    replyTo,
    edit,
    onDone,
}: {
    articleId: string;
    replyTo: string | null;
    edit: boolean;
    onDone?: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const form = useForm({
        defaultValues: {
            reply: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            const comment = await addComment(articleId, value.reply, replyTo);
            if (comment.success === false) {
                toast.error(`Couldn't save reply to the database.\n\n${comment.error}`, {
                    position: "top-center",
                });
            }
            form.reset();
            setLoading(false);
            router.refresh();
            onDone?.();
        },
    });

    return (
        <div className="dark:bg-chart-4 p-2">
            <form
                id="reply"
                onSubmit={(ev) => {
                    ev.preventDefault();
                    form.handleSubmit(ev);
                }}
            >
                <FieldGroup>
                    <form.Field name="reply">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <Textarea
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(ev) => field.handleChange(ev.target.value)}
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            );
                        }}
                    </form.Field>
                </FieldGroup>
                <div className="flex gap-2 justify-center p-1">
                    <Button type="reset" variant="outline" onClick={() => form.reset()} size="xs">
                        Clear
                    </Button>
                    <Button type="submit" disabled={loading} form="reply" size="xs">
                        {loading ? <Spinner /> : "Submit"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
