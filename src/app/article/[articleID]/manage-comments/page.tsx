import { getArticle } from "@/_actions/article-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CommentarySection from "../_components/commentary-section";

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
            permissions: { comments: ["delete"] },
        },
    });

    if (hasPermission.success) {
        const article = await getArticle(articleID);
        if (article.success && article.data) {
            return (
                <div className="border-b-2 md:w-3xl mx-auto mt-10">
                    {article.data.comments ? (
                        <CommentarySection
                            comments={article.data.comments}
                            articleId={article.data.id}
                        />
                    ) : (
                        ""
                    )}
                </div>
            );
        } else {
            return <p>Couldn&apos;t find article with id {articleID}.</p>;
        }
    } else {
        redirect("/");
    }
}
