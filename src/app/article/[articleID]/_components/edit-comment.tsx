"use client";
import { updateComment } from "@/_actions/comment-actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const formSchema = z.object({
    comment: z
        .string()
        .min(1, "Comment has to be at least one character.")
        .max(2000, "Comment can't be longer than 2000 characters."),
});

export default function EditComment({ id, content }: { id: string; content: string }) {
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
            const updatedComment = await updateComment(id, value.comment);
            setLoading(false);
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
