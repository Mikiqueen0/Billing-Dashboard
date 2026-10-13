"use client";

import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { CartLine } from "./types";

export function CartTable({
  lines,
  highlightLineId,
  onQtyChange,
  onDiscountChange,
  onRemove,
}: {
  lines: CartLine[];
  highlightLineId: string | null;
  onQtyChange: (lineId: string, qty: number) => void;
  onDiscountChange: (lineId: string, discount: number) => void;
  onRemove: (lineId: string) => void;
}) {
  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        <ShoppingCart className="size-8" aria-hidden="true" />
        <p className="text-sm">ยังไม่มีสินค้าในตะกร้า</p>
        <p className="text-xs">ค้นหาสินค้าด้านบนแล้วกด Enter เพื่อเพิ่ม</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[180px]">สินค้า</TableHead>
            <TableHead className="w-32 text-center">จำนวน</TableHead>
            <TableHead className="w-28 text-right">ราคา/หน่วย</TableHead>
            <TableHead className="w-28 text-center">ส่วนลด (฿)</TableHead>
            <TableHead className="w-28 text-right">รวม</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map((line) => {
            const overStock = line.qty > line.stockQty;
            const belowCost = line.unitPrice < line.unitCost;
            return (
              <TableRow
                key={line.lineId}
                className={cn(
                  "transition-colors duration-500",
                  highlightLineId === line.lineId && "bg-accent",
                )}
              >
                <TableCell>
                  <p className="font-medium">{line.name}</p>
                  <p className="text-xs text-muted-foreground">{line.sku}</p>
                  {overStock && (
                    <p className="text-xs text-warning">
                      ⚠ สต็อกเหลือ {line.stockQty} {line.unit}
                    </p>
                  )}
                  {belowCost && (
                    <p className="text-xs text-destructive">
                      ⚠ ขายต่ำกว่าทุน ({formatMoney(line.unitCost)})
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8"
                      aria-label={`ลดจำนวน ${line.name}`}
                      onClick={() => onQtyChange(line.lineId, Math.max(1, line.qty - 1))}
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <NumberInput
                      value={line.qty}
                      min={1}
                      emptyValue={1}
                      onValueChange={(v) => onQtyChange(line.lineId, v ?? 1)}
                      className="tabular-money h-8 w-14 px-1 text-center"
                      aria-label={`จำนวน ${line.name}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8"
                      aria-label={`เพิ่มจำนวน ${line.name}`}
                      onClick={() => onQtyChange(line.lineId, line.qty + 1)}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="tabular-money text-right">
                  {formatMoney(line.unitPrice)}
                </TableCell>
                <TableCell>
                  <NumberInput
                    value={line.discount}
                    min={0}
                    emptyValue={0}
                    decimal
                    onValueChange={(v) => onDiscountChange(line.lineId, v ?? 0)}
                    className="tabular-money mx-auto h-8 w-24 text-center"
                    aria-label={`ส่วนลด ${line.name}`}
                  />
                </TableCell>
                <TableCell className="tabular-money text-right font-medium">
                  {formatMoney(line.qty * line.unitPrice - line.discount)}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    aria-label={`ลบ ${line.name} ออกจากตะกร้า`}
                    onClick={() => onRemove(line.lineId)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
