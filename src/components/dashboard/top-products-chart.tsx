"use client";

import { useState } from "react";

import { HorizontalBarChart } from "@/components/dashboard/horizontal-bar-chart";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMoneyCompact, formatNumber } from "@/lib/money";

export function TopProductsChart({
  topProductsByQty,
  topProductsByProfit,
}: {
  topProductsByQty: { name: string; qty: number }[];
  topProductsByProfit: { name: string; profit: number }[];
}) {
  const [by, setBy] = useState<"qty" | "profit">("qty");

  return (
    <Card>
      {/* Fixed header height (fits the tab switcher) keeps both plot areas level. */}
      <CardHeader className="min-h-8 items-center">
        <CardTitle>สินค้าขายดี Top 6</CardTitle>
        {/* Tabs live in the header so the plot area matches the category chart beside it. */}
        <CardAction>
          <Tabs value={by} onValueChange={(v) => setBy(v as "qty" | "profit")}>
            <TabsList>
              <TabsTrigger value="qty">ตามจำนวน</TabsTrigger>
              <TabsTrigger value="profit">ตามกำไร</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>
      <CardContent>
        {by === "qty" ? (
          <HorizontalBarChart
            data={topProductsByQty.map((d) => ({ label: d.name, value: d.qty }))}
            seriesName="จำนวน"
            color="var(--color-chart-1)"
            formatter={formatNumber}
          />
        ) : (
          <HorizontalBarChart
            data={topProductsByProfit.map((d) => ({ label: d.name, value: d.profit }))}
            seriesName="กำไร"
            color="var(--color-chart-4)"
            formatter={formatMoneyCompact}
          />
        )}
      </CardContent>
    </Card>
  );
}
