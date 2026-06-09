import { getArticle, getArticleIdsByCategory, getCategoryById } from "@/_actions/article-actions";
import NewsCard from "@/components/news-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Article } from "@/lib/types";

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
        }
        return (
            <div className="p-4">
                <h1>{category.data.name}</h1>
                {articles.map((a, i) => {
                    return (
                        <NewsCard
                            key={i}
                            id={a.id}
                            title={a.title}
                            summary={a.summary}
                            location={a.location}
                            author={a.author}
                            category={a.category}
                            image={a.image}
                            createdAt={a.createdAt}
                            updatedAt={a.updatedAt}
                        />
                    );
                })}
            </div>
        );
    } else {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Couldn&apos;t find category</CardTitle>
                </CardHeader>
                <CardContent>The category you were looking for does not exists.</CardContent>
            </Card>
        );
    }
}
