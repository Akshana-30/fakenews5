"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/upload-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Editor } from "@/components/tiptap";
import Image from "next/image";
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
import z from "zod";
import { useState } from "react";
import addArticle from "../_actions/add-article-action";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NewCategoryForm from "./new-category-form";
import { Category } from "@/lib/types";
import NewSubcategoryForm from "./new-subcategory-form";
import { Textarea } from "@/components/ui/textarea";

type AddArticleResult = Awaited<ReturnType<typeof addArticle>>;

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
type AddArticleValues = z.infer<typeof formSchema>;

export default function AddArticleForm({ categories }: { categories: Category[] }) {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [subcategoryOpen, setSubcategoryOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const [subcategorySearch, setSubcategorySearch] = useState("");
    const topLevelCategories: Category[] = [];
    const subCategories: Category[] = [];
    const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>([]);
    const [selectedSubcategoryNames, setSelectedSubcategoryNames] = useState<string[]>([]);
    const [authorInput, setAuthorInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    for (const c of categories) {
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
            title: "",
            summary: "",
            content: "",
            image: "",
            category: "",
            subcategory: "",
            location: "",
            author: [] as string[],
        },
        validators: {
            onSubmit: formSchema,
        },

        onSubmit: async ({ value }) => {
            setLoading(true);
            const result = await addArticle(value as AddArticleValues);

            if (result.success === false && result.error) {
                toast.error(result.error, { position: "top-center" });
                setLoading(false);
                return;
            }

            toast.success("Article was added to The Daily Commit database", {
                position: "bottom-right",
            });
            router.push("/");
            setLoading(false);
        },
    });

    return (
        <Card className="w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Create a new article</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    id="create-article-form"
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
                                                className="mt-2 h-28 w-auto rounded object-cover border"
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
                                            <FieldLabel htmlFor={field.name}>
                                                Top level categories
                                            </FieldLabel>
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
                                                                            const next =
                                                                                selectedCategoryNames.includes(
                                                                                    cat.name,
                                                                                )
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
                                                                                next,
                                                                            );
                                                                            field.handleChange(
                                                                                next.join(", "),
                                                                            );
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
                                                <FieldLabel htmlFor={field.name}>
                                                    Subcategories
                                                </FieldLabel>
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
                            <div className="">
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
                                                            className=" px-2 py-1 rounded mr-1 mt-1 text-xs"
                                                            key={index}
                                                        >
                                                            {`${name} `}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    field.removeValue(index)
                                                                }
                                                                className="hover:opacity-100 opacity-50"
                                                            >
                                                                ✕
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="relative flex items-center">
                                                    <Input
                                                        className="border pr-16 "
                                                        value={authorInput}
                                                        onChange={(ev) =>
                                                            setAuthorInput(ev.target.value)
                                                        }
                                                        onKeyDown={(ev) =>
                                                            ev.key === "Enter" && handleAdd()
                                                        }
                                                        placeholder="..Adam Lundvall, Tobias"
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
                            </div>

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
                    form="create-article-form"
                    type="reset"
                    size="lg"
                    className="cursor-pointer"
                    variant="outline"
                    onClick={() => form.reset()}
                >
                    Reset
                </Button>
                <Button
                    form="create-article-form"
                    type="submit"
                    size="lg"
                    className="cursor-pointer"
                    disabled={loading || imageUploading}
                >
                    {loading ? <Spinner /> : "Submit"}
                </Button>
            </CardFooter>
        </Card>
    );
}
