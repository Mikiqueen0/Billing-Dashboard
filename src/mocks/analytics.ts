import { categories, products } from "./products";
import { customers } from "./customers";
import { sales } from "./sales";
import { MOCK_TODAY } from "./now";
import type { Sale } from "./types";

export type DateRangeKey = "today" | "7d" | "month";

export type KpiDatum = {
  key: string;
  label: string;
  value: number;
  format: "money" | "number" | "percent";
  changePercent: number;
  /** ทิศทางที่ "ดี" สำหรับ KPI นี้ — ใช้เลือกสี/ไอคอนแทนการผูกกับเครื่องหมาย +/- ตรงๆ */
  goodDirection: "up" | "down";
  sparkline: number[];
};

// --- ตัวช่วยคำนวณวันที่แบบสตริง "YYYY-MM-DD" ล้วน (ไม่ผ่าน timezone ของ Date จริง) ---
// ป้องกัน bug เลื่อนวันข้ามเขตเวลา: ข้อมูล soldAt ทุกตัวเก็บ "YYYY-MM-DDTHH:mm:ss+07:00"
// อยู่แล้ว ตัดเอา 10 ตัวแรกได้วันที่ไทยตรงๆ โดยไม่ต้องสร้าง Date object เลย

function toUTCms(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function fromUTCms(ms: number): string {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDaysStr(dateStr: string, n: number): string {
  return fromUTCms(toUTCms(dateStr) + n * 86_400_000);
}

function daysBetween(startStr: string, endStr: string): number {
  return Math.round((toUTCms(endStr) - toUTCms(startStr)) / 86_400_000);
}

type RangeBounds = { start: string; end: string; prevStart: string; prevEnd: string };

/** ช่วง [start, end) ของตัวกรอง และช่วงก่อนหน้าที่ยาวเท่ากันสำหรับเทียบ % (end เป็น exclusive) */
function getRangeBounds(range: DateRangeKey, todayStr: string): RangeBounds {
  if (range === "today") {
    return {
      start: todayStr,
      end: addDaysStr(todayStr, 1),
      prevStart: addDaysStr(todayStr, -1),
      prevEnd: todayStr,
    };
  }
  if (range === "7d") {
    const start = addDaysStr(todayStr, -6);
    return {
      start,
      end: addDaysStr(todayStr, 1),
      prevStart: addDaysStr(start, -7),
      prevEnd: start,
    };
  }
  // month: วันที่ 1 ของเดือนนี้ถึงวันนี้ (MTD) เทียบกับช่วงวันเดียวกันของเดือนก่อน
  const [y, m] = todayStr.split("-").map(Number);
  const monthStart = `${y}-${String(m).padStart(2, "0")}-01`;
  const dayOfMonth = daysBetween(monthStart, todayStr) + 1;
  const prevMonthStart =
    m === 1 ? `${y - 1}-12-01` : `${y}-${String(m - 1).padStart(2, "0")}-01`;
  return {
    start: monthStart,
    end: addDaysStr(todayStr, 1),
    prevStart: prevMonthStart,
    prevEnd: addDaysStr(prevMonthStart, dayOfMonth),
  };
}

function saleDate(sale: Sale): string {
  return sale.soldAt.slice(0, 10);
}

function inRange(sale: Sale, start: string, end: string): boolean {
  const d = saleDate(sale);
  return d >= start && d < end;
}

function lineProfit(item: Sale["items"][number]) {
  return (item.unitPrice - item.unitCost) * item.qty - item.discount;
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

function categoryName(id: string) {
  return categories.find((c) => c.id === id)?.name ?? "อื่นๆ";
}

export type DashboardData = {
  kpis: KpiDatum[];
  dailySales: { date: string; sales: number; profit: number }[];
  topProductsByQty: { name: string; qty: number }[];
  topProductsByProfit: { name: string; profit: number }[];
  categorySales: { category: string; amount: number }[];
  paymentBreakdown: { method: string; amount: number; percent: number }[];
  topCustomers: { name: string; amount: number }[];
};

const paymentMethodLabel: Record<string, string> = {
  cash: "เงินสด",
  transfer: "โอนเงิน",
  credit: "เครดิต",
  card: "บัตร",
};

function aggregate(completedSales: Sale[]) {
  let sumSales = 0;
  let sumProfit = 0;
  const qtyByProduct = new Map<string, number>();
  const profitByProduct = new Map<string, number>();
  const amountByCategory = new Map<string, number>();
  const amountByPayment = new Map<string, number>();
  const amountByCustomer = new Map<string, number>();

  for (const sale of completedSales) {
    sumSales += sale.grandTotal;
    amountByPayment.set(
      sale.paymentMethod,
      (amountByPayment.get(sale.paymentMethod) ?? 0) + sale.grandTotal,
    );
    if (sale.customerId && sale.customerId !== "c-000") {
      amountByCustomer.set(
        sale.customerId,
        (amountByCustomer.get(sale.customerId) ?? 0) + sale.grandTotal,
      );
    }
    for (const item of sale.items) {
      const profit = lineProfit(item);
      sumProfit += profit;
      qtyByProduct.set(item.productId, (qtyByProduct.get(item.productId) ?? 0) + item.qty);
      profitByProduct.set(
        item.productId,
        (profitByProduct.get(item.productId) ?? 0) + profit,
      );
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        amountByCategory.set(
          product.categoryId,
          (amountByCategory.get(product.categoryId) ?? 0) + item.lineTotal,
        );
      }
    }
  }

  return { sumSales, sumProfit, qtyByProduct, profitByProduct, amountByCategory, amountByPayment, amountByCustomer };
}

function topN(
  map: Map<string, number>,
  n: number,
  nameFor: (id: string) => string,
): { name: string; value: number }[] {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id, value]) => ({ name: nameFor(id), value }));
}

