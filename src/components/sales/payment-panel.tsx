"use client";

import { useState, type Ref } from "react";
import { CreditCard, Landmark, Wallet, FileClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { PosPaymentMethod } from "./types";

const methods: { value: PosPaymentMethod; label: string; icon: typeof Wallet }[] = [
  { value: "cash", label: "เงินสด", icon: Wallet },
  { value: "transfer", label: "โอนเงิน", icon: Landmark },
  { value: "card", label: "บัตร", icon: CreditCard },
  { value: "credit", label: "เครดิต", icon: FileClock },
];

export function PaymentPanel({
  subtotal,
  discountTotal,
  grandTotal,
  method,
  onMethodChange,
  onPay,
  onHold,
  disabled,
  payButtonRef,
}: {
  subtotal: number;
  discountTotal: number;
  grandTotal: number;
  method: PosPaymentMethod;
  onMethodChange: (method: PosPaymentMethod) => void;
  onPay: (received: number) => void;
  onHold: () => void;
  disabled: boolean;
  payButtonRef?: Ref<HTMLButtonElement>;
}) {
  const [received, setReceived] = useState<number | null>(null);
  const receivedAmount = received ?? 0;
  const change = method === "cash" ? receivedAmount - grandTotal : 0;
  const canPay =
    !disabled && (method !== "cash" || receivedAmount >= grandTotal);
  const quickAmounts = Array.from(
    new Set([grandTotal, 500, 1000].filter((n) => n > 0)),
  ).sort((a, b) => a - b);

  return (
    <Card className="gap-4">
      <CardContent className="space-y-4">
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>ยอดรวม</span>
            <span className="tabular-money">{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>ส่วนลด</span>
            <span className="tabular-money">-{formatMoney(discountTotal)}</span>
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-sm text-muted-foreground">ยอดที่ต้องชำระ</p>
          <p className="tabular-money text-4xl font-bold tracking-tight">
            {formatMoney(grandTotal)}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {methods.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => onMethodChange(m.value)}
              className={cn(
                "flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-lg border text-xs font-medium transition-colors",
                method === m.value
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:bg-accent/50",
              )}
              aria-pressed={method === m.value}
            >
              <m.icon className="size-4" aria-hidden="true" />
              {m.label}
            </button>
          ))}
        </div>

        {method === "cash" && (
          <div className="space-y-2">
            <Label htmlFor="received-amount">รับเงินมา</Label>
            <NumberInput
              id="received-amount"
              decimal
              min={0}
              value={received}
              onValueChange={setReceived}
              placeholder="0.00"
              className="tabular-money h-11 text-lg"
            />
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReceived(amount)}
                >
                  {amount === grandTotal ? "พอดี" : formatMoney(amount)}
                </Button>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">เงินทอน</span>
              <span
                className={cn(
                  "tabular-money font-semibold",
                  change < 0 ? "text-muted-foreground" : "text-success",
                )}
              >
                {formatMoney(Math.max(change, 0))}
              </span>
            </div>
          </div>
        )}

        {method === "credit" && (
          <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            บันทึกเป็นยอดค้างชำระของลูกค้า — ต้องเลือกลูกค้าที่ไม่ใช่ &quot;ลูกค้าทั่วไป&quot;
          </p>
        )}

        <div className="space-y-2">
          <Button
            ref={payButtonRef}
            type="button"
            size="lg"
            className="h-12 w-full text-base"
            disabled={!canPay}
            onClick={() => onPay(receivedAmount)}
          >
            ชำระเงิน
            <kbd className="ml-2 rounded bg-primary-foreground/20 px-1.5 py-0.5 text-xs">
              F9
            </kbd>
          </Button>
          {!canPay && method === "cash" && !disabled && (
            <p className="text-center text-xs text-muted-foreground">
              กรอกจำนวนเงินที่รับอย่างน้อย {formatMoney(grandTotal)} เพื่อชำระเงิน
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full"
            onClick={onHold}
            disabled={disabled}
          >
            พักบิล
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
