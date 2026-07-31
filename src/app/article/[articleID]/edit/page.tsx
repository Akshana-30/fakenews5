import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import RouteHeading from "@/components/route-heading";
import EditArticleForm from "./_components/edit-article-form";
import { getArticle } from "@/_actions/article-actions";
import { Category } from "@/lib/types";
import { getCategories } from "@/_actions/category-actions";

export default async function EditArticlePage({
    params,
}: {
    params: Promise<{ articleID: string }>;
}) {
    const { articleID } = await params;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/");

    const hasPermission = await auth.api.userHasPermission({
        body: {
            userId: session.user.id,
            permissions: { article: ["update"] },
        },
    });

    const article = await getArticle(articleID);
    if (article.success === false || !article.data) {
        notFound();
    }

    let isOwner = false;
    if (article.data.author) {
        for (const a of article.data.author) {
            if (session.user.id === a.userId) {
                isOwner = true;
            }
        }
    }

    if (!hasPermission.success || !isOwner) redirect("/dashboard/admin/articles");

    let categoryString = "";
    let subcategoryString = "";

    const categories: Category[] = [];
    const subCategories: Category[] = [];

    for (const c of article.data.category) {
        if (c.parentId === null) {
            categories.push(c);
        } else {
            subCategories.push(c);
        }
    }

    categories.map((c, i) => {
        if (i === categories.length - 1) {
            categoryString += c.name;
        } else {
            categoryString += c.name + ", ";
        }
    });
    subCategories.map((c, i) => {
        if (i === subCategories.length - 1) {
            subcategoryString += c.name;
        } else {
            subcategoryString += c.name + ", ";
        }
    });

    const defaultValues = {
        title: article.data.title,
        summary: article.data.summary ?? "",
        content: article.data.content,
        image: article.data.image ?? "",
        location: article.data.location ?? "",
        category: categoryString,
        subcategory: subcategoryString,
        author: article.data.author.map((a) => a.alias),
    };

    const allCategories = await getCategories();
    if (allCategories.success === false || !allCategories.data) {
        notFound();
    }

    return (
        <div className="w-full">
            <RouteHeading label="Edit article" />
            <div className="flex pt-10">
                <EditArticleForm
                    articleId={articleID}
                    defaultValues={defaultValues}
                    allCategories={allCategories.data}
                />
            </div>
        </div>
    );
}
