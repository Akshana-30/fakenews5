"use server";
import RouteHeading from "@/components/route-heading";
import AddArticleForm from "./_components/add-article-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCategories, getCategoryLinks } from "@/_actions/category-actions";
import { Category } from "@/lib/types";

export default async function AddArticlePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return redirect("/");
    }

    const userId = session.user.id;

    const hasPermission = await auth.api.userHasPermission({
        body: {
            userId: userId,
            permissions: {
                article: ["create"],
            },
        },
    });
    if (!hasPermission.success) {
        redirect("/");
    }

    const categories = await getCategories();
    if (categories.success && categories.data) {
        return (
            <div className="w-full">
                <RouteHeading label="Add article" />

                <div className="flex pt-10">
                    <AddArticleForm categories={categories.data} />
                </div>
            </div>
        );
    } else if (categories.success === false) {
        return <p>An error occurred when trying to load the categories. {categories.error}</p>;
    }
}
