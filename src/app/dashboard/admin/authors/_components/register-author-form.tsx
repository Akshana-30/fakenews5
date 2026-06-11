"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerAuthor } from "../_actions/author-actions";
import { toast } from "sonner";

type User = { id: string; name: string; email: string };

export default function RegisterAuthorForm({ users }: { users: User[] }) {
    const [userId, setUserId] = useState("");
    const [alias, setAlias] = useState("");
    const [pending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !alias.trim()) return;
        startTransition(async () => {
            const result = await registerAuthor(userId, alias);
            if (result.success) {
                toast.success("Author registered.", { position: "bottom-right" });
                setUserId("");
                setAlias("");
            } else {
                toast.error(result.error ?? "Failed to register author.", { position: "top-center" });
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    User
                </label>
                <select
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    className="border rounded-md px-3 py-2 text-sm bg-background min-w-60"
                >
                    <option value="">— select a user —</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.name} ({u.email})
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Alias (displayed on articles)
                </label>
                <Input
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="e.g. Adam Lundvall"
                    maxLength={20}
                    required
                    className="min-w-52"
                />
            </div>

            <Button type="submit" disabled={pending || !userId || !alias.trim()}>
                {pending ? "Registering…" : "Register as author"}
            </Button>
        </form>
    );
}
