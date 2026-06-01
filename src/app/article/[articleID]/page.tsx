import { getArticle } from "@/_actions/article-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ArticlePage({ params }: { params: Promise<{ articleID: string }> }) {
    const { articleID } = await params;

    console.log(articleID);
    const article = await getArticle(articleID);

    if (article.success && article.data) {
        return (
            <div className="w-5xl p-2">
                <h1 className="font-extrabold text-2xl text-center">{article.data.title}</h1>
                <p className="text-lg font-semibold text-center">
                    by{" "}
                    {article.data.author.map((a, i) =>
                        i + 1 !== article.data.author.length ? `${a.alias}, ` : `${a.alias}`,
                    )}
                </p>
                <p className="w-5xl">{article.data.content}</p>
            </div>
        );
    }
}
