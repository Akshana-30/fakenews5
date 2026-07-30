import Button from "@/components/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "@tanstack/react-form";
import { Check, ChevronsUpDown, CirclePlusIcon } from "lucide-react";
import { useState } from "react";
import z from "zod";
import NewCategoryForm from "./new-category-form";
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { addCategory, getIdFromName, isCategoryNameUnique } from "@/_actions/category-actions";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(1, "Subcategory name is required.").max(100, "Max 100 characters."),
    topCategory: z.string().min(1, "You must select a top category."),
});
type NewSubcategoryValues = z.infer<typeof formSchema>;

export default function NewSubcategoryForm({ categories = [] }: { categories: Category[] }) {
    const [loading, setLoading] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const topLevelCategories: Category[] = [];
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState("");

    //console.log(categories);
    for (const c of categories) {
        if (c.parentId === null) {
            topLevelCategories.push(c);
        }
    }

    const form = useForm({
        defaultValues: {
            name: "",
            topCategory: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            const isNameUnique = await isCategoryNameUnique(value.name);
            if (isNameUnique.success && isNameUnique.data === false) {
                toast.error("Category name must be unique.", { position: "top-center" });
                setLoading(false);
                return;
            }
            const parent = await getIdFromName(value.topCategory);
            if (parent.success && parent.data) {
                const res = await addCategory(value.name, parent.data.id);
                if (res.success && res.data) {
                    toast.success(
                        `Category "${res.data.name}" was succesfully added to the database.`,
                        {
                            position: "top-center",
                        },
                    );
                } else {
                    toast.error(
                        "An error occurred when trying to add a new subcategory.\n\n" + res.error,
                    );
                }
            } else {
                toast.error("Couldn't fetch parent ID.\n\n" + parent.error);
                setLoading(false);
                return;
            }
            form.reset();
            setLoading(false);
        },
    });
    return (
        <form id="create-subcategory-form">
            <FieldGroup>
                <form.Field name="topCategory">
                    {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>Top category</FieldLabel>
                                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
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
                                            {field.state.value || "Select a top category ..."}
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
                                                <CommandEmpty>No category found.</CommandEmpty>
                                                <CommandGroup>
                                                    <Dialog>
                                                        <DialogTrigger>
                                                            <CommandItem>
                                                                <CirclePlusIcon className="mr-2 h-4 w-4" />
                                                                New category
                                                            </CommandItem>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogTitle>New category</DialogTitle>
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
                                                                    selectedCategoryName ===
                                                                    cat.name
                                                                        ? ""
                                                                        : cat.name;
                                                                setSelectedCategoryName(next);
                                                                field.handleChange(next);
                                                                setCategoryOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedCategoryName ===
                                                                        cat.name
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
                            </Field>
                        );
                    }}
                </form.Field>
                <form.Field name="name">
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
                    form="create-subcategory-form"
                >
                    Reset
                </Button>
                <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    className="cursor-pointer"
                    disabled={loading}
                    form="create-subcategory-form"
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
