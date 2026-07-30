import { getArticle } from "@/_actions/article-actions";
import Views from "../../[articleID]/_components/views";
import Likes from "./_components/likes";
import Link from "next/link";
import ArticleDoesntExist from "../../[articleID]/_components/article-doesnt-exists";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkIns from "remark-ins";
import Image from "next/image";
import { format } from "date-fns";
import { ContinueToReadCard } from "@/components/continue-read-card";
import RouteHeading from "@/components/route-heading";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronRight } from "lucide-react";

export default async function PreviewArticlePage({
    params,
}: {
    params: Promise<{ articleId: string }>;
}) {
    const { articleId } = await params;
    const article = await getArticle(articleId);

    if (article.success && article.data) {
        // await addView(articleId);
        let totalReactions = 0;
        for (const r of article.data.reactions) {
            totalReactions += r.val;
        }

        const parentCategory = article.data.category.filter((c) => c.parentId === null);
        const childCategories = article.data.category.filter((c) => c.parentId !== null);

        return (
            <div className="flex-row justify-center w-full px-4 py-2">
                {parentCategory.length > 0 && (
                    <div className="flex items-baseline flex-wrap gap-2 mt-2">
                        {parentCategory.map((c, i) => (
                            <div key={c.id}>
                                <Badge className="bg-primary/60 p-3 text-white text-md hover:bg-primary hover:shadow-gray-500 hover:shadow-2xl dark:hover:shadow-white dark:hover:shadow-2xl dark:hover:bg-primary transition-colors">
                                    <Link
                                        href={`category/${c.id}`}
                                        className="flex items-center gap-1"
                                    >
                                        {c.name}
                                        <ArrowRight />
                                    </Link>
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
                {article.data.image && (
                    <div className="relative ">
                        <Image
                            src={article.data.image}
                            alt={article.data.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 900px"
                        />
                    </div>
                )}
                {article.data.image && (
                    <div className="relative w-full h-[40vh] md:h-auto md:w-3/4 md:aspect-video mx-auto mt-2 overflow-hidden border border-border">
                        <Image
                            src={article.data.image}
                            alt={article.data.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 900px"
                        />
                    </div>
                )}
                <h1 className="font-extrabold text-3xl text-center w-3/4 mx-auto my-2">
                    {article.data.title}
                </h1>
                <div className="md:w-3/4 flex-row mx-auto max-w-none bg-gray-100 dark:bg-[#2d2d2d] text-black dark:text-white  p-4">
                    <p>{article.data.summary}</p>
                </div>

                <article className="md:w-3/4 flex-row mx-auto mt-2 mb-4 max-w-none prose dark:prose-invert dark:bg-[#2d2d2d] dark:text-white dark:prose-headings:text-white p-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkIns]}>
                        {article.data.content.slice(0, 500)}
                    </ReactMarkdown>
                </article>
                <ContinueToReadCard />
                <div className="grid grid-cols-3 items-stretch border-b-2 text-sm bg-gray-100 dark:bg-[#2d2d2d] px-3 min-h-12">
                    <div className="flex items-center">
                        <div className="flex items-center pr-3">
                            <Views num={article.data.views} />
                        </div>

                        <div className="self-center h-9 w-px bg-gray-300 dark:bg-gray-600" />

                        <div className="flex items-center pl-2 pr-3">
                            <Likes num={totalReactions} />
                        </div>

                        <div className="self-center h-9 w-px bg-gray-300 dark:bg-gray-600" />
                    </div>

                    <div className="flex items-center justify-center gap-1">
                        {childCategories.length > 0 &&
                            childCategories.map((c, i) => {
                                return (
                                    <Badge
                                        key={c.id}
                                        className="bg-primary/60 p-2 text-white text-md hover:bg-primary dark:hover:bg-primary transition-colors"
                                    >
                                        {" "}
                                        <Link href={`/category/${c.id}`}>{c.name}</Link>
                                        <ArrowRight />
                                    </Badge>
                                );
                            })}
                    </div>

                    <div className="flex items-center justify-end">
                        <p className="text-md font-semibold text-center mr-4">
                            by{" "}
                            {article.data.author.map((a, i) =>
                                i + 1 !== article.data.author.length
                                    ? `${a.alias}, `
                                    : `${a.alias}`,
                            )}
                        </p>
                        {article.data.location ? article.data.location + ", " : ""}
                        {format(article.data.createdAt, "yyyy-MM-dd HH:mm")}
                    </div>
                </div>
            </div>
        );
    } else {
        return <ArticleDoesntExist />;
    }
}
