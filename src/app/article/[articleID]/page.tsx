import { addView, getArticle, hasUserBookmarkedArticle } from "@/_actions/article-actions";
import Link from "next/link";
import Likes from "./_components/likes";
import Bookmark from "./_components/bookmark";
import Views from "./_components/views";
import { format } from "date-fns";
import CommentarySection from "./_components/commentary-section";
import TopLevelCommentForm from "./_components/top-level-comment-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ArticleDoesntExist from "./_components/article-doesnt-exists";
import RouteHeading from "@/components/route-heading";

export default async function ArticlePage({ params }: { params: Promise<{ articleID: string }> }) {
    const { articleID } = await params;

    // Fetch article and session in parallel — one round-trip each instead of 3+
    const hdrs = await headers();
    const [article, session] = await Promise.all([
        getArticle(articleID),
        auth.api.getSession({ headers: hdrs }),
    ]);

    // Article not found
    if (!article.success || !article.data) {
        return <ArticleDoesntExist />;
    }

    // Check subscription permission (reuses already-fetched session)
    let hasPermission = false;
    if (session) {
        const checkPermission = await auth.api.userHasPermission({
            body: {
                userId: session.user.id,
                permissions: { article: ["read"] },
            },
            headers: hdrs,
        });
        if (checkPermission.success === true) {
            hasPermission = true;
        }
    }

    if (userId && article.success && article.data) {
        // Check if the user has viewed the article and add a view if not
        const res = await hasUserViewedArticle(article.data.id, userId);
        if (res.success && !res.data) {
            await addView(articleID, userId);
        }
        const views = article.data.views.length;

    if (typeof userId === "string") {
        // Use already-fetched views — avoids a second getArticle call
        const alreadyViewed = article.data.views.some((v) => v.userId === userId);
        if (!alreadyViewed) {
            await addView(articleID, userId);
        }

        // Use already-fetched reactions — avoids a third getArticle call
        const existingReaction = article.data.reactions.find((r) => r.userId === userId);
        if (existingReaction) {
            userReaction = { id: existingReaction.id, val: existingReaction.val };
        }

        const bookmark = await hasUserBookmarkedArticle(articleID, userId);
        bookmarked = bookmark.success && bookmark.data === true;
    }

        return (
            <div className="p-2">
                {article.data.category.length > 0 &&
                    article.data.category.map((c, i) => {
                        if (i + 1 !== article.data.category.length)
                            return (
                                <Link key={i} href={`/category/${c.id}`}>
                                    {c.name} ,
                                </Link>
                            );
                        else
                            return (
                                <Link key={i} href={`/category/${c.id}`}>
                                    {c.name}
                                </Link>
                            );
                    })}
                <h1 className="font-extrabold text-2xl text-center">{article.data.title}</h1>
                <p className="text-lg font-semibold text-center">
                    by{" "}
                    {article.data.author.map((a, i) =>
                        i + 1 !== article.data.author.length ? `${a.alias}, ` : `${a.alias}`,
                    )}
                </p>
                <p className="mt-2 mb-4">{article.data.content}</p>
                <div className="flex border-b-2 mt-2 pb-2 text-sm">
                    <div className="flex border-r pr-2">
                        <Views num={views} />
                    </div>
                    <div className="flex border-r pr-2">
                        <Likes
                            articleId={article.data.id}
                            userId={userId}
                            userReaction={userReaction?.val}
                            num={totalReactions}
                        />
                    </div>
                    <div className="flex border-r pl-2 pr-2">
                        <Bookmark articleId={articleID} userId={userId} bookmarked={bookmarked} />
                    </div>
                    <div className="flex ml-auto">
                        {article.data.location ? article.data.location + ", " : ""}
                        {format(article.data.createdAt, "yyyy-MM-dd HH:mm")}
                    </div>
                    {typeof userId === "string" && (
                        <>
                            <div className="flex border-r pr-2">
                                <Likes
                                    articleId={article.data.id}
                                    userId={userId}
                                    userReaction={userReaction?.val}
                                    num={totalReactions}
                                />
                            </div>
                            <div className="flex border-r pl-2 pr-2">
                                <Bookmark
                                    articleId={articleID}
                                    userId={userId}
                                    bookmarked={bookmarked}
                                />
                            </div>
                        </>
                    )}
                    <div className="flex ml-auto">
                        {article.data.location ? article.data.location + ", " : ""}
                        {format(article.data.createdAt, "yyyy-MM-dd HH:mm")}
                    </div>
                </div>
            </div>
            <h1 className="font-extrabold text-2xl text-center my-2">Comments</h1>
            <div className="border-b-2">
                {article.data.comments ? (
                    <CommentarySection
                        comments={article.data.comments}
                        articleId={article.data.id}
                    />
                ) : (
                    ""
                )}
            </div>
            {typeof userId === "string" ? (
                <div className="mt-4">
                    <TopLevelCommentForm articleId={article.data.id} />
                </div>
            ) : (
                <Link href="/login">Log in to write a comment.</Link>
            )}
        </div>
    );
}
