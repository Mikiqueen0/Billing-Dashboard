# Billing Dashboard — แผนระบบ (Plan)

ระบบหลังร้านสำหรับธุรกิจซื้อมาขายไป: เปิดบิล/พิมพ์ PDF, จัดการสต็อก, Dashboard สรุปยอดขาย-กำไร, โปรโมชั่น และนำเข้าข้อมูลจาก Excel

---

## 1. Tech Stack

| ส่วน | เลือกใช้ | เหตุผล |
|---|---|---|
| Framework | **Next.js (App Router) + React + TypeScript** | Server Components + Server Actions ลดการเขียน API แยก |
| Styling | **Tailwind CSS v4 + shadcn/ui** | component สำเร็จรูป (Table, Dialog, Form, Combobox) ปรับธีมได้ |
| Database | **Neon (Postgres serverless)** — free tier | Postgres เต็มรูปแบบ, มี branching แยก dev/prod |
| ORM | **Drizzle ORM** + `@neondatabase/serverless` | เบา, cold start เร็วบน Vercel, migration ชัดเจน |
| Auth | **Better Auth** (หรือ Auth.js v5) แบบ email/password | มี role `owner` / `staff` |
| Validation | **Zod** + **react-hook-form** | ใช้ schema เดียวกันทั้ง client/server |
| ตาราง | **TanStack Table** | sort / filter / pagination ฝั่ง server |
| กราฟ | **Recharts** (ผ่าน shadcn `chart`) | เข้ากับธีม Tailwind |
| PDF | **@react-pdf/renderer** (ฝังฟอนต์ไทย Sarabun / Noto Sans Thai) | สร้าง PDF ฝั่ง server, ภาษาไทยไม่เพี้ยน |
| Excel | **SheetJS (xlsx)** หรือ **exceljs** | อ่านไฟล์ import + export รายงาน |
| Hosting | **Vercel** | deploy จาก GitHub อัตโนมัติ, preview ต่อ PR |

### ⚠️ ข้อควรรู้เรื่องค่าใช้จ่าย
- **Vercel Hobby (ฟรี) อนุญาตเฉพาะการใช้งานส่วนตัว/ไม่เชิงพาณิชย์** — ระบบของร้านค้าที่ใช้ทำธุรกิจจริงถือเป็น commercial ตามเงื่อนไขของ Vercel ควรเผื่องบ **Pro (~$20/เดือน)** หรือพิจารณาทางเลือกที่ free tier อนุญาตเชิงพาณิชย์ (เช่น Netlify, Cloudflare via OpenNext) ช่วงพัฒนา/ทดลองใช้ Hobby ได้
- **Neon free tier**: พื้นที่จำกัด (~0.5 GB/โปรเจกต์) และ compute จะ sleep เมื่อไม่มีใช้งาน → request แรกช้าขึ้นเล็กน้อย (ไม่กี่ร้อย ms) สำหรับร้านค้าขนาดเล็ก-กลางเพียงพอหลายปี
- Neon HTTP driver ไม่รองรับ interactive transaction → งานที่ต้องตัดสต็อก + สร้างบิลพร้อมกัน ให้ใช้ `Pool` (WebSocket) จาก `@neondatabase/serverless` กับ `drizzle-orm/neon-serverless`

---

## 2. โครงสร้างหน้าเว็บ (Sitemap)

```
/login                         เข้าสู่ระบบ
/                              → redirect ไป /dashboard

/dashboard                     ภาพรวม KPI + กราฟ + แจ้งเตือน

ขาย
/sales/new                     หน้าเปิดบิล (POS) ★ หน้าที่ใช้บ่อยที่สุด
/sales                         ประวัติบิลขาย (ค้นหา/กรอง/ยกเลิกบิล)
/sales/[id]                    รายละเอียดบิล + ปุ่มพิมพ์/ดาวน์โหลด PDF
/sales/[id]/pdf                (Route Handler) คืนไฟล์ PDF

ซื้อ / สต็อก
/purchases/new                 รับสินค้าเข้า (บิลซื้อจากผู้ขาย)
/purchases                     ประวัติการซื้อ
/inventory                     สต็อกคงเหลือ + ปรับสต็อก + ความเคลื่อนไหว

ข้อมูลหลัก
/products  /products/[id]      สินค้า, หมวดหมู่, ราคา, ทุน, จุดสั่งซื้อซ้ำ
/customers /customers/[id]     ลูกค้า + ประวัติการซื้อ + ยอดค้างชำระ
/suppliers                     ผู้ขาย/ซัพพลายเออร์
/promotions                    สร้าง/เปิด-ปิดโปรโมชั่น

รายงาน / เครื่องมือ
/reports                       รายงานยอดขาย กำไร สินค้าขายดี ฯลฯ (export Excel/PDF)
/import                        นำเข้า Excel (สินค้า / ลูกค้า / สต็อกตั้งต้น)
/settings                      ข้อมูลร้าน, โลโก้, VAT, รูปแบบเลขบิล, ผู้ใช้งาน
```

