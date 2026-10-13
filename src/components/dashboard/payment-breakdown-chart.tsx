"use client";

import { Cell, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatMoney } from "@/lib/money";

const colors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

export function PaymentBreakdownChart({
  paymentBreakdown,
}: {
  paymentBreakdown: { method: string; amount: number; percent: number }[];
}) {
  const chartConfig: ChartConfig = paymentBreakdown.reduce((acc, item, i) => {
    acc[item.method] = { label: item.method, color: colors[i % colors.length] };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle>สัดส่วนวิธีชำระเงิน</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
        {paymentBreakdown.length === 0 ? (
          <p className="flex h-56 w-full items-center justify-center text-sm text-muted-foreground">
            ไม่มีข้อมูลการขายในช่วงนี้
          </p>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="aspect-square h-56 w-56 shrink-0">
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(v) => formatMoney(Number(v))} />}
                />
                <Pie
                  data={paymentBreakdown}
                  dataKey="amount"
                  nameKey="method"
                  innerRadius={55}
                  outerRadius={85}
                  strokeWidth={2}
                >
                  {paymentBreakdown.map((entry, i) => (
                    <Cell key={entry.method} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            {/* Compact legend table sized to its content, so amounts sit next to their
                labels instead of being pushed to the card's far edge. */}
            <table className="text-sm">
              <tbody>
                {paymentBreakdown.map((item, i) => (
                  <tr key={item.method}>
                    <td className="py-1.5 pr-6">
                      <span className="flex items-center gap-2">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: colors[i % colors.length] }}
                          aria-hidden="true"
                        />
                        {item.method}
                      </span>
                    </td>
                    <td className="tabular-money py-1.5 pr-4 text-right">
                      {formatMoney(item.amount)}
                    </td>
                    <td className="tabular-money w-12 py-1.5 text-right font-medium text-muted-foreground">
                      {item.percent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </CardContent>
    </Card>
  );
}
