"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney, formatMoneyCompact, formatNumber, formatPercent } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { KpiDatum } from "@/mocks/analytics";

function formatValue(kpi: KpiDatum): { display: string; full: string } {
  if (kpi.format === "money") {
    return { display: formatMoneyCompact(kpi.value), full: formatMoney(kpi.value) };
  }
  if (kpi.format === "percent") {
    return { display: formatPercent(kpi.value), full: formatPercent(kpi.value) };
  }
  return { display: formatNumber(kpi.value), full: formatNumber(kpi.value) };
}

export function KpiCard({ kpi }: { kpi: KpiDatum }) {
  const { display, full } = formatValue(kpi);
  const isUp = kpi.changePercent >= 0;
  const isGood = isUp === (kpi.goodDirection === "up");
  const sparkData = kpi.sparkline.map((v, i) => ({ i, v }));

  return (
    <Card className="gap-3 py-4">
      <CardHeader className="flex-row items-start justify-between px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {kpi.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p
              className="tabular-money text-2xl font-semibold tracking-tight"
              title={full}
            >
              {display}
            </p>
            <div
              className={cn(
                "mt-1 flex items-center gap-1 text-xs font-medium",
                isGood ? "text-success" : "text-destructive",
              )}
            >
              {isUp ? (
                <ArrowUp className="size-3.5" aria-hidden="true" />
              ) : (
                <ArrowDown className="size-3.5" aria-hidden="true" />
              )}
              <span>{formatPercent(kpi.changePercent, { signed: true })}</span>
              <span className="hidden text-muted-foreground min-[420px]:inline">
                เทียบช่วงก่อน
              </span>
            </div>
          </div>
          <div className="hidden h-10 w-20 shrink-0 sm:block">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={`spark-${kpi.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={isGood ? "var(--color-success)" : "var(--color-destructive)"}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor={isGood ? "var(--color-success)" : "var(--color-destructive)"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={isGood ? "var(--color-success)" : "var(--color-destructive)"}
                  strokeWidth={1.5}
                  fill={`url(#spark-${kpi.key})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
