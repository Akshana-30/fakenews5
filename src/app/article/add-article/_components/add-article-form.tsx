"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import addArticle from "../_actions/add-article-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
  summary: z
    .string()
    .min(1, "Summary is required")
    .max(200, "Between 1-200 characters"),
  content: z.string().min(1, "Content text is required"),
  image: z.string(),
  category: z.array(z.string()),
  location: z.string(),
  author: z.array(z.string()),
});

type UserSuggestion = {
  id: string;
  name: string;
  role?: string ;
};

export default function AddArticleForm() {
  const [categoryInput, setCategoryInput] = useState("");
  const [authorOpen, setAuthorOpen] = useState(false);
  const [authorSearch, setAuthorSearch] = useState("");
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      image: "",
      category: [] as string[],
      location: "",
      author: [] as string[],
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const result = await addArticle(value);
      if (result.success === false && result.error) {
        toast.error(result.error, { position: "top-center" });
        setLoading(false);
      } else {
        toast.success("Article was added to Fakenews5 database", {
          position: "bottom-right",
        });
        router.push("/");
        setLoading(false);
      }
    },
  });

  const handleAuthorSearch = async (value: string) => {
    setAuthorSearch(value);

    if (value.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const { data } = await authClient.admin.listUsers({
      query: {
        searchValue: value,
        searchField: "name",
      },
    });

    const filtered = (data?.users ?? []).filter(
      (user) => user.role === "editor" || user.role === "admin",
    );

    setSuggestions(filtered);
  };

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

            <form.Field name="content">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Content</FieldLabel>
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

            <form.Field name="summary">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Summary</FieldLabel>
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

            <form.Field name="image">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
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

            <div className="flex gap-4">
              <form.Field name="category" mode="array">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  const handleAdd = () => {
                    const names = categoryInput
                      .split(",")
                      .map((n) => n.trim())
                      .filter(Boolean);
                    names.forEach((name) => field.pushValue(name));
                    setCategoryInput("");
                  };

                  return (
                    <Field data-invalid={isInvalid} className="border p-2">
                      <FieldLabel>Category</FieldLabel>
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
                          value={categoryInput}
                          onChange={(ev) => setCategoryInput(ev.target.value)}
                          onKeyDown={(ev) => ev.key === "Enter" && handleAdd()}
                          placeholder="Economy, Sports..."
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

            <div className="flex gap-6">
              <form.Field name="author" mode="array">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  const toggleAuthor = (name: string) => {
                    const index = field.state.value.indexOf(name);
                    if (index === -1) {
                      field.pushValue(name);
                    } else {
                      field.removeValue(index);
                    }
                  };

                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="flex-1 border p-2"
                    >
                      <FieldLabel>Author</FieldLabel>

                      {/* Selected authors as badges */}
                      {field.state.value.length > 0 && (
                        <div className="flex flex-wrap gap-1 px-1 py-2">
                          {field.state.value.map((name, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="gap-1"
                            >
                              {name}
                              <button
                                type="button"
                                onClick={() => field.removeValue(index)}
                                className="ml-1 hover:opacity-100 opacity-50"
                              >
                                ✕
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Popover + Command dropdown */}
                      <Popover open={authorOpen} onOpenChange={setAuthorOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={authorOpen}
                            className="w-full justify-between"
                          >
                            {field.state.value.length > 0
                              ? `${field.state.value.length} author(s) selected`
                              : "Search editors or admins..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder="Search by name..."
                              value={authorSearch}
                              onValueChange={handleAuthorSearch}
                            />
                            <CommandList>
                              {authorSearch.length > 0 &&
                                suggestions.length === 0 && (
                                  <CommandEmpty>
                                    No editors or admins found.
                                  </CommandEmpty>
                                )}
                              {suggestions.length > 0 && (
                                <CommandGroup heading="Editors & Admins">
                                  {suggestions.map((user) => (
                                    <CommandItem
                                      key={user.id}
                                      value={user.name}
                                      onSelect={() => toggleAuthor(user.name)}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.state.value.includes(user.name)
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      <span>{user.name}</span>
                                      <Badge
                                        variant="outline"
                                        className="ml-auto capitalize text-xs"
                                      >
                                        {user.role}
                                      </Badge>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
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
          onClick={() => form.reset()}
        >
          Reset
        </Button>
        <Button
          form="create-article-form"
          type="submit"
          size="lg"
          className="cursor-pointer"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  );
}
