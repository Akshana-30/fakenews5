"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  type TooltipContentProps,
} from "recharts";
import { useRouter } from "next/navigation";

const COLORS = [
  "oklch(0.8369 0.1644 84.4286)",
  "rgb(231, 150, 57)",
  "oklch(63.377% 0.17658 44.867)",
  "oklch(61.902% 0.10601 56.321)",
  "oklch(73.74% 0.1423 50.59)",
];

type CategoryDatum = { category: string; bookmarks: number };

// recharts spreads the row onto the click datum and also nests it under `.payload`.
type SliceClickDatum = Partial<CategoryDatum> & { payload?: CategoryDatum };

interface AnalyticsProps {
  data: CategoryDatum[];
}

export function Analytics({ data }: AnalyticsProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((sum, x) => sum + x.bookmarks, 0);

  const goToCategory = (category: string) => {
    router.push(
      `/dashboard/profile/saved-articles?category=${encodeURIComponent(category)}`
    );
  };

  const handleSliceClick = (entry: SliceClickDatum) => {
    const category = entry?.payload?.category ?? entry?.category;
    if (category) goToCategory(category);
  };

  // No generic args -> uses recharts' default ValueType/NameType, matching
  // exactly what the `content` prop expects (avoids the contravariance error).
  const renderTooltip = ({ active, payload }: TooltipContentProps) => {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload as CategoryDatum;
    const pct = total ? Math.round((row.bookmarks / total) * 100) : 0;
    return (
      <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-sm">
        <p className="font-medium text-popover-foreground">{row.category}</p>
        <p className="text-muted-foreground">
          {row.bookmarks} bookmark{row.bookmarks === 1 ? "" : "s"} · {pct}%
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Click to filter →</p>
      </div>
    );
  };

  return (
    // <Collapsible className="rounded-md data-[state=open]:bg-muted mt-4">
    //   <CollapsibleTrigger asChild>
    //     <Button
    //       variant="ghost"
    //       className="group w-full justify-start hover:bg-muted"
    //     >
    //       <span className="flex-1 text-left">Analytics</span>
    //       <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180 transition-transform" />
    //     </Button>
    //   </CollapsibleTrigger>
    //   <CollapsibleContent className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Bookmark Distribution</CardTitle>
            <CardDescription>By category — click a slice to filter</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center [&_.recharts-surface]:outline-none [&_.recharts-surface]:focus:outline-none">
            {data.length > 0 ? (
              <PieChart width={400} height={300}>
                {/* Tooltip must be a direct child of PieChart, not inside Pie */}
                <Tooltip content={renderTooltip} />
                <Pie
                  data={data}
                  cx={200}
                  cy={150}
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="bookmarks"
                  nameKey="category"
                  label={({ payload }) => payload.category}
                  onClick={handleSliceClick}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {data.map((item, index) => (
                    <Cell
                      key={`cell-${item.category}`}
                      fill={COLORS[index % COLORS.length]}
                      style={{
                        cursor: "pointer",
                        opacity:
                          activeIndex === null || activeIndex === index ? 1 : 0.5,
                        transition: "opacity 200ms ease-in-out",
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <div className="text-muted-foreground py-8">No bookmark data</div>
            )}
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Total bookmarks:
            <span className="ml-2 font-semibold text-foreground">{total}</span>
          </CardFooter>
        </Card>
    //   </CollapsibleContent>
    // </Collapsible>
  );
}