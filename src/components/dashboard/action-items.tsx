import { AlertTriangle, CheckCircle2, PackageX, TrendingDown, UserX } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/money";
import { formatDateThai } from "@/lib/date";
import { cn } from "@/lib/utils";
import { customers } from "@/mocks/customers";
import { MOCK_NOW } from "@/mocks/now";
import { products } from "@/mocks/products";
import { sales } from "@/mocks/sales";

const DAY_MS = 86_400_000;

function getLastSoldAt(productId: string): Date | null {
  const dates = sales
    .filter((s) => s.status === "completed")
    .flatMap((s) => (s.items.some((i) => i.productId === productId) ? [new Date(s.soldAt)] : []));
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates.map((d) => d.getTime())));
}

const lowStock = products.filter((p) => p.isActive && p.stockQty <= p.reorderPoint);
const belowCost = products.filter((p) => p.isActive && p.sellPrice < p.costPrice);
const overdueCustomers = customers.filter(
  (c) => c.outstandingBalance > 0 && c.outstandingBalance >= c.creditLimit,
);
const staleProducts = products.filter((p) => {
  if (!p.isActive) return false;
  const lastSold = getLastSoldAt(p.id);
  if (!lastSold) return true;
  return MOCK_NOW.getTime() - lastSold.getTime() > 60 * DAY_MS;
});

type Tone = "warning" | "destructive" | "muted";

const sections: {
  key: string;
  title: string;
  icon: typeof AlertTriangle;
  tone: Tone;
  metricLabel: string;
  count: number;
  items: { id: string; name: string; metric: string }[];
}[] = [
  {
    key: "low-stock",
    title: "สินค้าใกล้หมด",
    icon: AlertTriangle,
    tone: "warning",
    metricLabel: "เหลือ / จุดสั่งซื้อ",
    count: lowStock.length,
    items: lowStock.map((p) => ({
      id: p.id,
      name: p.name,
      metric: `${p.stockQty} / ${p.reorderPoint} ${p.unit}`,
    })),
  },
  {
    key: "below-cost",
    title: "ราคาขายต่ำกว่าทุน",
    icon: TrendingDown,
    tone: "destructive",
    metricLabel: "ขาดทุน/หน่วย",
    count: belowCost.length,
    items: belowCost.map((p) => ({
      id: p.id,
      name: p.name,
      metric: `-${formatMoney(p.costPrice - p.sellPrice)}`,
    })),
  },
  {
    key: "overdue",
    title: "ค้างชำระเกินวงเงิน",
    icon: UserX,
    tone: "destructive",
    metricLabel: "เกินวงเงิน",
    count: overdueCustomers.length,
    items: overdueCustomers.map((c) => ({
      id: c.id,
      name: c.name,
      metric: formatMoney(c.outstandingBalance - c.creditLimit),
    })),
  },
  {
    key: "stale",
    title: "ไม่เคลื่อนไหว > 60 วัน",
    icon: PackageX,
    tone: "muted",
    metricLabel: "ขายล่าสุด",
    count: staleProducts.length,
    items: staleProducts.map((p) => {
      const lastSold = getLastSoldAt(p.id);
      return {
        id: p.id,
        name: p.name,
        metric: lastSold ? formatDateThai(lastSold) : "ยังไม่เคยขาย",
      };
    }),
  },
];

const MAX_ROWS = 4;

const toneText: Record<Tone, string> = {
  warning: "text-warning",
  destructive: "text-destructive",
  muted: "text-muted-foreground",
};

const toneBadge: Record<Tone, string> = {
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
};

export function ActionItems() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ต้องจัดการ</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => {
          const empty = section.count === 0;
          const hidden = section.count - MAX_ROWS;
          return (
            <section
              key={section.key}
              aria-labelledby={`action-${section.key}`}
              className="flex flex-col rounded-lg border p-3"
            >
              <div className="flex items-center gap-2">
                <section.icon
                  className={cn("size-4 shrink-0", empty ? "text-success" : toneText[section.tone])}
                  aria-hidden="true"
                />
                <h3 id={`action-${section.key}`} className="text-sm font-semibold">
                  {section.title}
                </h3>
                <span
                  className={cn(
                    "ml-auto rounded-full px-2 py-0.5 text-xs font-semibold tabular-money",
                    empty ? "bg-success/10 text-success" : toneBadge[section.tone],
                  )}
                >
                  {section.count}
                </span>
              </div>

              {empty ? (
                <p className="mt-3 flex flex-1 items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                  เรียบร้อย ไม่มีรายการ
                </p>
              ) : (
                <>
                  <div className="mt-3 flex justify-between border-b pb-1.5 text-xs text-muted-foreground">
                    <span>รายการ</span>
                    <span>{section.metricLabel}</span>
                  </div>
                  <ul className="divide-y">
                    {section.items.slice(0, MAX_ROWS).map((item) => (
                      <li
                        key={item.id}
                        className="flex items-baseline justify-between gap-3 py-2 text-sm"
                      >
                        <span className="min-w-0 truncate" title={item.name}>
                          {item.name}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 font-medium tabular-money",
                            toneText[section.tone],
                          )}
                        >
                          {item.metric}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {hidden > 0 && (
                    <p className="mt-auto pt-2 text-xs text-muted-foreground">
                      และอีก {hidden} รายการ
                    </p>
                  )}
                </>
              )}
            </section>
          );
        })}
      </CardContent>
    </Card>
  );
}
