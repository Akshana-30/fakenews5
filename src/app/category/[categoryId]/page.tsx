import { getArticle, getArticleIdsByCategory, getCategoryById } from "@/_actions/article-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Article } from "@/lib/types";
import ArticleList from "@/components/article-list";
import { compareAsc, compareDesc } from "date-fns";

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ categoryId: string }>;
}) {
    const { categoryId } = await params;
    const category = await getCategoryById(categoryId);

    if (category.success && category.data) {
        const articleIds = await getArticleIdsByCategory(categoryId);
        const articles: Article[] = [];
        if (articleIds.success && articleIds.data) {
            for (const id of articleIds.data) {
                const article = await getArticle(id);
                if (article.success && article.data) {
                    articles.push(article.data);
                }
            }
            articles.sort((a, b) => compareDesc(a.createdAt, b.createdAt));
        }
        return (
            <div className="w-full p-4">
                <h1 className="font-extrabold text-2xl text-center">{category.data.name}</h1>
                <div className="flex">
                    <ArticleList articles={articles} articlesPerPage={6} />
                </div>
            </div>
        );
    } else {
        return (
            <Card className="md:w-xl h-25 p-2 mx-auto mt-10">
                <CardHeader>
                    <CardTitle>Couldn&apos;t find category</CardTitle>
                </CardHeader>
                <CardContent>The category you were looking for does not exists.</CardContent>
            </Card>
        );
    }
}
