"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import editArticle, { CategoryConflict } from "../_actions/edit-article-action";
import { Editor } from "@/components/tiptap";
import { uploadImage } from "@/lib/upload-action";
import Image from "next/image";
import { categoryArray } from "@/lib/category";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, CirclePlusIcon } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Category } from "@/lib/types";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NewCategoryForm from "@/app/article/add-article/_components/new-category-form";
import NewSubcategoryForm from "@/app/article/add-article/_components/new-subcategory-form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    title: z.string().min(1, "Title is required.").max(100, "Max 100 characters."),
    summary: z.string().min(1, "Summary is required.").max(1000, "Between 1-1000 characters."),
    content: z.string().min(1, "Content text is required."),
    image: z.string(),
    category: z.string(),
    subcategory: z.string(),
    location: z.string(),
    author: z.array(z.string()),
});
type EditArticleValues = z.infer<typeof formSchema>;

type EditArticleFormProps = {
    title: string;
    summary: string | "";
    content: string;
    image: string | "";
    location: string | "";
    category: string;
    subcategory: string;
    author: string[];
};

export default function EditArticleForm({
    articleId,
    defaultValues,
    allCategories,
}: {
    articleId: string;
    defaultValues: EditArticleFormProps;
    allCategories: Category[];
}) {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [subcategoryOpen, setSubcategoryOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const [subcategorySearch, setSubcategorySearch] = useState("");
    const topLevelCategories: Category[] = [];
    const subCategories: Category[] = [];
    const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>(() =>
        defaultValues.category ? defaultValues.category.split(", ").filter(Boolean) : [],
    );
    const [selectedSubcategoryNames, setSelectedSubcategoryNames] = useState<string[]>(() =>
        defaultValues.subcategory ? defaultValues.subcategory.split(", ").filter(Boolean) : [],
    );
    const [authorInput, setAuthorInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    console.log(allCategories);

    for (const c of allCategories) {
        if (c.parentId === null) {
            topLevelCategories.push(c);
        } else {
            subCategories.push(c);
        }
    }

    const selectedCategoryIds = topLevelCategories
        .filter((cat) => selectedCategoryNames.includes(cat.name))
        .map((cat) => String(cat.id));

    const filteredSubCategories = subCategories.filter((cat) =>
        selectedCategoryIds.includes(String(cat.parentId)),
    );

    const router = useRouter();
    const form = useForm({
        defaultValues: {
            title: defaultValues.title,
            summary: defaultValues.summary ?? "",
            content: defaultValues.content,
            image: defaultValues.image,
            category: defaultValues.category,
            subcategory: defaultValues.subcategory,
            location: defaultValues.location ?? "",
            author: defaultValues.author,
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            alert(value.title);
            setLoading(false);
        },
    });

    return (
        <Card className="w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Edit article</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    id="edit-article-form"
                    onSubmit={(ev) => {
                        ev.preventDefault();
                        form.handleSubmit(ev);
                    }}
                >
                    <FieldGroup>
                        <form.Field name="title">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                                        <Input
                                            className="border-r border-b"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(ev) => field.handleChange(ev.target.value)}
                                            aria-invalid={isInvalid}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="summary">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Summary</FieldLabel>
                                        <Textarea
                                            className="border-r border-b"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(ev) => field.handleChange(ev.target.value)}
                                            aria-invalid={isInvalid}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="content">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                                        <Editor
                                            initialMarkdown={field.state.value}
                                            onChange={(markdown) => {
                                                field.handleChange(markdown);
                                                field.handleBlur();
                                            }}
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <form.Field name="image">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;

                                const handleFileChange = async (
                                    ev: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    const file = ev.target.files?.[0];
                                    if (!file) return;

                                    setImageUploading(true);

                                    const fd = new FormData();
                                    fd.append("file", file);

                                    const result = await uploadImage(fd);

                                    if ("error" in result) {
                                        toast.error(result.error, { position: "top-center" });
                                        field.handleChange("");
                                    } else {
                                        field.handleChange(result.url);
                                    }

                                    field.handleBlur();
                                    setImageUploading(false);
                                };

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Image</FieldLabel>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="border-r border-b"
                                            id={field.name}
                                            name={field.name}
                                            onChange={handleFileChange}
                                            disabled={imageUploading}
                                            aria-invalid={isInvalid}
                                        />

                                        {imageUploading && (
                                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                <Spinner className="size-4" />
                                                Uploading ...
                                            </div>
                                        )}

                                        {field.state.value && !imageUploading && (
                                            <Image
                                                src={field.state.value}
                                                alt="Selected article image preview"
                                                width={100}
                                                height={100}
                                                className="mt-2 h-100 w-auto rounded object-contain"
                                            />
                                        )}

                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <div className="border">
                            <form.Field name="category">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;

                                    return (
                                        <Field data-invalid={isInvalid} className="p-2">
                                            <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                                            <Popover
                                                open={categoryOpen}
                                                onOpenChange={setCategoryOpen}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id={field.name}
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={categoryOpen}
                                                        aria-invalid={isInvalid}
                                                        onBlur={field.handleBlur}
                                                        className="w-full justify-between font-normal"
                                                    >
                                                        {field.state.value ||
                                                            "Select a category ..."}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search category ..."
                                                            value={categorySearch}
                                                            onValueChange={setCategorySearch}
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                No category found.
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                <Dialog>
                                                                    <DialogTrigger>
                                                                        {" "}
                                                                        <CommandItem>
                                                                            <CirclePlusIcon className="mr-2 h-4 w-4" />
                                                                            New category
                                                                        </CommandItem>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogTitle>
                                                                            New category
                                                                        </DialogTitle>
                                                                        <NewCategoryForm />
                                                                    </DialogContent>
                                                                </Dialog>
                                                                {topLevelCategories.map((cat) => (
                                                                    <CommandItem
                                                                        key={cat.name}
                                                                        value={cat.name}
                                                                        onSelect={() => {
                                                                            field.handleBlur();
                                                                            const isSelected =
                                                                                selectedCategoryNames.includes(
                                                                                    cat.name,
                                                                                );
                                                                            const nextCategories =
                                                                                isSelected
                                                                                    ? selectedCategoryNames.filter(
                                                                                          (n) =>
                                                                                              n !==
                                                                                              cat.name,
                                                                                      )
                                                                                    : [
                                                                                          ...selectedCategoryNames,
                                                                                          cat.name,
                                                                                      ];
                                                                            setSelectedCategoryNames(
                                                                                nextCategories,
                                                                            );
                                                                            field.handleChange(
                                                                                nextCategories.join(
                                                                                    ", ",
                                                                                ),
                                                                            );

                                                                            if (isSelected) {
                                                                                // category was unchecked — drop its now-orphaned subcategories too
                                                                                const orphaned =
                                                                                    subCategories
                                                                                        .filter(
                                                                                            (sub) =>
                                                                                                String(
                                                                                                    sub.parentId,
                                                                                                ) ===
                                                                                                String(
                                                                                                    cat.id,
                                                                                                ),
                                                                                        )
                                                                                        .map(
                                                                                            (sub) =>
                                                                                                sub.name,
                                                                                        );

                                                                                const nextSubcategories =
                                                                                    selectedSubcategoryNames.filter(
                                                                                        (n) =>
                                                                                            !orphaned.includes(
                                                                                                n,
                                                                                            ),
                                                                                    );

                                                                                setSelectedSubcategoryNames(
                                                                                    nextSubcategories,
                                                                                );
                                                                                form.setFieldValue(
                                                                                    "subcategory",
                                                                                    nextSubcategories.join(
                                                                                        ", ",
                                                                                    ),
                                                                                );
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                selectedCategoryNames.includes(
                                                                                    cat.name,
                                                                                )
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0",
                                                                            )}
                                                                        />
                                                                        {cat.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>

                            <div className="flex gap-4">
                                <form.Field name="subcategory">
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched && !field.state.meta.isValid;

                                        return (
                                            <Field data-invalid={isInvalid} className="p-2">
                                                <FieldLabel>Subcategories</FieldLabel>

                                                <Popover
                                                    open={subcategoryOpen}
                                                    onOpenChange={setSubcategoryOpen}
                                                >
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            id={field.name}
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={subcategoryOpen}
                                                            aria-invalid={isInvalid}
                                                            onBlur={field.handleBlur}
                                                            className="w-full justify-between font-normal"
                                                        >
                                                            {field.state.value ||
                                                                "Select a category ..."}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                        <Command>
                                                            <CommandInput
                                                                placeholder="Search category..."
                                                                value={subcategorySearch}
                                                                onValueChange={setSubcategorySearch}
                                                            />
                                                            <CommandList>
                                                                <CommandEmpty>
                                                                    No category found.
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    <Dialog>
                                                                        <DialogTrigger>
                                                                            {" "}
                                                                            <CommandItem>
                                                                                <CirclePlusIcon className="mr-2 h-4 w-4" />
                                                                                New category
                                                                            </CommandItem>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogTitle>
                                                                                New category
                                                                            </DialogTitle>
                                                                            <NewSubcategoryForm
                                                                                categories={
                                                                                    topLevelCategories
                                                                                }
                                                                            />
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                    {filteredSubCategories.map(
                                                                        (cat) => (
                                                                            <CommandItem
                                                                                key={cat.name}
                                                                                value={cat.name}
                                                                                onSelect={() => {
                                                                                    field.handleBlur();
                                                                                    const next =
                                                                                        selectedSubcategoryNames.includes(
                                                                                            cat.name,
                                                                                        )
                                                                                            ? selectedSubcategoryNames.filter(
                                                                                                  (
                                                                                                      n,
                                                                                                  ) =>
                                                                                                      n !==
                                                                                                      cat.name,
                                                                                              )
                                                                                            : [
                                                                                                  ...selectedSubcategoryNames,
                                                                                                  cat.name,
                                                                                              ];
                                                                                    setSelectedSubcategoryNames(
                                                                                        next,
                                                                                    );
                                                                                    field.handleChange(
                                                                                        next.join(
                                                                                            ", ",
                                                                                        ),
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-2 h-4 w-4",
                                                                                        selectedSubcategoryNames.includes(
                                                                                            cat.name,
                                                                                        )
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0",
                                                                                    )}
                                                                                />
                                                                                {cat.name}
                                                                            </CommandItem>
                                                                        ),
                                                                    )}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>

                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        );
                                    }}
                                </form.Field>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <form.Field name="author" mode="array">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    const handleAdd = () => {
                                        const names = authorInput
                                            .split(",")
                                            .map((n) => n.trim())
                                            .filter(Boolean);
                                        names.forEach((name) => field.pushValue(name));
                                        setAuthorInput("");
                                    };
                                    return (
                                        <Field
                                            data-invalid={isInvalid}
                                            className="flex-1 border p-2"
                                        >
                                            <FieldLabel>Author</FieldLabel>
                                            <div className="px-4 py-2">
                                                {field.state.value.map((name, index) => (
                                                    <span
                                                        className="px-2 py-1 rounded mr-1 mt-1 text-xs"
                                                        key={index}
                                                    >
                                                        {`${name} `}
                                                        <button
                                                            type="button"
                                                            onClick={() => field.removeValue(index)}
                                                            className="hover:opacity-100 opacity-50"
                                                        >
                                                            ✕
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="relative flex items-center">
                                                <Input
                                                    className="border pr-16"
                                                    value={authorInput}
                                                    onChange={(ev) =>
                                                        setAuthorInput(ev.target.value)
                                                    }
                                                    onKeyDown={(ev) =>
                                                        ev.key === "Enter" && handleAdd()
                                                    }
                                                    placeholder="Author alias"
                                                />
                                                <Button
                                                    size="xs"
                                                    type="button"
                                                    onClick={handleAdd}
                                                    className="absolute right-1 my-auto"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>

                            <form.Field name="location">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid} className="flex-1">
                                            <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                                            <Input
                                                className="border-r border-b"
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(ev) =>
                                                    field.handleChange(ev.target.value)
                                                }
                                                aria-invalid={isInvalid}
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
                <Button
                    form="edit-article-form"
                    type="reset"
                    size="lg"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => form.reset()}
                >
                    Reset
                </Button>
                <Button
                    form="edit-article-form"
                    type="submit"
                    size="lg"
                    className="cursor-pointer"
                    disabled={loading}
                >
                    {loading ? <Spinner /> : "Save changes"}
                </Button>
            </CardFooter>
        </Card>
    );
}
