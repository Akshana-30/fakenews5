import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { search } = await searchParams;

  const where =
    typeof search === "string" && search.trim()
      ? {
          deleted: null,
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            {
              author: {
                some: {
                  alias: { contains: search, mode: "insensitive" as const },
                },
              },
            },
            {
              category: {
                some: {
                  name: { contains: search, mode: "insensitive" as const },
                },
              },
            },
          ],
        }
      : { deleted: null };

  const articles = await prisma.article.findMany({
    where,
    select: {
      id: true,
      title: true,
      summary: true,
      image: true,
      category: { select: { id: true, name: true } },
      author: { select: { id: true, alias: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {search && (
        <p className="text-sm text-muted-foreground mb-6">
          {articles.length} result{articles.length !== 1 ? "s" : ""} for &quot;{search}&quot;
        </p>
      )}

      {articles.length === 0 && search && (
        <p className="text-muted-foreground">
          No articles matched your search. Try a different title, author, or category.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/article/${article.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              {article.image && (
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="w-full h-40 object-cover rounded-t-xl"
                />
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-2">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
               
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.summary}
                  </p>
            
                  <p className="text-xs text-muted-foreground">
                     {article.author.map((a) => a.alias).join(", ")}
                  </p>
            
                
                  <div className="flex flex-wrap gap-1">
                    {article.category.map((c) => (
                      <span
                        key={c.id}
                        className="text-xs bg-secondary px-2 py-0.5 rounded-full"
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
            
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
