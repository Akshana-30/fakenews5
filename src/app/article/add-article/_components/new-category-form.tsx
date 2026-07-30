import { addCategory, isCategoryNameUnique } from "@/_actions/category-actions";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
    title: z.string().min(1, "Title is required.").max(25, "Max"),
});

export default function NewCategoryForm() {
    const [loading, setLoading] = useState(false);
    const form = useForm({
        defaultValues: {
            title: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            const isUnique = await isCategoryNameUnique(value.title);
            if (isUnique.success && !isUnique.data) {
                toast.error("Category name must be unique.", { position: "top-center" });
                setLoading(false);
                return;
            }
            const res = await addCategory(value.title, null);
            if (res.success && res.data) {
                toast.success(
                    `Category "${res.data.name}" was succesfully added to the database.`,
                    {
                        position: "top-center",
                    },
                );
            }
            setLoading(false);
        },
    });

    return (
        <form id="create-category-form">
            <FieldGroup>
                <form.Field name="title">
                    {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(ev) => field.handleChange(ev.target.value)}
                                    aria-invalid={isInvalid}
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        );
                    }}
                </form.Field>
            </FieldGroup>
            <div className="flex gap-2 mt-2 justify-center items-center">
                <Button
                    type="reset"
                    size="sm"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => form.reset()}
                    form="create-category-form"
                >
                    Reset
                </Button>
                <Button
                    size="sm"
                    className="cursor-pointer"
                    disabled={loading}
                    form="create-category-form"
                    onClick={(ev) => {
                        ev.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    {loading ? <Spinner /> : "Submit"}
                </Button>
            </div>
        </form>
    );
}
