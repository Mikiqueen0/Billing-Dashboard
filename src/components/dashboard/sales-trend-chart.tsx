"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatDateThai, formatDateThaiShort } from "@/lib/date";
import { formatMoney, formatMoneyCompact } from "@/lib/money";

// Blue bars = revenue, green line = profit: two hues, two mark types, so the
// series stay distinguishable even in the legend-free tooltip.
const chartConfig: ChartConfig = {
  sales: { label: "ยอดขาย", color: "var(--color-chart-1)" },
  profit: { label: "กำไรขั้นต้น", color: "var(--color-success)" },
};

const weekdayThai = new Intl.DateTimeFormat("th-TH", {
  weekday: "short",
  timeZone: "Asia/Bangkok",
});

export function SalesTrendChart({
  dailySales,
}: {
  dailySales: { date: string; sales: number; profit: number }[];
}) {
  const data = dailySales.map((d) => ({
    ...d,
    label: formatDateThaiShort(d.date).slice(0, 5),
    fullLabel: `${weekdayThai.format(new Date(d.date))} ${formatDateThai(d.date)}`,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>ยอดขายและกำไรขั้นต้น รายวัน</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <ComposedChart data={data} margin={{ left: 4, right: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => formatMoneyCompact(v)}
              width={56}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullLabel}
                  formatter={(value) => formatMoney(Number(value))}
                  footer={(payload) => {
                    const row = payload[0]?.payload as
                      | { sales: number; profit: number }
                      | undefined;
                    if (!row || row.sales === 0) return null;
                    return (
                      <span className="flex justify-between gap-4">
                        <span>อัตรากำไร</span>
                        <span className="font-semibold text-foreground tabular-nums">
                          {((row.profit / row.sales) * 100).toFixed(1)}%
                        </span>
                      </span>
                    );
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="sales"
              name="ยอดขาย"
              fill="var(--color-sales)"
              radius={[4, 4, 0, 0]}
            />
            <Line
              dataKey="profit"
              name="กำไรขั้นต้น"
              type="monotone"
              stroke="var(--color-profit)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "var(--color-profit)", stroke: "var(--color-card)", strokeWidth: 1.5 }}
              activeDot={{ r: 5, stroke: "var(--color-card)", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
