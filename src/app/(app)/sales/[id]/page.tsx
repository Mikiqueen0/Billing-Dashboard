import { notFound } from "next/navigation";
import {
  CreditCard,
  FileClock,
  Landmark,
  MapPin,
  Phone,
  Store,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { SaleActions } from "@/components/sales/sale-actions";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTimeThai } from "@/lib/date";
import { formatMoney, moneyToThaiText } from "@/lib/money";
import { customers } from "@/mocks/customers";
import { getSaleById } from "@/mocks/sales";
import { cn } from "@/lib/utils";

const paymentMethods: Record<string, { label: string; icon: LucideIcon }> = {
  cash: { label: "เงินสด", icon: Wallet },
  transfer: { label: "โอนเงิน", icon: Landmark },
  card: { label: "บัตร", icon: CreditCard },
  credit: { label: "เครดิต", icon: FileClock },
};

// Table runs edge-to-edge inside the card; outer cells pick up the card's own
// padding so column edges line up with the card title.
const EDGE_TO_EDGE =
  "[&_td:first-child]:pl-4 [&_th:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:last-child]:pr-4";

function SummaryRow({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-money">{children}</span>
    </div>
  );
}

export default async function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sale = getSaleById(id);
  if (!sale) notFound();

  const customer = sale.customerId
    ? customers.find((c) => c.id === sale.customerId)
    : null;
  const isWalkIn = !customer || customer.code === "W-000";
  const isVoid = sale.status === "void";
  const change =
    sale.paymentMethod === "cash" ? sale.paidAmount - sale.grandTotal : 0;
  const totalQty = sale.items.reduce((sum, i) => sum + i.qty, 0);
  const payment = paymentMethods[sale.paymentMethod];

  return (
    <div className="space-y-4">
      <PageHeader
        title={`บิล ${sale.billNo}`}
        description={formatDateTimeThai(sale.soldAt)}
        actions={<SaleActions sale={sale} />}
      />

      {isVoid && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          บิลนี้ถูกยกเลิกแล้ว{sale.note ? ` — ${sale.note}` : ""}
        </div>
      )}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Items */}
        <Card className={cn("gap-0 pb-0", isVoid && "opacity-70")}>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">รายการสินค้า</CardTitle>
            <CardDescription>
              {sale.items.length} รายการ · รวม {totalQty} หน่วย
            </CardDescription>
            <CardAction>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                  isVoid ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success",
                )}
              >
                <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                {isVoid ? "ยกเลิกแล้ว" : "ชำระแล้ว"}
              </span>
            </CardAction>
          </CardHeader>
          <Table className={EDGE_TO_EDGE}>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>สินค้า</TableHead>
                <TableHead className="text-right">จำนวน</TableHead>
                <TableHead className="text-right">ราคา/หน่วย</TableHead>
                <TableHead className="text-right">ส่วนลด</TableHead>
                <TableHead className="text-right">รวม</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sale.items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="tabular-money text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="tabular-money text-right">
                    {item.qty}{" "}
                    <span className="text-muted-foreground">{item.unit}</span>
                  </TableCell>
                  <TableCell className="tabular-money text-right">
                    {formatMoney(item.unitPrice)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "tabular-money text-right",
                      item.discount > 0 ? "text-destructive" : "text-muted-foreground",
                    )}
                  >
                    {item.discount > 0 ? `-${formatMoney(item.discount)}` : "—"}
                  </TableCell>
                  <TableCell className="tabular-money text-right font-semibold">
                    {formatMoney(item.lineTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="space-y-4">
          {/* Totals — the number the customer cares about, so it leads the side column */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">สรุปยอด</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              <SummaryRow label="ยอดรวม">{formatMoney(sale.subtotal)}</SummaryRow>
              <SummaryRow label="ส่วนลด">
                <span className={sale.discountTotal > 0 ? "text-destructive" : undefined}>
                  -{formatMoney(sale.discountTotal)}
                </span>
              </SummaryRow>
              {sale.vatAmount > 0 && (
                <SummaryRow label="VAT">{formatMoney(sale.vatAmount)}</SummaryRow>
              )}

              <div className="rounded-lg bg-primary/5 px-3 py-3 ring-1 ring-primary/10">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-medium">ยอดสุทธิ</span>
                  <span className="tabular-money text-2xl font-bold tracking-tight text-primary">
                    {formatMoney(sale.grandTotal)}
                  </span>
                </div>
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  ({moneyToThaiText(sale.grandTotal)})
                </p>
              </div>

              <Separator className="my-1" />

              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">วิธีชำระ</span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium">
                  <payment.icon className="size-3.5" aria-hidden="true" />
                  {payment.label}
                </span>
              </div>
              {sale.paymentMethod === "cash" && (
                <>
                  <SummaryRow label="รับเงิน">{formatMoney(sale.paidAmount)}</SummaryRow>
                  <SummaryRow label="เงินทอน">
                    <span className="font-medium text-success">
                      {formatMoney(Math.max(change, 0))}
                    </span>
                  </SummaryRow>
                </>
              )}
              {sale.paymentMethod === "credit" && (
                <SummaryRow label="ชำระแล้ว">{formatMoney(sale.paidAmount)}</SummaryRow>
              )}
            </CardContent>
          </Card>

          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">ลูกค้า</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                {/* Icon, not an initial: Thai names can start with a leading vowel (เ แ โ ใ ไ),
                    which reads as a stray mark on its own. */}
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  <Store className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{customer?.name ?? "ลูกค้าทั่วไป"}</p>
                  {!isWalkIn && (
                    <p className="text-xs text-muted-foreground">รหัส {customer.code}</p>
                  )}
                </div>
              </div>

              {!isWalkIn && (
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span className="tabular-money">{customer.phone}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>{customer.address}</span>
                  </li>
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
