"use client";
import { deleteArticle } from "@/_actions/article-actions";
import RemovedFromSite from "@/app/dashboard/admin/articles/_components/removed-from-site";
import EditorsChoice from "@/components/editors-choice-btn";
import { Button } from "@/components/ui/button";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type Article = {
    id: string;
    title: string;
    summary: string | null;
    content: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    location: string | null;
    editorsChoice: boolean;
    deleted: Date | null;
    views: number;
};

function ActionsCell({ id }: { id: string }) {
    const router = useRouter();

    return (
        <div className="flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => router.push(`/article/${id}`)}
                    >
                        View article
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => router.push(`/article/${id}/edit`)}
                    >
                        Edit article
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={async () => {
                            const res = await deleteArticle(id);
                            if (res.success && res.data) {
                                toast.success(
                                    `Successfully removed article called "${res.data.title}" from the website.`,
                                    { position: "top-center" },
                                );
                            } else if (res.success == false && res.error) {
                                toast.error(`${res.error}`, { position: "top-center" });
                            }
                        }}
                    >
                        Remove article
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={async () => {
                            router.push(`/article/${id}/manage-comments`);
                        }}
                    >
                        Manage comments
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export const columns: ColumnDef<Article>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => {
            const id = row.original.id;
            return <span className="text-xs block truncate max-w-20 md:max-w-full">{id}</span>;
        },
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            const name = row.original.title;
            return <span className="text-xs block truncate max-w-20 md:max-w-full">{name}</span>;
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created at",
        cell: ({ row }) => {
            const date = row.original.createdAt;
            return <span className="">{new Intl.DateTimeFormat("sv-SE").format(date)}</span>;
        },
    },
    {
        accessorKey: "views",
        header: "Views",
        cell: ({ row }) => {
            const views = row.original.views;
            return <span className="flex justify-center">{views}</span>;
        },
    },
    {
        id: "Editors choice",
        header: () => <span className="flex justify-center">Editors choice</span>,
        cell: ({ row }) => {
            const id = row.original.id;
            const isChoice = row.original.editorsChoice;
            return (
                <span className="flex justify-center">
                    <EditorsChoice articleId={id} initialChoice={isChoice} />
                </span>
            );
        },
    },
    {
        id: "Visible",
        header: () => <span className="flex justify-center">Removed</span>,
        cell: ({ row }) => {
            const id = row.original.id;
            const isRemoved = row.original.deleted;
            console.log(isRemoved);
            return (
                <span className="flex justify-center">
                    <RemovedFromSite articleId={id} removed={isRemoved} />
                </span>
            );
        },
    },
    {
        id: "actions",
        header: () => <span className="flex justify-end">Actions</span>,
        cell: ({ row }) => <ActionsCell id={row.original.id} />,
    },
];
