# UI Design Brief — สำหรับ Claude Code + plugin `ui-ux-pro-max`

> ไฟล์นี้คือ brief สำหรับ Claude Code ทุกครั้งที่ทำงานเกี่ยวกับหน้าตา (UI/UX) ของโปรเจกต์นี้
> อ่านคู่กับ `docs/PLAN.md` (ขอบเขตระบบ) และ `design-system/billing-dashboard/MASTER.md` (เมื่อสร้างแล้ว)

---

## 1. บริบทผลิตภัณฑ์ (ใช้เป็น input ให้ skill)

| หัวข้อ | รายละเอียด |
|---|---|
| Product type | Internal business dashboard + POS (back-office) สำหรับร้านค้าปลีก/ส่ง แบบซื้อมาขายไป |
| ผู้ใช้หลัก | เจ้าของร้าน (ดูยอด กำไร สต็อก), พนักงานหน้าร้าน (เปิดบิลเร็วๆ ซ้ำๆ ทั้งวัน) |
| อุปกรณ์ | Desktop/laptop ที่เคาน์เตอร์ (หลัก), แท็บเล็ต, มือถือ (เจ้าของดูยอดนอกร้าน) |
| ภาษา | **ภาษาไทยเป็นหลัก** ตัวเลข/สกุลเงินบาท (฿) วันที่แสดง พ.ศ. ได้ |
| อารมณ์/สไตล์ | สะอาด, น่าเชื่อถือ, อ่านง่าย, data-dense แต่ไม่รก — ไม่ใช่ landing page ไม่ต้องหวือหวา |
| Stack | Next.js (App Router) · React · Tailwind CSS v4 · shadcn/ui · Recharts · lucide-react |
| Theme | Light (default) + Dark mode |

---

## 2. Workflow บังคับเมื่อทำงาน UI

### ขั้นที่ 1 — สร้าง Design System (ทำครั้งเดียวตอนเริ่มโปรเจกต์)
ใช้ skill **`ui-ux-pro-max:ui-ux-pro-max`** แล้วรัน (ตรวจก่อนว่ายังไม่มี `design-system/billing-dashboard/MASTER.md`):

```bash
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" "retail POS inventory business dashboard" --design-system --density 8 --variance 3 --motion 2 --persist -p "Billing Dashboard" --output-dir "<project-root>"
```

- `--density 8` = dashboard หนาแน่น, `--variance 3` = เรียบ/มินิมอล, `--motion 2` = micro-interaction เบาๆ เท่านั้น
- ถ้า `python` ไม่เจอ ให้ลอง `py -3` (เครื่องนี้เป็น Windows)
- **ห้ามใช้ `--force`** ทับ MASTER.md เดิมโดยไม่ได้รับอนุญาตจากผู้ใช้

จากนั้นสร้าง page override สำหรับหน้าที่ลักษณะต่างจากหน้าอื่นชัดเจน:

```bash
... --design-system --persist -p "Billing Dashboard" --page "pos" --output-dir "<project-root>"
... --design-system --persist -p "Billing Dashboard" --page "dashboard" --output-dir "<project-root>"
... --design-system --persist -p "Billing Dashboard" --page "invoice-pdf" --output-dir "<project-root>"
```

### ขั้นที่ 2 — แปลงเป็น Tokens
ใช้ skill **`ui-ux-pro-max:design-system`** แปลงผลจาก MASTER.md เป็น token 3 ชั้น (primitive → semantic → component) แล้วใส่เป็น CSS variables ใน `src/app/globals.css` (`@theme` ของ Tailwind v4) ให้ตรงกับชื่อตัวแปรของ shadcn (`--background`, `--foreground`, `--primary`, `--muted`, `--destructive`, `--chart-1..5` ฯลฯ)

### ขั้นที่ 3 — สร้าง Component / หน้า
ใช้ skill **`ui-ux-pro-max:ui-styling`** (shadcn/ui + Tailwind) ในการสร้าง component ทุกครั้ง และก่อนสร้างหน้าใดๆ:
1. อ่าน `design-system/billing-dashboard/MASTER.md`
2. ถ้ามี `design-system/billing-dashboard/pages/<page>.md` ให้ใช้กฎในไฟล์นั้น override MASTER
3. ค้นข้อมูลเฉพาะเรื่องเพิ่มเมื่อจำเป็น เช่น
   - `"data table sort filter" --domain ux`
   - `"sales trend comparison" --domain chart`
   - `"form validation inline" --domain ux`
   - `"server components suspense" --stack nextjs`
   - `"data table dialog combobox" --stack shadcn`

### ขั้นที่ 4 — ตรวจก่อนส่งงาน
เช็กตาม pre-delivery checklist ของ ui-ux-pro-max (`references/pro-rules.md`) — contrast, focus ring, ขนาดปุ่ม, responsive, dark mode, loading/empty/error state

---

## 3. กฎ Design เฉพาะโปรเจกต์นี้ (override ผลจาก skill ถ้าขัดกัน)

