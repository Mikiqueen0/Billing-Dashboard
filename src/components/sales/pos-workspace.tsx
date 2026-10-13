"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { products } from "@/mocks/products";
import { CartTable } from "./cart-table";
import { CustomerPicker } from "./customer-picker";
import { PaymentPanel } from "./payment-panel";
import { ProductSearch } from "./product-search";
import type { CartLine, PosPaymentMethod } from "./types";

export function PosWorkspace() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [lines, setLines] = useState<CartLine[]>([]);
  const [highlightLineId, setHighlightLineId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState("c-000");
  const [method, setMethod] = useState<PosPaymentMethod>("cash");
  const highlightTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const payButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "F2") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "F9") {
        e.preventDefault();
        payButtonRef.current?.click();
      } else if (e.key === "Escape") {
        if (document.activeElement === searchInputRef.current) {
          setQuery("");
        }
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  function flash(lineId: string) {
    setHighlightLineId(lineId);
    if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
    highlightTimeout.current = setTimeout(() => setHighlightLineId(null), 600);
  }

  function addProduct(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        const nextQty = existing.qty + 1;
        if (nextQty > product.stockQty) {
          toast.warning(`สต็อก "${product.name}" เหลือ ${product.stockQty} ${product.unit}`);
        }
        flash(existing.lineId);
        return prev.map((l) =>
          l.lineId === existing.lineId ? { ...l, qty: nextQty } : l,
        );
      }
      const lineId = `line-${productId}-${Date.now()}`;
      if (product.stockQty <= 0) {
        toast.warning(`"${product.name}" สต็อกหมด`);
      }
      flash(lineId);
      return [
        ...prev,
        {
          lineId,
          productId: product.id,
          name: product.name,
          unit: product.unit,
          sku: product.sku,
          qty: 1,
          unitPrice: product.sellPrice,
          unitCost: product.costPrice,
          discount: 0,
          stockQty: product.stockQty,
        },
      ];
    });
    setQuery("");
  }

  function updateQty(lineId: string, qty: number) {
    setLines((prev) =>
      prev.map((l) => {
        if (l.lineId !== lineId) return l;
        if (qty > l.stockQty) {
          toast.warning(`สต็อก "${l.name}" เหลือ ${l.stockQty} ${l.unit}`);
        }
        return { ...l, qty };
      }),
    );
  }

  function updateDiscount(lineId: string, discount: number) {
    setLines((prev) =>
      prev.map((l) => (l.lineId === lineId ? { ...l, discount } : l)),
    );
  }

  function removeLine(lineId: string) {
    setLines((prev) => prev.filter((l) => l.lineId !== lineId));
  }

  const subtotal = lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
  const discountTotal = lines.reduce((sum, l) => sum + l.discount, 0);
  const grandTotal = Math.max(subtotal - discountTotal, 0);

  function handlePay() {
    if (lines.length === 0) {
      toast.error("กรุณาเพิ่มสินค้าในตะกร้าก่อนชำระเงิน");
      return;
    }
    if (method === "credit" && customerId === "c-000") {
      toast.error("กรุณาเลือกลูกค้าสำหรับการขายเครดิต");
      return;
    }
    toast.success("บันทึกบิลสำเร็จ", {
      description: "ตัวอย่าง UI — พาไปหน้ารายละเอียดบิลตัวอย่าง",
    });
    setLines([]);
    router.push("/sales/s-0007");
  }

  function handleHold() {
    if (lines.length === 0) {
      toast.error("ไม่มีสินค้าในตะกร้าให้พักบิล");
      return;
    }
    toast.info("พักบิลแล้ว (ตัวอย่าง UI — ยังไม่เชื่อมข้อมูลจริง)");
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 space-y-4">
        <ProductSearch
          query={query}
          onQueryChange={setQuery}
          onSelectProduct={addProduct}
          inputRef={searchInputRef}
        />
        <CartTable
          lines={lines}
          highlightLineId={highlightLineId}
          onQtyChange={updateQty}
          onDiscountChange={updateDiscount}
          onRemove={removeLine}
        />
      </div>

      <div className="space-y-4 lg:sticky lg:top-18 lg:self-start">
        <Card>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">ลูกค้า</p>
            <CustomerPicker customerId={customerId} onChange={setCustomerId} />
          </CardContent>
        </Card>
        <PaymentPanel
          subtotal={subtotal}
          discountTotal={discountTotal}
          grandTotal={grandTotal}
          method={method}
          onMethodChange={setMethod}
          onPay={handlePay}
          onHold={handleHold}
          disabled={lines.length === 0}
          payButtonRef={payButtonRef}
        />
      </div>
    </div>
  );
}
