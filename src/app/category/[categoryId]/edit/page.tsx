import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import RouteHeading from "@/components/route-heading";
import EditCatForm from "./_components/edit-category";
import prisma from "@/lib/prisma";

export default async function EditCategoryPage({
    params,
}: {
    params: Promise<{ categoryId: string }>;
}) {
    const { categoryId } = await params;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
        redirect("/");
    }

    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { name: true, parentId: true },
    });
    if (!category) {
        return notFound();
    }

    const all = await prisma.category.findMany({
        select: { id: true, name: true, parentId: true },
    });

    // Exclude this category and all of its descendants from the parent
    // options — assigning either as the parent would create a cycle.
    const descendantIds = new Set<string>();
    function collectDescendants(id: string) {
        for (const c of all) {
            if (c.parentId === id && !descendantIds.has(c.id)) {
                descendantIds.add(c.id);
                collectDescendants(c.id);
            }
        }
    }
    collectDescendants(categoryId);

    const availableParents = all.filter(
        (c) => c.id !== categoryId && !descendantIds.has(c.id),
    );

    return (
        <div className="w-full">
            <RouteHeading label="Edit Category" />
            <EditCatForm
                categoryId={categoryId}
                Category={category}
                availableParents={availableParents}
            />
        </div>
    );
}
