# Billing Dashboard

ระบบหลังร้าน (POS + Dashboard + สต็อก) สำหรับธุรกิจซื้อมาขายไป — UI ภาษาไทย

## เอกสารที่ต้องอ่าน
- `docs/PLAN.md` — ขอบเขตระบบ, sitemap, DB schema, roadmap
- `docs/UI-DESIGN.md` — **อ่านทุกครั้งก่อนทำงาน UI** และใช้ plugin `ui-ux-pro-max` ตาม workflow ในไฟล์นั้น
- `design-system/billing-dashboard/MASTER.md` — design system (สร้างจาก ui-ux-pro-max); ถ้ามี `pages/<page>.md` ให้ override MASTER

## Stack
Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · shadcn/ui · Drizzle ORM · Neon Postgres · Vercel

## กฎหลัก
- งาน UI ทุกชิ้น: ใช้ skill `ui-ux-pro-max:ui-ux-pro-max` (design decisions), `ui-ux-pro-max:ui-styling` (shadcn/Tailwind), `ui-ux-pro-max:design-system` (tokens)
- เงินห้ามใช้ float — ใช้ `numeric` ใน DB และคำนวณผ่าน `src/lib/money.ts`
- การสร้าง/ยกเลิกบิลและการปรับสต็อกต้องอยู่ใน DB transaction และบันทึก `stock_movements` เสมอ
- `sale_items` เก็บ snapshot ของชื่อสินค้าและทุน ณ เวลาขาย
- ไม่ลบบิลจริง — ใช้ status `void`
- เวลาเก็บเป็น `timestamptz`, แสดงผล timezone `Asia/Bangkok`
- Validation ใช้ zod schema ร่วมกันใน `src/lib/validations/`
- ข้อความที่ผู้ใช้เห็นเป็นภาษาไทย; ชื่อตัวแปร/โค้ดเป็นภาษาอังกฤษ
