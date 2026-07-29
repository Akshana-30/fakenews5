"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { updateCategory } from "../_actions/edit-category-action";
import type { Category } from "@/lib/types";

type Props = {
    category: Category;
    availableParents: Category[];
};

export default function EditCategoryForm({ category, availableParents }: Props) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState(category.name);
    const [parentId, setParentId] = useState<string>(category.parentId ?? "");

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name is required.", { position: "top-center" });
            return;
        }
        setSaving(true);
        try {
            const res = await updateCategory(category.id, {
                name: name.trim(),
                parentId: parentId || null,
            });
            if (res.success) {
                toast.success("Category updated.", { position: "top-center" });
                router.push("/dashboard/admin/categories");
                router.refresh();
            } else {
                toast.error(res.error ?? "Failed to save.", { position: "top-center" });
            }
        } catch (err) {
            toast.error(`Unexpected error: ${err}`, { position: "top-center" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Name
                </label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category name"
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Parent category
                </label>
                <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="">None (top-level category)</option>
                    {availableParents.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                    {saving ? <Spinner /> : "Save changes"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    disabled={saving}
                    onClick={() => router.push("/dashboard/admin/categories")}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
