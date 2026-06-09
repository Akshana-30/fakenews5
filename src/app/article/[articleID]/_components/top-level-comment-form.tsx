"use client";
import { addComment } from "@/_actions/comment-actions";
import Button from "@/components/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
    comment: z
        .string()
        .min(1, "Comment has to be at least one character.")
        .max(2000, "Comment can't be longer than 2000 characters."),
});

export default function TopLevelCommentForm({ articleId }: { articleId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const form = useForm({
        defaultValues: {
            comment: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            const comment = await addComment(articleId, value.comment, null);
            if (comment.success === false) {
                toast.error(
                    `An unknown error occurred while trying to save comment to the database.\n\n${comment.error}`,
                );
            }
            form.reset();
            setLoading(false);
            router.refresh();
        },
    });

    return (
        <div>
            <Card className="md:w-2xl mx-auto mb-4">
                <CardHeader>
                    <CardTitle className="flex">
                        <div className="mr-auto">Leave a comment ...</div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
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
                                                onChange={(ev) =>
                                                    field.handleChange(ev.target.value)
                                                }
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex gap-2 justify-center p-1">
                    <Button type="reset" variant="outline" onClick={() => form.reset()}>
                        Clear
                    </Button>
                    <Button type="submit" disabled={loading} form="comment">
                        {loading ? <Spinner /> : "Submit"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
