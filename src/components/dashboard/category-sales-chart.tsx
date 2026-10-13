"use client";

import { HorizontalBarChart } from "@/components/dashboard/horizontal-bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoneyCompact } from "@/lib/money";

export function CategorySalesChart({
  categorySales,
}: {
  categorySales: { category: string; amount: number }[];
}) {
  return (
    <Card>
      {/* Fixed header height (fits the tab switcher) keeps both plot areas level. */}
      <CardHeader className="min-h-8 items-center">
        <CardTitle>ยอดขายตามหมวดหมู่</CardTitle>
      </CardHeader>
      <CardContent>
        <HorizontalBarChart
          data={categorySales.map((d) => ({ label: d.category, value: d.amount }))}
          seriesName="ยอดขาย"
          color="var(--color-chart-1)"
          formatter={formatMoneyCompact}
        />
      </CardContent>
    </Card>
  );
}