Layout: Sidebar ซ้าย (ยุบได้) + Topbar (ค้นหาทั่วระบบ, ปุ่ม "เปิดบิลใหม่", เมนูผู้ใช้) บนมือถือใช้ bottom nav 4–5 เมนูหลัก

---

## 3. โครงสร้างโปรเจกต์ (Folder Structure)

```
src/
  app/
    (auth)/login/page.tsx
    (app)/                      ← layout มี sidebar + ตรวจ session
      layout.tsx
      dashboard/page.tsx
      sales/{page.tsx, new/page.tsx, [id]/page.tsx, [id]/pdf/route.ts}
      purchases/...
      inventory/...
      products/...
      customers/...
      suppliers/...
      promotions/...
      reports/...
      import/...
      settings/...
    api/auth/[...all]/route.ts
  components/
    ui/                         ← shadcn components
    layout/                     ← Sidebar, Topbar, PageHeader
    dashboard/                  ← KpiCard, SalesChart, LowStockList...
    sales/                      ← ProductPicker, CartTable, PaymentPanel
    pdf/                        ← InvoiceDocument, ReceiptDocument (react-pdf)
  db/
    schema.ts                   ← Drizzle schema ทั้งหมด
    index.ts                    ← db client (neon)
    migrations/
    seed.ts
  lib/
    validations/                ← zod schemas
    money.ts                    ← format เงินบาท, ปัดเศษ
    date.ts                     ← timezone Asia/Bangkok, พ.ศ.
    promotions.ts               ← engine คำนวณส่วนลด (pure function, เขียน test)
  server/
    actions/                    ← Server Actions แยกตาม domain (sales.ts, products.ts...)
    queries/                    ← query สำหรับ dashboard / reports
  fonts/                        ← Sarabun / NotoSansThai .ttf สำหรับ PDF
drizzle.config.ts
```

---

## 4. Database Schema (ร่าง)

> เงินเก็บเป็น `numeric(12,2)` (หรือเก็บเป็นสตางค์ `integer`) — **ห้ามใช้ float**

```
users            id, name, email, role(owner|staff), created_at
shop_settings    id, name, address, tax_id, phone, logo_url,
                 vat_enabled, vat_rate, bill_prefix, receipt_footer

categories       id, name
products         id, sku, barcode, name, category_id, unit,
                 cost_price, sell_price, stock_qty, reorder_point,
                 is_active, created_at, updated_at
customers        id, code, name, phone, address, tax_id, note,
                 credit_limit, created_at
suppliers        id, name, phone, address, tax_id

sales            id, bill_no (unique), customer_id?, user_id,
                 status(completed|void), sold_at,
                 subtotal, discount_total, vat_amount, grand_total,
                 payment_method(cash|transfer|card|credit), paid_amount,
                 promotion_id?, note
sale_items       id, sale_id, product_id, product_name_snapshot,
                 qty, unit_price, unit_cost_snapshot, discount, line_total
                 ↑ เก็บ "ทุน ณ วันที่ขาย" เพื่อคำนวณกำไรย้อนหลังได้ถูกต้อง

purchases        id, doc_no, supplier_id, purchased_at, total, note
purchase_items   id, purchase_id, product_id, qty, unit_cost

stock_movements  id, product_id, type(sale|purchase|adjust|void|import),
                 qty_change (+/-), ref_type, ref_id, note, created_by, created_at
                 ↑ สมุดบัญชีสต็อก: ตรวจย้อนได้ว่าสต็อกหายไปไหน

promotions       id, name, type(percent|fixed|buy_x_get_y|min_spend),
                 value, buy_qty, get_qty, min_amount,
                 scope(all|category|product), starts_at, ends_at, is_active
promotion_targets promotion_id, product_id? , category_id?

payments         id, sale_id, amount, method, paid_at   ← สำหรับลูกค้าเครดิต/ผ่อนชำระ
doc_counters     key (เช่น INV-2026), last_no           ← ออกเลขบิลแบบไม่ซ้ำ
audit_logs       id, user_id, action, entity, entity_id, diff, created_at
```

