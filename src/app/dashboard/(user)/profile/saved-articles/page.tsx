import RouteHeading from "@/components/route-heading";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { TrendingUp } from "lucide-react";
import { headers } from "next/headers";
import { PieChart } from "recharts/types/chart/PieChart";
import { Pie } from "recharts/types/polar/Pie";

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
      {/* <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card> */}
      <RouteHeading label="Saved Articles" />
      {savedArticles.map((article)=> (
      <Card key={article.id} className="m-5"> </Card>  
      ))}
    

    </div>
  );
}
