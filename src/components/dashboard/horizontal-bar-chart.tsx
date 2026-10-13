"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

/**
 * Ranked horizontal bar chart. Every ranked list on the dashboard goes through
 * this so label column width, bar thickness and plot height stay identical
 * when two charts sit side by side.
 */
export function HorizontalBarChart({
  data,
  seriesName,
  color,
  formatter,
}: {
  data: { label: string; value: number }[];
  seriesName: string;
  color: string;
  formatter: (v: number) => string;
}) {
  if (data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        ไม่มีข้อมูลการขายในช่วงนี้
      </p>
    );
  }

  const config: ChartConfig = { value: { label: seriesName, color } };

  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <BarChart data={data} layout="vertical" margin={{ top: 0, left: 0, right: 16, bottom: 0 }}>
        <CartesianGrid horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(v) => formatter(Number(v))}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          dataKey="label"
          type="category"
          width={150}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatter(Number(v))} />} />
        <Bar
          dataKey="value"
          name={seriesName}
          fill="var(--color-value)"
          radius={[0, 4, 4, 0]}
          maxBarSize={24}
        />
      </BarChart>
    </ChartContainer>
  );
}
