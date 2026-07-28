import {
  getArticle,
  getArticleIdsByCategory,
  getCategoryById,
} from "@/_actions/article-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Article } from "@/lib/types";
import ArticleList from "@/components/article-list";
import { compareDesc } from "date-fns";
import RouteHeading from "@/components/route-heading";
import Link from "next/link";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const category = await getCategoryById(categoryId);

  if (category.success && category.data) {
    const parentCategory = category.data.parentId
      ? await getCategoryById(category.data.parentId)
      : null;
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
      <div className="w-full">
        <div className="flex items-baseline gap-2 flex-wrap">
          {parentCategory?.success && parentCategory.data ? (
            <>
              <Link href={`/category/${parentCategory.data.id}`}>
                <RouteHeading label={parentCategory.data.name} />
              </Link>
              <span className="ml-2.5 text-muted-foreground/50 text-[18px]">
                {">"}
              </span>
              <span className="ml-2.5 text-muted-foreground text-[20px]">
                {category.data.name}
              </span>
            </>
          ) : (
            <RouteHeading label={category.data.name} />
          )}
        </div>

        <div className="flex mt-8">
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
        <CardContent>
          The category you were looking for does not exists.
        </CardContent>
      </Card>
    );
  }
}
