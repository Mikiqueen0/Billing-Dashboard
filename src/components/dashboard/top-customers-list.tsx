import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/money";

export function TopCustomersList({
  topCustomers,
}: {
  topCustomers: { name: string; amount: number }[];
}) {
  const max = Math.max(1, ...topCustomers.map((c) => c.amount));

  return (
    <Card>
      <CardHeader>
        <CardTitle>ลูกค้าซื้อเยอะสุด Top 5</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topCustomers.length === 0 ? (
          <p className="text-sm text-muted-foreground">ไม่มีข้อมูลการขายในช่วงนี้</p>
        ) : (
          topCustomers.map((customer, i) => (
            <div key={customer.name} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 truncate">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="truncate">{customer.name}</span>
                </span>
                <span className="tabular-money shrink-0 font-medium">
                  {formatMoney(customer.amount)}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(customer.amount / max) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
