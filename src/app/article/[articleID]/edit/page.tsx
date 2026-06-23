import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import RouteHeading from "@/components/route-heading";
import EditArticleForm from "./_components/edit-article-form";

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

    const article = await prisma.article.findUnique({
        where: { id: articleID },
        include: { category: true, author: true },
    });

    let isOwner = false;
    if (article?.author) {
        for (const a of article?.author) {
            // console.log(a);
            // console.log(session.user.id, a.userId);
            if (session.user.id === a.userId) {
                isOwner = true;
            }
        }
    }

    if (!hasPermission.success || !isOwner) redirect("/dashboard/admin/articles");
    if (!article) notFound();

    const defaultValues = {
        title: article.title,
        summary: article.summary ?? "",
        content: article.content,
        image: article.image ?? "",
        location: article.location ?? "",
        category: article.category.map((c) => c.name),
        author: article.author.map((a) => a.alias),
    };

    return (
        <div className="w-full">
            <RouteHeading label="Edit article" />
            <div className="flex pt-10">
                <EditArticleForm articleId={articleID} defaultValues={defaultValues} />
            </div>
        </div>
    );
}
