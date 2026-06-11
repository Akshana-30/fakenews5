"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { removeAuthor, updateAuthorAlias } from "../_actions/author-actions";
import { toast } from "sonner";

type AuthorRow = {
    id: string;
    alias: string;
    articleCount: number;
    user: { name: string; email: string; role: string | null };
};

export default function AuthorsTable({ authors }: { authors: AuthorRow[] }) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editAlias, setEditAlias] = useState("");
    const [pending, startTransition] = useTransition();

    const startEdit = (author: AuthorRow) => {
        setEditingId(author.id);
        setEditAlias(author.alias);
    };

    const saveEdit = (id: string) => {
        startTransition(async () => {
            const result = await updateAuthorAlias(id, editAlias);
            if (result.success) {
                toast.success("Alias updated.", { position: "bottom-right" });
                setEditingId(null);
            } else {
                toast.error(result.error ?? "Update failed.", { position: "top-center" });
            }
        });
    };

    const handleRemove = (id: string, alias: string) => {
        if (!confirm(`Remove author profile for "${alias}"? Their articles will remain but will show no author.`)) return;
        startTransition(async () => {
            await removeAuthor(id);
            toast.success(`Author "${alias}" removed.`, { position: "bottom-right" });
        });
    };

    if (authors.length === 0) {
        return <p className="text-sm text-muted-foreground mt-4">No registered authors yet.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="border-b text-left">
                        <th className="py-2 pr-4 font-semibold">Alias</th>
                        <th className="py-2 pr-4 font-semibold">Name</th>
                        <th className="py-2 pr-4 font-semibold">Email</th>
                        <th className="py-2 pr-4 font-semibold">Role</th>
                        <th className="py-2 pr-4 font-semibold">Articles</th>
                        <th className="py-2 font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-muted-foreground">
                    {authors.map((a) => (
                        <tr key={a.id} className="border-b">
                            <td className="py-3 pr-4 font-medium text-foreground">
                                {editingId === a.id ? (
                                    <Input
                                        value={editAlias}
                                        onChange={(e) => setEditAlias(e.target.value)}
                                        maxLength={20}
                                        className="h-7 w-40"
                                        autoFocus
                                    />
                                ) : (
                                    a.alias
                                )}
                            </td>
                            <td className="py-3 pr-4">{a.user.name}</td>
                            <td className="py-3 pr-4">{a.user.email}</td>
                            <td className="py-3 pr-4 capitalize">{a.user.role ?? "—"}</td>
                            <td className="py-3 pr-4">{a.articleCount}</td>
                            <td className="py-3 flex gap-2">
                                {editingId === a.id ? (
                                    <>
                                        <Button
                                            size="sm"
                                            disabled={pending}
                                            onClick={() => saveEdit(a.id)}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditingId(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => startEdit(a)}
                                        >
                                            Edit alias
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            disabled={pending}
                                            onClick={() => handleRemove(a.id, a.alias)}
                                        >
                                            Remove
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