**กฎสำคัญ**
- สร้างบิล = 1 transaction: ออกเลขบิล → insert sales + sale_items → ลด `stock_qty` → insert `stock_movements`
- ยกเลิกบิล = เปลี่ยน status เป็น `void` + คืนสต็อก (ไม่ลบข้อมูลจริง)
- รับสินค้าเข้า อัปเดต `cost_price` แบบต้นทุนถัวเฉลี่ย (weighted average) หรือทุนล่าสุด — เลือกใน settings
- เวลาทั้งหมดเก็บเป็น `timestamptz` แสดงผลเป็น Asia/Bangkok

---

## 5. ฟีเจอร์ตามโมดูล

### 5.1 เปิดบิล (POS) — `/sales/new`
- ค้นหาสินค้าด้วยชื่อ / SKU / สแกนบาร์โค้ด (keyboard-first: Enter เพิ่ม, ↑↓ เลือก)
- ตะกร้า: แก้จำนวน, ราคา, ส่วนลดต่อรายการ; เตือนเมื่อสต็อกไม่พอ / ขายต่ำกว่าทุน
- เลือกลูกค้า (หรือ "ลูกค้าทั่วไป") + สร้างลูกค้าใหม่ได้ทันทีใน dialog
- โปรโมชั่นที่เข้าเงื่อนไขแสดงอัตโนมัติ เลือกใช้/ไม่ใช้ได้
- ชำระเงิน: เงินสด (คำนวณเงินทอน) / โอน / บัตร / เครดิต (ค้างชำระ)
- บันทึก → ไปหน้าบิล พร้อมปุ่ม **พิมพ์** และ **ดาวน์โหลด PDF**
- รองรับ "พักบิล" (draft) กรณีลูกค้ายังเลือกของไม่เสร็จ

### 5.2 PDF / พิมพ์
- 2 รูปแบบ: **A4 ใบเสร็จ/ใบส่งของ** และ **ใบเสร็จความร้อน 80mm**
- ฝังฟอนต์ไทย, โลโก้ร้าน, เลขผู้เสียภาษี, จำนวนเงินเป็นตัวอักษร (เช่น "หนึ่งร้อยบาทถ้วน")
- ถ้าเปิด VAT → ออก "ใบกำกับภาษีอย่างย่อ/เต็มรูป" ได้
- พิมพ์ซ้ำได้ (มีคำว่า "สำเนา")

### 5.3 Dashboard — `/dashboard`
ตัวกรองช่วงเวลา: วันนี้ / 7 วัน / เดือนนี้ / กำหนดเอง (เทียบกับช่วงก่อนหน้า %)

**KPI cards**: ยอดขาย · กำไรขั้นต้น · อัตรากำไร % · จำนวนบิล · ยอดเฉลี่ยต่อบิล · มูลค่าสต็อก (ตามทุน) · ยอดค้างชำระ

**กราฟ / ตาราง**
- ยอดขาย & กำไร รายวัน/เดือน (line/bar)
- สินค้าขายดี Top 10 (ตามจำนวน และตามกำไร — มักไม่ใช่ตัวเดียวกัน)
- ยอดขายตามหมวดหมู่ (bar แนวนอน)
- ช่วงเวลาขายดี (heatmap วัน × ชั่วโมง) → ช่วยจัดคน/เติมของ
- สัดส่วนวิธีชำระเงิน
- ลูกค้าซื้อเยอะสุด Top 10

**แจ้งเตือน (Action items)**
- สินค้าใกล้หมด (≤ reorder_point)
- สินค้าไม่เคลื่อนไหว (ไม่มีการขาย > 60 วัน = ทุนจม)
- สินค้าที่ราคาขาย < ทุน
- ลูกค้าค้างชำระเกินกำหนด
- โปรโมชั่นที่ใกล้หมดอายุ

### 5.4 สต็อก — `/inventory`
- คงเหลือ, มูลค่าตามทุน, จุดสั่งซื้อ, สถานะ (ปกติ/ใกล้หมด/หมด)
- ปรับสต็อก (นับจริง, ของเสีย, ของหาย) ต้องใส่เหตุผล
- ดูความเคลื่อนไหวรายสินค้า (ledger จาก `stock_movements`)

### 5.5 โปรโมชั่น — `/promotions`
เพิ่มเองได้ ประเภทที่รองรับ (ทำเป็นเฟส):
1. ลด % / ลดเป็นบาท — ทั้งบิล, ตามหมวดหมู่ หรือรายสินค้า
2. ซื้อครบ X บาท ลด Y
3. ซื้อ X แถม Y
- กำหนดวันเริ่ม–สิ้นสุด, เปิด/ปิด, ดูยอดขายที่เกิดจากโปรแต่ละตัว
- Logic อยู่ใน `lib/promotions.ts` เป็น pure function และมี unit test