/** สต็อกปัจจุบันไม่ขึ้นกับช่วงเวลาที่เลือก จึงคำนวณแยกจาก aggregate() ด้านบน */
function stockValue() {
  return products.reduce((sum, p) => sum + p.stockQty * p.costPrice, 0);
}

function receivableTotal() {
  return customers.reduce((sum, c) => sum + c.outstandingBalance, 0);
}

export function computeDashboardData(range: DateRangeKey): DashboardData {
  const { start, end, prevStart, prevEnd } = getRangeBounds(range, MOCK_TODAY);
  const completed = sales.filter((s) => s.status === "completed");
  const current = completed.filter((s) => inRange(s, start, end));
  const previous = completed.filter((s) => inRange(s, prevStart, prevEnd));

  const curAgg = aggregate(current);
  const prevAgg = aggregate(previous);

  const billCount = current.length;
  const prevBillCount = previous.length;
  const avgPerBill = billCount > 0 ? curAgg.sumSales / billCount : 0;
  const prevAvgPerBill = prevBillCount > 0 ? prevAgg.sumSales / prevBillCount : 0;
  const marginPercent = curAgg.sumSales > 0 ? (curAgg.sumProfit / curAgg.sumSales) * 100 : 0;
  const prevMarginPercent = prevAgg.sumSales > 0 ? (prevAgg.sumProfit / prevAgg.sumSales) * 100 : 0;
  const stock = stockValue();
  const receivable = receivableTotal();

  // sparkline: ยอดขายรายวัน 12 วันล่าสุดก่อนสิ้นช่วงที่เลือก (แนวโน้มคร่าวๆ ประกอบ KPI)
  const dailyTotalByDate = new Map<string, number>();
  for (const s of completed) {
    const k = saleDate(s);
    dailyTotalByDate.set(k, (dailyTotalByDate.get(k) ?? 0) + s.grandTotal);
  }
  const salesSparkline: number[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = addDaysStr(end, -1 - i);
    salesSparkline.push(Math.round((dailyTotalByDate.get(d) ?? 0) / 1000));
  }

  const kpis: KpiDatum[] = [
    {
      key: "sales", label: "ยอดขาย", value: curAgg.sumSales, format: "money",
      changePercent: percentChange(curAgg.sumSales, prevAgg.sumSales), goodDirection: "up",
      sparkline: salesSparkline,
    },
    {
      key: "grossProfit", label: "กำไรขั้นต้น", value: curAgg.sumProfit, format: "money",
      changePercent: percentChange(curAgg.sumProfit, prevAgg.sumProfit), goodDirection: "up",
      sparkline: salesSparkline.map((v) => Math.round(v * (marginPercent / 100))),
    },
    {
      key: "marginPercent", label: "อัตรากำไร %", value: marginPercent, format: "percent",
      changePercent: percentChange(marginPercent, prevMarginPercent), goodDirection: "up",
      sparkline: salesSparkline.map((v) => Math.round(v * 0.25)),
    },
    {
      key: "billCount", label: "จำนวนบิล", value: billCount, format: "number",
      changePercent: percentChange(billCount, prevBillCount), goodDirection: "up",
      sparkline: salesSparkline.map((v) => Math.round(v / 10)),
    },
    {
      key: "avgPerBill", label: "ยอดเฉลี่ยต่อบิล", value: avgPerBill, format: "money",
      changePercent: percentChange(avgPerBill, prevAvgPerBill), goodDirection: "up",
      sparkline: salesSparkline,
    },
    {
      key: "stockValue", label: "มูลค่าสต็อก (ตามทุน)", value: stock, format: "money",
      changePercent: 0, goodDirection: "down",
      sparkline: Array(12).fill(Math.round(stock / 1000)),
    },
    {
      key: "receivable", label: "ยอดค้างชำระ", value: receivable, format: "money",
      changePercent: 0, goodDirection: "down",
      sparkline: Array(12).fill(Math.round(receivable / 1000)),
    },
  ];

  const dailySales: { date: string; sales: number; profit: number }[] = [];
  {
    const byDate = new Map<string, { sales: number; profit: number }>();
    for (const s of current) {
      const k = saleDate(s);
      const entry = byDate.get(k) ?? { sales: 0, profit: 0 };
      entry.sales += s.grandTotal;
      entry.profit += s.items.reduce((sum, it) => sum + lineProfit(it), 0);
      byDate.set(k, entry);
    }
    const days = Math.max(1, daysBetween(start, end));
    for (let i = 0; i < days; i++) {
      const k = addDaysStr(start, i);
      const entry = byDate.get(k) ?? { sales: 0, profit: 0 };
      dailySales.push({ date: k, sales: entry.sales, profit: entry.profit });
    }
  }

  const topProductsByQty = topN(curAgg.qtyByProduct, 6, (id) => products.find((p) => p.id === id)?.name ?? id)
    .map((x) => ({ name: x.name, qty: x.value }));
  const topProductsByProfit = topN(curAgg.profitByProduct, 6, (id) => products.find((p) => p.id === id)?.name ?? id)
    .map((x) => ({ name: x.name, profit: x.value }));
  const categorySales = Array.from(curAgg.amountByCategory.entries())
    .map(([id, amount]) => ({ category: categoryName(id), amount }))
    .sort((a, b) => b.amount - a.amount);
  const paymentBreakdown = Array.from(curAgg.amountByPayment.entries())
    .map(([method, amount]) => ({
      method: paymentMethodLabel[method] ?? method,
      amount,
      percent: curAgg.sumSales > 0 ? Math.round((amount / curAgg.sumSales) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
  const topCustomers = topN(curAgg.amountByCustomer, 5, (id) => customers.find((c) => c.id === id)?.name ?? id)
    .map((x) => ({ name: x.name, amount: x.value }));

  return {
    kpis,
    dailySales,
    topProductsByQty,
    topProductsByProfit,
    categorySales,
    paymentBreakdown,
    topCustomers,
  };
}
