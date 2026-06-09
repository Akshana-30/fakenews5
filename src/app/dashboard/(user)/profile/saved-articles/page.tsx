import RouteHeading from "@/components/route-heading";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export default async function SavedArticles() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const savedArticles = await prisma.user.findMany({
    where: { id: userId },
    include: {
      user_info: {
        select: {
          bookmark: {
            select: {
              user_id: true,
              articleId: true,
              article: {
                select: {
                  id: true,
                  title: true,
                  category: true,
                  summary: true,
                  location: true,
                  image: true,
                  author:true,
                },
              },
            },
          },
        },
      },
    },
  });
  return (
    <div>
      <RouteHeading label="Saved Articles" />
      {savedArticles.map((article)=> (
      <Card key={article.id} className="m-5"> </Card>  
      ))}
    

    </div>
  );
}
