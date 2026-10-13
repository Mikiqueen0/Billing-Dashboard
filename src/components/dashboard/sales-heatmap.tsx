"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_TOOLTIP_PANEL, TOOLTIP_HEADING } from "@/components/ui/chart";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { salesHeatmap } from "@/mocks/dashboard";
import { cn } from "@/lib/utils";

const DAYS = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];
const DAYS_FULL = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export function SalesHeatmap() {
  const [active, setActive] = useState(salesHeatmap[0]);
  const max = Math.max(...salesHeatmap.map((c) => c.value));
  const peak = salesHeatmap.reduce((a, b) => (b.value > a.value ? b : a));
  const quiet = salesHeatmap.reduce((a, b) => (b.value < a.value ? b : a));
  const dayTotals = DAYS.map((_, day) =>
    salesHeatmap.filter((c) => c.day === day).reduce((sum, c) => sum + c.value, 0),
  );
  const maxDayTotal = Math.max(...dayTotals);
  const cellByKey = new Map(
    salesHeatmap.map((c) => [`${c.day}-${c.hour}`, c]),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>ช่วงเวลาขายดี (วัน × ชั่วโมง)</CardTitle>
      </CardHeader>
      {/* Grid capped at ~44rem so cells stay near-square on wide screens; the
          summary column takes the leftover width instead of stretching cells. */}
      <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,44rem)_minmax(14rem,1fr)] lg:gap-10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] table-fixed border-separate border-spacing-1 text-xs">
            <thead>
              <tr>
                <th className="w-9" />
                {HOURS.map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="pb-1 text-center font-normal text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, dayIndex) => (
                <tr key={day}>
                  <th
                    scope="row"
                    className="pr-1 text-left font-normal text-muted-foreground"
                  >
                    {day}
                  </th>
                  {HOURS.map((hour) => {
                    const cell = cellByKey.get(`${dayIndex}-${hour}`) ?? {
                      day: dayIndex,
                      hour,
                      value: 0,
                    };
                    const intensity = cell.value / max;
                    const isActive = active.day === dayIndex && active.hour === hour;
                    const color = `color-mix(in oklch, var(--color-primary) ${Math.round(
                      intensity * 90,
                    )}%, var(--color-muted))`;
                    return (
                      <td key={hour} className="p-0">
                        <Tooltip delayDuration={0} disableHoverableContent>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              tabIndex={0}
                              onFocus={() => setActive(cell)}
                              onMouseEnter={() => setActive(cell)}
                              className={cn(
                                "h-8 w-full rounded-sm outline-none transition-[outline] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
                                isActive && "ring-2 ring-ring",
                              )}
                              style={{ backgroundColor: color }}
                              aria-label={`${DAYS[dayIndex]} ${hour}:00 น. ยอดขายสัมพัทธ์ ${cell.value}`}
                            />
                          </TooltipTrigger>
                          {/* Same panel as the Recharts tooltips: bold heading, dot · label · value rows. */}
                          <TooltipContent
                            side="top"
                            sideOffset={6}
                            hideArrow
                            className={CHART_TOOLTIP_PANEL}
                          >
                            <div className={TOOLTIP_HEADING}>
                              {DAYS_FULL[dayIndex]} {hour}:00–{hour + 1}:00 น.
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="size-2.5 shrink-0 rounded-[2px]"
                                style={{ backgroundColor: color }}
                                aria-hidden="true"
                              />
                              <span className="flex flex-1 justify-between gap-4">
                                <span className="text-muted-foreground">ยอดขายสัมพัทธ์</span>
                                <span className="font-semibold tabular-nums">{cell.value}</span>
                              </span>
                            </div>
                            <div className="flex justify-between gap-4 border-t border-border/60 pt-2 text-muted-foreground">
                              <span>เทียบช่วงขายดีสุด</span>
                              <span className="font-semibold text-foreground tabular-nums">
                                {Math.round(intensity * 100)}%
                              </span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-5 text-sm">
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <dt className="text-xs text-muted-foreground">ขายดีที่สุด</dt>
              <dd className="mt-1 font-semibold">
                {DAYS[peak.day]} {peak.hour}:00 น.
              </dd>
            </div>
            <div className="rounded-lg border p-3">
              <dt className="text-xs text-muted-foreground">เงียบที่สุด</dt>
              <dd className="mt-1 font-semibold">
                {DAYS[quiet.day]} {quiet.hour}:00 น.
              </dd>
            </div>
          </dl>

          <div>
            <p className="mb-2 text-xs text-muted-foreground">ยอดขายตามวัน (สัมพัทธ์)</p>
            <ul className="space-y-1.5">
              {DAYS.map((day, i) => (
                <li key={day} className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-2">
                  <span className="text-xs text-muted-foreground">{day}</span>
                  <span className="h-2 rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${Math.round((dayTotals[i] / maxDayTotal) * 100)}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="rounded-md bg-muted px-3 py-2 text-xs" aria-live="polite">
            <span className="text-muted-foreground">ช่องที่เลือก: </span>
            {DAYS[active.day]} {active.hour}:00 น. — ยอดขายสัมพัทธ์ {active.value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