### 5.6 นำเข้าข้อมูล — `/import`
1. อัปโหลด .xlsx / .csv
2. **Map คอลัมน์** (เช่น "ชื่อสินค้า" → name, "ทุน" → cost_price) — เพราะยังไม่รู้รูปแบบไฟล์จริง หน้านี้ต้องยืดหยุ่น
3. Preview + ตรวจ error รายแถว (zod) เช่น ราคาไม่ใช่ตัวเลข, SKU ซ้ำ
4. เลือกโหมด: เพิ่มใหม่อย่างเดียว / อัปเดตถ้า SKU ซ้ำ
5. ยืนยัน → insert แบบ batch ใน transaction + บันทึก `stock_movements(type=import)`
- มีปุ่มดาวน์โหลด **template Excel** ให้กรอกตามรูปแบบที่ระบบต้องการ

### 5.7 รายงาน — `/reports`
ยอดขายรายวัน/เดือน, กำไรตามสินค้า/หมวด, ประวัติลูกค้า, สรุปภาษีขาย (ถ้ามี VAT), สรุปการซื้อ — export Excel/PDF ได้

---

## 6. Roadmap (แบ่งเฟส)

| เฟส | ขอบเขต | ผลลัพธ์ |
|---|---|---|
| **0. Setup** | สร้างโปรเจกต์, Tailwind + shadcn, Drizzle + Neon, Auth, layout, deploy Vercel ครั้งแรก, สร้าง design system (ดู `docs/UI-DESIGN.md`) | เข้า login แล้วเห็น layout เปล่าบน URL จริง |
| **1. ข้อมูลหลัก + Import** | CRUD สินค้า/หมวด/ลูกค้า/ผู้ขาย, หน้า Import Excel | เอาข้อมูล Excel เดิมเข้าระบบได้ |
| **2. เปิดบิล + PDF** | POS, ตัดสต็อก, ประวัติบิล, ยกเลิกบิล, PDF A4 + 80mm | **ใช้งานขายจริงได้ (MVP)** |
| **3. Dashboard + สต็อก** | KPI, กราฟ, แจ้งเตือน, หน้า inventory, รับสินค้าเข้า | เห็นภาพรวมธุรกิจ |
| **4. โปรโมชั่น + รายงาน** | Promotion engine, reports + export | ครบตาม requirement |
| **5. ขัดเกลา** | ลูกหนี้/รับชำระ, audit log, สิทธิ์ staff, backup, PWA ใช้บนแท็บเล็ต | พร้อมใช้ระยะยาว |

---

## 7. Deploy & Environment

1. สร้างโปรเจกต์ใน Neon → ได้ `DATABASE_URL` (ใช้ branch `dev` ตอนพัฒนา, `main` สำหรับ production)
2. Push ขึ้น GitHub → Import โปรเจกต์ใน Vercel (หรือใช้ Neon integration ใน Vercel Marketplace ซึ่งตั้ง env ให้อัตโนมัติ)
3. Env ที่ต้องมี: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
4. Migration: `drizzle-kit generate` → `drizzle-kit migrate` (รันก่อน deploy หรือใน build step)
5. Backup: เปิด point-in-time restore ของ Neon + ปุ่ม export ข้อมูลทั้งหมดเป็น Excel ในหน้า settings

---

## 8. คำถามที่ต้องตอบก่อนเริ่มเฟส 1–2

- [ ] ขอตัวอย่างไฟล์ Excel จริง (แม้ข้อมูลปลอม) — เพื่อออกแบบหน้า map คอลัมน์และ seed
- [ ] ร้านจด VAT หรือไม่? ต้องออกใบกำกับภาษีเต็มรูปไหม?
- [ ] พิมพ์บิลด้วยเครื่องอะไร — A4 ทั่วไป หรือเครื่องพิมพ์ความร้อน 80mm/58mm?
- [ ] มีการขายเชื่อ (เครดิต/ค้างจ่าย) หรือไม่?
- [ ] ผู้ใช้กี่คน? ต้องแยกสิทธิ์พนักงานไม่ให้เห็นทุน/กำไรไหม?
- [ ] ใช้บาร์โค้ดหรือไม่? สินค้ามีหลายหน่วย (ชิ้น/แพ็ค/ลัง) หรือไม่?
- [ ] ราคาขายมีหลายระดับ (ปลีก/ส่ง/สมาชิก) หรือไม่?
- [ ] มีหลายสาขา/หลายคลังหรือไม่? (ถ้ามี ต้องเพิ่ม `warehouse_id` ตั้งแต่แรก)
