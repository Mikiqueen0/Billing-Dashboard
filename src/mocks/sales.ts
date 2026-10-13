import { customers } from "./customers";
import { products } from "./products";
import type { PaymentMethod, Sale } from "./types";

function item(
  id: string,
  productId: string,
  productName: string,
  unit: string,
  qty: number,
  unitPrice: number,
  unitCost: number,
  discount = 0,
) {
  return {
    id,
    productId,
    productName,
    unit,
    qty,
    unitPrice,
    unitCost,
    discount,
    lineTotal: qty * unitPrice - discount,
  };
}

export const sales: Sale[] = [
  {
    id: "s-0007",
    billNo: "INV-26100007",
    customerId: "c-001",
    soldAt: "2026-10-13T09:42:00+07:00",
    status: "completed",
    items: [
      item("si-1", "p-001", "ค้อนหงอนเหล็ก 16 oz", "ชิ้น", 2, 150, 95),
      item("si-2", "p-008", "ท่อ PVC 4 หุน ยาว 4 เมตร", "ท่อน", 10, 95, 65, 50),
      item("si-3", "p-009", "ข้องอ PVC 1 นิ้ว", "ชิ้น", 20, 15, 8),
    ],
    subtotal: 1550,
    discountTotal: 50,
    vatAmount: 0,
    grandTotal: 1500,
    paymentMethod: "cash",
    paidAmount: 1500,
    note: null,
    soldBy: "แคชเชียร์ 1",
  },
  {
    id: "s-0006",
    billNo: "INV-26100006",
    customerId: "c-002",
    soldAt: "2026-10-12T15:10:00+07:00",
    status: "completed",
    items: [
      item("si-4", "p-014", "ปูนซีเมนต์ตราเสือ 50 กก.", "ถุง", 40, 165, 135),
      item("si-5", "p-016", "ลวดผูกเหล็ก เบอร์ 18", "กก.", 15, 60, 45),
    ],
    subtotal: 7500,
    discountTotal: 0,
    vatAmount: 0,
    grandTotal: 7500,
    paymentMethod: "credit",
    paidAmount: 0,
    note: "วางบิลสิ้นเดือน",
    soldBy: "แคชเชียร์ 1",
  },
  {
    id: "s-0005",
    billNo: "INV-26100005",
    customerId: "c-003",
    soldAt: "2026-10-12T11:25:00+07:00",
    status: "completed",
    items: [
      item("si-6", "p-005", "สีทาภายนอก TOA 5 แกลลอน", "ถัง", 1, 1890, 1450),
      item("si-7", "p-007", "แปรงทาสี 3 นิ้ว", "ชิ้น", 3, 40, 20, 20),
    ],
    subtotal: 2010,
    discountTotal: 20,
    vatAmount: 0,
    grandTotal: 1990,
    paymentMethod: "transfer",
    paidAmount: 1990,
    note: null,
    soldBy: "แคชเชียร์ 2",
  },
  {
    id: "s-0004",
    billNo: "INV-26100004",
    customerId: null,
    soldAt: "2026-10-11T14:05:00+07:00",
    status: "void",
    items: [item("si-8", "p-013", "หลอด LED 9W แสงขาว", "หลอด", 10, 65, 35)],
    subtotal: 650,
    discountTotal: 0,
    vatAmount: 0,
    grandTotal: 650,
    paymentMethod: "cash",
    paidAmount: 650,
    note: "ลูกค้าเปลี่ยนใจ ยกเลิกบิล",
    soldBy: "แคชเชียร์ 2",
  },
  {
    id: "s-0003",
    billNo: "INV-26100003",
    customerId: "c-004",
    soldAt: "2026-10-10T10:50:00+07:00",
    status: "completed",
    items: [
      item("si-9", "p-011", "สายไฟ VAF 2x1.5 (ม้วน 100m)", "ม้วน", 3, 1250, 980),
      item("si-10", "p-012", "ปลั๊กไฟ 3 ตา มีสวิตช์", "ชิ้น", 6, 120, 65),
    ],
    subtotal: 4470,
    discountTotal: 0,
    vatAmount: 0,
    grandTotal: 4470,
    paymentMethod: "credit",
    paidAmount: 1000,
    note: null,
    soldBy: "แคชเชียร์ 1",
  },
  {
    id: "s-0002",
    billNo: "INV-26100002",
    customerId: "c-005",
    soldAt: "2026-10-09T16:30:00+07:00",
    status: "completed",
    items: [
      item("si-11", "p-017", "ตะปูเกลียวปูน 2 นิ้ว (กล่อง)", "กล่อง", 12, 55, 38, 40),
      item("si-12", "p-019", "ถุงมือผ้าเคลือบยาง", "คู่", 24, 20, 12),
    ],
    subtotal: 1140,
    discountTotal: 40,
    vatAmount: 0,
    grandTotal: 1100,
    paymentMethod: "card",
    paidAmount: 1100,
    note: null,
    soldBy: "แคชเชียร์ 2",
  },
  {
    id: "s-0001",
    billNo: "INV-26100001",
    customerId: "c-003",
    soldAt: "2026-10-08T09:15:00+07:00",
    status: "completed",
    items: [item("si-13", "p-020", "เลื่อยลันดา 20 นิ้ว", "ชิ้น", 2, 95, 110)],
    subtotal: 190,
    discountTotal: 0,
    vatAmount: 0,
    grandTotal: 190,
    paymentMethod: "cash",
    paidAmount: 190,
    note: null,
    soldBy: "แคชเชียร์ 1",
  },
];

