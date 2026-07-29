import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCategoryById } from "@/_actions/article-actions";
import { getCategories } from "@/_actions/category-actions";
import RouteHeading from "@/components/route-heading";
import EditCategoryForm from "./_components/edit-category-form";

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

    const categoryResult = await getCategoryById(categoryId);
    if (!categoryResult.success || !categoryResult.data) {
        redirect("/dashboard/admin/categories");
    }

    const category = categoryResult.data;

    const allResult = await getCategories();
    const all = allResult.success ? allResult.data : [];

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
            <RouteHeading label={`Edit "${category.name}"`} />
            <div className="p-6 max-w-lg">
                <EditCategoryForm category={category} availableParents={availableParents} />
            </div>
        </div>
    );
}