### Typography
- ฟอนต์ต้อง **รองรับภาษาไทยได้ดี**: ใช้ `Anuphan` (UI), `Sarabun` (PDF) — โหลดผ่าน `next/font/google`
  - เหตุผล: Anuphan มี vertical metrics สมดุล ตัวอักษรไทยอยู่กึ่งกลางปุ่ม/badge และตัวเลขเป็น tabular โดยค่าเริ่มต้น
  - **ห้ามใช้ IBM Plex Sans Thai / Noto Sans Thai กับ UI** — descent ใหญ่ (~0.5em) ทำให้ข้อความไทยลอยสูงกว่ากึ่งกลางปุ่ม ~2px
  - ห้ามใช้ Prompt กับตัวเลขเงิน — ไม่มี tabular figures (เลข 1 กับ 8 กว้างไม่เท่ากัน)
- ตัวเลขเงิน/จำนวนใช้ `tabular-nums` และจัดชิดขวาในตาราง
- line-height ภาษาไทยต้องมากกว่าอังกฤษ (≥ 1.6 สำหรับ body) เพื่อไม่ให้สระบน/ล่างชนกัน
- body ขั้นต่ำ 14px ในตาราง, 16px ในฟอร์ม

### สีและความหมาย
- ใช้ semantic token เท่านั้น ห้าม hardcode hex ใน component
- สีสถานะคงที่ทั้งระบบ: กำไร/เพิ่มขึ้น = success (เขียว), ขาดทุน/ลดลง = destructive (แดง), ใกล้หมด = warning (เหลือง/ส้ม), บิลยกเลิก = muted + ขีดฆ่า
- **ห้ามสื่อความหมายด้วยสีอย่างเดียว** — ต้องมีไอคอน/ลูกศร/ข้อความประกอบ (เช่น ▲ +12%)

### Format ข้อมูล
- เงิน: `฿1,234.50` (ใช้ `Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' })`)
- วันที่: `13 ต.ค. 2569` หรือ `13/10/2026` ตาม setting; เวลา 24 ชม.
- ตัวเลขใหญ่ใน KPI ย่อได้ เช่น `฿1.2M` แต่ tooltip ต้องแสดงเต็ม

### หน้า POS (`/sales/new`) — สำคัญที่สุด
- **Keyboard-first**: โฟกัสช่องค้นหาสินค้าอัตโนมัติ, Enter = เพิ่ม, ↑↓ = เลือก, `F2` ค้นหา, `F9` ชำระเงิน, `Esc` ปิด dialog — แสดง shortcut hint บนปุ่ม
- Layout 2 คอลัมน์ (desktop): ซ้าย = ค้นหา + ตะกร้า, ขวา = ลูกค้า + สรุปยอด + ปุ่มชำระเงิน (sticky)
- ยอดรวมสุทธิต้องตัวใหญ่ที่สุดในหน้า
- ปุ่มหลักสูง ≥ 44px (ใช้บนแท็บเล็ตทัชได้)
- ไม่มี animation ที่ทำให้ช้าลง; feedback ทันทีเมื่อเพิ่มสินค้า (highlight แถวสั้นๆ)

### Dashboard
- แถว KPI cards ด้านบน (แสดงค่า + % เทียบช่วงก่อน + sparkline)
- กราฟใช้ Recharts ผ่าน shadcn `chart` + สี `--chart-1..5`; ต้องมี tooltip, legend, และ empty state
- กล่อง "ต้องจัดการ" (สินค้าใกล้หมด, ค้างชำระ) วางเห็นได้โดยไม่ต้อง scroll

### ตารางข้อมูล
- ใช้ TanStack Table + shadcn `table`: sticky header, sort, filter, pagination, ค้นหา
- แถวคลิกได้ไปหน้ารายละเอียด, action อยู่ในเมนู `⋯` ท้ายแถว
- บนมือถือแปลงเป็น card list

### Form
- Label มองเห็นเสมอ (ห้ามใช้ placeholder แทน label), error ใต้ช่อง, ปุ่ม submit มี loading state
- การกระทำที่ย้อนไม่ได้ (ยกเลิกบิล, ลบ) ต้องมี confirm dialog ระบุผลกระทบ

### PDF / ใบเสร็จ (`@react-pdf/renderer`)
- ขาว-ดำเป็นหลัก (พิมพ์ขาวดำได้ชัด), โลโก้ร้านมุมซ้ายบน
- A4: หัวกระดาษร้าน / ข้อมูลลูกค้า / ตารางสินค้า / สรุปยอด + จำนวนเงินตัวอักษรไทย / ช่องลงชื่อ
- 80mm: คอลัมน์เดียว, ฟอนต์ใหญ่พอสำหรับเครื่องพิมพ์ความร้อน

### State ที่ทุกหน้าต้องมี
Loading (skeleton) · Empty (อธิบาย + ปุ่ม action ถัดไป เช่น "นำเข้าจาก Excel") · Error (ข้อความภาษาไทยที่เข้าใจได้ + ลองใหม่)

### Accessibility
- Contrast ≥ 4.5:1 ทั้ง light/dark, focus ring มองเห็นชัด, ปุ่มไอคอนต้องมี `aria-label`
- ไอคอนใช้ `lucide-react` (SVG) เท่านั้น ห้ามใช้ emoji เป็นไอคอน
- รองรับ `prefers-reduced-motion`

---

## 4. สิ่งที่ห้ามทำ
- ห้าม gradient/glassmorphism/neon หรือ effect หวือหวาที่ลดความอ่านง่ายของตัวเลข
- ห้ามใส่ข้อมูลจริงของร้าน/ลูกค้าลงใน query ของ search tool
- ห้ามเขียน style แบบ inline หรือสร้าง component ซ้ำกับที่ shadcn มีอยู่แล้ว