// --- ประวัติการขายย้อนหลัง (สร้างอัตโนมัติ) ---
// ให้ KPI/กราฟ/Top lists ทั้งหมดบน Dashboard คำนวณจากชุดข้อมูลเดียวกัน แทนที่จะเป็นตัวเลขแยกชุด
// ที่ขัดกันเอง — ครอบคลุม 1 ก.ย.–7 ต.ค. 2569 (ต่อจากบิลข้างบนซึ่งเป็นวันที่ 8–13 ต.ค.)
// สุ่มแบบกำหนด seed ตายตัว ผลลัพธ์จึงเหมือนเดิมทุกครั้งที่รัน

function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateHistoricalSales(): Sale[] {
  const rng = mulberry32(20260901);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)];
  const activeProducts = products.filter((p) => p.isActive);
  const namedCustomers = customers.filter((c) => c.code !== "W-000");
  const paymentPool: PaymentMethod[] = [
    "cash", "cash", "cash", "cash", "cash",
    "transfer", "transfer", "transfer",
    "credit", "credit",
    "card",
  ];
  const cashiers = ["แคชเชียร์ 1", "แคชเชียร์ 2"];

  const result: Sale[] = [];
  let seq = 0;
  // ใช้วันที่ "เปล่า" แบบ UTC (ไม่มีเวลา) แทนวันที่ของจริงใน +07:00 เพียงเพื่อนับวันและหา
  // วันในสัปดาห์ให้ถูก แล้วค่อยประกอบเป็นสตริงเวลาไทยเองด้านล่าง — กัน bug เลื่อนวันข้ามเขตเวลา
  const startDay = Date.UTC(2026, 8, 1);
  const endDay = Date.UTC(2026, 9, 7);

  for (let dayUTC = startDay; dayUTC <= endDay; dayUTC += 86_400_000) {
    const d = new Date(dayUTC);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    const dow = d.getUTCDay();
    const isWeekend = dow === 5 || dow === 6; // ศ., ส. ขายดีกว่า ตามรูปแบบใน heatmap
    const billsToday = isWeekend ? 5 + Math.floor(rng() * 4) : 3 + Math.floor(rng() * 4);

    for (let b = 0; b < billsToday; b++) {
      seq += 1;
      const hour = 8 + Math.floor(rng() * 12);
      const minute = Math.floor(rng() * 60);
      const pad = (n: number) => String(n).padStart(2, "0");
      const soldAtStr = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00+07:00`;
      const isVoid = rng() < 0.04;
      const customer = rng() < 0.35 ? customers[0] : pick(namedCustomers);
      const itemCount = 1 + Math.floor(rng() * 4);
      const chosenProductIds = new Set<string>();
      const items = [];
      let subtotal = 0;
      let discountTotal = 0;

      for (let i = 0; i < itemCount; i++) {
        const product = pick(activeProducts);
        if (chosenProductIds.has(product.id)) continue;
        chosenProductIds.add(product.id);
        const qty = 1 + Math.floor(rng() * 12);
        const hasDiscount = rng() < 0.12;
        const discount = hasDiscount ? Math.round(product.sellPrice * qty * 0.05) : 0;
        const lineTotal = qty * product.sellPrice - discount;
        subtotal += qty * product.sellPrice;
        discountTotal += discount;
        items.push({
          id: `si-gen-${seq}-${i}`,
          productId: product.id,
          productName: product.name,
          unit: product.unit,
          qty,
          unitPrice: product.sellPrice,
          unitCost: product.costPrice,
          discount,
          lineTotal,
        });
      }
      if (items.length === 0) continue;

      const grandTotal = subtotal - discountTotal;
      const paymentMethod = pick(paymentPool);
      const paidAmount = paymentMethod === "credit" ? Math.round(grandTotal * rng() * 0.3) : grandTotal;
      const dateKey = `${String(year).slice(2)}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;

      result.push({
        id: `s-gen-${seq}`,
        billNo: `INV-${dateKey}${String(seq).padStart(4, "0")}`,
        customerId: customer.id,
        soldAt: soldAtStr,
        status: isVoid ? "void" : "completed",
        items,
        subtotal,
        discountTotal,
        vatAmount: 0,
        grandTotal,
        paymentMethod,
        paidAmount,
        note: isVoid ? "ยกเลิกบิล (ตัวอย่างข้อมูล)" : null,
        soldBy: pick(cashiers),
      });
    }
  }

  return result.sort((a, b) => b.soldAt.localeCompare(a.soldAt));
}

sales.push(...generateHistoricalSales());

export function getSaleById(id: string): Sale | undefined {
  return sales.find((s) => s.id === id || s.billNo === id);
}
