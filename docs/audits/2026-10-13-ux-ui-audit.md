# Billing Dashboard (UI mock) — UX/UI Audit

**Scope:** `/dashboard`, `/sales/new` (POS), `/sales/[id]` (s-0007) · ไม่มี login (mock) · viewport 1440×900 และ 375×812 · 13 ต.ค. 2026
**มาตรฐานที่ใช้ตัดสิน:** `docs/UI-DESIGN.md` + `design-system/billing-dashboard/` (house rules มาก่อน) → WCAG 2.2 AA → Nielsen heuristics
**วิธี:** probe-routes / core / heuristics / perception / focus + screenshot pass + reading pass + ตรวจย้อนไปที่ `src/mocks/*` และ source

> หมายเหตุสภาพแวดล้อม: บนเครื่องนี้ `localhost:3000` (IPv6 `[::1]`) ถูกโปรเซสอื่น (PID 47372) จับไว้ ต้องเข้าแอปผ่าน `http://127.0.0.1:3000`
> และ Next 16 บล็อก HMR/hydration จาก origin นั้น — ระหว่าง audit ได้ใส่ `allowedDevOrigins: ["127.0.0.1"]` ชั่วคราวแล้วถอดออก
> ผลที่วัดก่อน hydrate (กราฟว่าง, คลิกแท็บไม่ติด) ถูกตัดทิ้งทั้งหมด ไม่นับเป็น finding

## Summary

| Severity | จำนวน |
|---|---|
| Critical | 2 |
| Major | 9 |
| Accessibility | 4 |
| Note | 5 |

พื้นฐานแข็งแรง: ฟอนต์ไทยถูกต้อง, contrast ผ่านเกือบทั้งหมด (POS และหน้าบิล 0 failures), เลขในบิลถูกทุกตัว, dialog ยกเลิกบิลทำถูกหลัก
ปัญหาหลักอยู่ที่ **หน้า POS** (flow คีย์บอร์ดและมือถือ) และ **ตัวเลข mock บน Dashboard ที่ขัดกันเอง**

---

## Findings

### 01 · Critical · `/sales/new`
**กด Enter ซ้ำหลังเพิ่มสินค้า จะเพิ่ม "สินค้าตัวแรกของแคตตาล็อก" ที่ไม่ได้ค้นหาลงบิล**
หลังเพิ่มสินค้า ช่องค้นหาถูกล้างและ highlight กลับไปที่รายการแรกของสินค้าทั้งหมด การกด Enter อีกครั้ง (นิสัยพนักงาน หรือเครื่องสแกนบาร์โค้ดที่ส่ง Enter ตามหลัง) จะใส่สินค้าผิดลงบิลโดยไม่รู้ตัว
```
พิมพ์ "ปูน" → Enter → Enter
ตะกร้า:  ปูนซีเมนต์ตราเสือ 50 กก.  ฿165.00
         ค้อนหงอนเหล็ก 16 oz       ฿150.00   ← ไม่ได้ค้นหา
```
**FIX:** เมื่อ query ว่าง อย่าให้ Enter เลือกรายการ (ไม่ highlight อะไร / ซ่อนรายการ) หรือให้ Enter ซ้ำบนสินค้าเดิม = +1 จำนวนของบรรทัดล่าสุด

### 02 · Critical · `/sales/new` @ 375px
**บนมือถือ เนื้อหา POS กว้าง 459px ในจอ 375px และถูกเลื่อนจนหัวข้อขาด**
`overflow-x-hidden` ซ่อน scrollbar แต่ container ถูก scroll ไปด้านข้าง (น่าจะจาก autoFocus/scrollIntoView) ทำให้หัวข้อหน้าและขอบซ้ายของรายการสินค้าถูกตัด และผู้ใช้เลื่อนกลับไม่ได้
```
main.flex-1.overflow-x-hidden  scrollLeft=46  scrollWidth=459  clientWidth=375
H1 "เปิดบิลขาย"  left = -34px
grid "grid gap-4 lg:grid-cols-[1fr_380px]"  → คอลัมน์เดียวกว้าง 447px (min-content ของแถวสินค้า)
```
**FIX:** `grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px]` และใส่ `min-w-0` ให้แถวสินค้า (ชื่อ `truncate` ได้จริง)

### 03 · Major · `/sales/new`
**คีย์ลัด F2 (โฟกัสช่องค้นหา) และ Esc (ล้างคำค้น) ไม่ทำงาน**
`CommandInput` ของ cmdk เขียนทับ prop `id` ทำให้ `getElementById("pos-product-search-input")` คืน `null` — ขัดกับ house rule "Keyboard-first" ทั้งที่ placeholder โฆษณา "(F2)"
```
document.getElementById('pos-product-search-input')  → null
input จริง: id="radix-_R_b9bn5ritqkndlbH2_"
กด F2 2 ครั้ง → activeElement = BODY ทั้ง 2 ครั้ง   (F9 ทำงานปกติ = handler ไม่ได้เสีย)
```
**FIX:** ใช้ `ref` ส่งเข้า `CommandInput` แล้ว `ref.current.focus()` แทนการหา id (`pos-workspace.tsx:28`, `:34`)

### 04 · Major · `/sales/new`
**ปุ่ม "ชำระเงิน" disabled โดยไม่บอกเหตุผล**
ตะกร้ามี ฿315 เลือกเงินสดแล้ว แต่ปุ่มกดไม่ได้จนกว่าจะกรอก "รับเงินมา" — ไม่มีข้อความบอก, F9 เงียบ
```
#pos-pay-button  disabled=true  aria-describedby=null  title=""
```
**FIX:** ตั้งค่า "รับเงินมา" = ยอดที่ต้องชำระเป็นค่าเริ่มต้น + ปุ่มลัด (พอดี / ฿500 / ฿1000) หรือแสดงข้อความ "กรอกจำนวนเงินที่รับ" ใต้ปุ่ม

### 05 · Major · `/sales/new` (desktop)
**ตะกร้าถูกดันลงไปขอบล่างจอ — เห็นได้แค่ ~2 บรรทัด**
รายการสินค้า (สูง 360px) เปิดค้างตลอด ทำให้ตะกร้าซึ่ง house rule กำหนดให้อยู่ "ซ้าย = ค้นหา + ตะกร้า" เริ่มที่ 794px จากจอ 900px บรรทัดที่ 3 ขึ้นไปต้อง scroll
```
cmdk-list top=185 height=360 · แถวแรกของตะกร้า top=794 · viewport 900
```
**FIX:** แสดงผลค้นหาเป็น popover ใต้ช่องค้นหาเฉพาะตอนพิมพ์ แล้วให้ตะกร้าอยู่ใต้ช่องค้นหาทันที

### 06 · Major · `/dashboard`
**ยอดค้างชำระเพิ่มขึ้น 15.9% แต่แสดงเป็นสีเขียว ↑ เหมือนเป็นข่าวดี**
`kpi-card.tsx` ใช้ `isUp ? success : destructive` กับทุก KPI — หนี้ลูกค้าที่โตขึ้นคือสัญญาณเสี่ยง
```
ยอดค้างชำระ  ฿192K  ↑ +15.9% (text-success, sparkline สีเขียว)
```
**FIX:** เพิ่ม `goodDirection: "up" | "down"` ใน `KpiDatum` (receivable = down) — ทำนองเดียวกับ "มูลค่าสต็อก" ที่อาจตีความได้ทั้งสองทาง

### 07 · Major · `/dashboard`
**ตัวกรองช่วงเวลาไม่มีผลกับข้อมูล — เลือก "วันนี้" แต่ยังโชว์ยอดทั้งเดือน**
`TimeRangeFilter` เก็บ state ไว้ในตัวเอง ไม่มี component ไหนอ่าน
```
แท็บที่ active: "วันนี้"  →  ยอดขาย ฿284.5K (เท่าเดิม)
mock dailySales 2026-10-13 = ฿20,600
```
**FIX:** ยก state ขึ้นไปที่ page (หรือ `?range=` ใน URL) แล้วส่งให้ KPI/กราฟ — ถ้ายังไม่ทำ ให้ disable แท็บอื่นไว้ก่อน เพื่อไม่ให้ demo ผิด

### 08 · Major · `/dashboard` (data layer)
**ตัวเลขบน Dashboard ขัดกันเอง — ผลรวมย่อยมากกว่ายอดรวม**
ทุก widget อ่าน mock คนละชุดใน `src/mocks/dashboard.ts` ที่ไม่ได้คำนวณจากแหล่งเดียวกัน
```
KPI ยอดขาย (เดือนนี้)                        ฿284,500
ลูกค้าซื้อเยอะสุด Top 5 (รวม)               ฿352,900   > ยอดขายทั้งร้าน
ยอดขายตามหมวดหมู่ (รวม 6 หมวด)              ฿361,800
dailySales 1–13 ต.ค. (รวม)                  ฿306,300
สัดส่วนวิธีชำระเงิน (รวม)                    ฿284,500   ✓ ตรง
```
และ "สว่านไฟฟ้า 10mm" ถูกระบุใน **สินค้าไม่เคลื่อนไหว: "ยังไม่มีการขาย"** (คำนวณจาก `mocks/sales.ts` 7 บิล) แต่ก็อยู่ใน **สินค้าขายดีตามกำไร: ฿8,500** (จาก `mocks/dashboard.ts`)
**FIX:** สร้าง mock ธุรกรรมชุดเดียว แล้ว derive ทุก widget จากชุดนั้น (เป็น shape เดียวกับ query จริงในเฟส 3 ด้วย)

### 09 · Major · `/sales/[id]`
**ใน dialog ยกเลิกบิล ปุ่ม "ไม่ทำ" ใช้คำว่า "ยกเลิก" — คำเดียวกับการกระทำอันตราย**
```
ยืนยันยกเลิกบิล INV-26100007?
[ ยกเลิก ]  [ ยืนยันยกเลิกบิล ]
```
ผู้ใช้ที่อ่านเร็วอาจกด "ยกเลิก" เพราะคิดว่าคือการยกเลิกบิล
**FIX:** เปลี่ยนเป็น "กลับ" / "เก็บบิลไว้"

### 10 · Major · `/dashboard`
**Heatmap ดูค่าได้เฉพาะ hover, ขนาดช่องไม่เท่ากัน และกินพื้นที่ 72% ของจอ**
ค่าอยู่ใน `title` เท่านั้น — คีย์บอร์ดและจอสัมผัส (แท็บเล็ตหน้าร้าน) เข้าถึงไม่ได้ ข้อความ "ชี้ที่ช่องเพื่อดูค่า" จึงใช้ไม่ได้บนแท็บเล็ต ช่องชั่วโมง 8–9 แคบกว่าช่องอื่นครึ่งหนึ่งเพราะ `aspect-square` ใน table auto layout
```
cell widths: [42,42,84,84,84,84,84,84,84,84,84,84,85] px
focusable cells: 0 / 91        table height: 648px (viewport 900)
```
**FIX:** `table-fixed` + ความสูงคงที่ (~28px), ใส่ค่า/ไฮไลต์ช่วง peak เป็นข้อความสรุป ("ขายดีสุด: ศ.–ส. 16:00") หรือใช้ tooltip ที่ focus ได้

### 11 · Major · ทุกหน้า @ < 768px
**Hydration mismatch ทุกครั้งที่เปิดบนมือถือ**
`useIsMobile` อ่าน `window.innerWidth` ใน `useState` initializer → server render sidebar desktop, client render แบบ mobile → React ทิ้ง tree แล้ว render ใหม่ทั้งหน้า (ช้าลง, autoFocus/scroll เพี้ยน — น่าจะเป็นต้นเหตุร่วมของ #02)
```
Hydration failed ... at SidebarInset (src/components/ui/sidebar.tsx:306)
src/hooks/use-mobile.ts: useState(() => typeof window !== "undefined" && window.innerWidth < 768)
```
**FIX:** คืนเป็นแบบ shadcn เดิม: `useState<boolean | undefined>(undefined)` แล้วตั้งค่าใน `useEffect`

### 12 · Accessibility · `/dashboard` — SC 1.4.3
**ข้อความแท็บที่ไม่ได้เลือก contrast 3.25:1** (ต้อง 4.5:1 สำหรับ 14px/500)
```
"วันนี้" "7 วัน" "กำหนดเอง" "ตามกำไร"  color: foreground @ 60% on #E9EEF6 → 3.25:1
```
**FIX:** ใช้ `text-muted-foreground` (#475569) แทน opacity 60%

### 13 · Accessibility · `/sales/new` — SC 1.4.11
**ขอบช่องกรอก contrast 1.22:1** (ต้อง 3:1)
```
#received-amount  border rgb(219,234,254) (#DBEAFE) on card #FFFFFF → 1.22:1
```
**FIX:** แยก `--input` ออกจาก `--border` เช่น `--input: #64748B` (≈ 4.76:1 บนขาว) — ระวัง `#94A3B8` ยังได้แค่ ≈ 2.57:1 ไม่ผ่าน

### 14 · Accessibility · `/sales/new` — SC 4.1.2
**ช่องค้นหาสินค้าไม่มีชื่อที่ screen reader อ่านได้**
cmdk สร้าง `<label cmdk-label>` ว่างและผูกด้วย `aria-labelledby` → probe คำนวณชื่อได้ `""` (บาง browser อาจ fallback ไปใช้ placeholder แต่ไม่ควรพึ่ง)
**FIX:** ส่ง `label="ค้นหาสินค้า"` ให้ `<Command>`

### 15 · Accessibility · ทุกหน้า — landmark
**มี `<main>` ซ้อนกัน 2 ชั้น**
`SidebarInset` เป็น `<main>` อยู่แล้ว และ `(app)/layout.tsx` ใส่ `<main>` ซ้ำข้างใน (`main=2` ทุกหน้า)
**FIX:** เปลี่ยน `<main>` ใน `layout.tsx` เป็น `<div>`

### 16 · Note · `/dashboard` @ 375px
"เทียบช่วงก่อน" ใน KPI card ถูกบีบเหลือ 3 บรรทัด (เทียบ / ช่วง / ก่อน) โดย sparkline — ซ่อน sparkline หรือย้ายลงบรรทัดใหม่บนจอแคบ

### 17 · Note · `/dashboard`
กล่อง "ต้องจัดการ" แสดง 4 รายการจาก badge 8 (สินค้าไม่เคลื่อนไหว) และรายการคลิกไม่ได้ — ไม่มีทางไปดูที่เหลือ เพิ่มลิงก์ "ดูทั้งหมด" ไป `/inventory?filter=...` เมื่อหน้านั้นพร้อม

### 18 · Note · `/sales/[id]`
Toast "บันทึกบิลสำเร็จ" (มุมขวาบน) ทับปุ่ม พิมพ์ / ดาวน์โหลด PDF / เปิดบิลใหม่ ราว 4 วินาที — ซึ่งเป็น action ถัดไปที่ใช้บ่อยที่สุดหลังขาย ย้าย toast เป็น `bottom-right` หรือ `top-center`

### 19 · Note · `/sales/new`
ปุ่มที่ดูเป็น primary พร้อมกัน 5 ปุ่ม (`เปิดบิล` sidebar, `เปิดบิลใหม่` header, `เงินสด`, `ชำระเงิน`, `พักบิล`) — ซ่อนปุ่ม "เปิดบิลใหม่" ใน header เมื่ออยู่หน้า POS อยู่แล้ว

### 20 · Note · Mobile bottom nav
2 ใน 4 ปลายทางหลัก (สต็อก, รายงาน) เป็น `aria-disabled` — บนเดสก์ท็อปมี badge "เร็วๆนี้" แต่บนมือถือเป็นแค่สีเทา ใส่ badge เดียวกัน หรือเปลี่ยนเป็นเมนูที่ใช้ได้จริงในช่วง mock

---

## What works

- **ฟอนต์ไทยถูกต้อง** — MASTER.md แนะนำ Fira Code/Fira Sans (ไม่มีอักษรไทย) แต่โค้ด override เป็น IBM Plex Sans Thai ตาม house rule: 1 font family ครอบ 351 text nodes, `lang="th"`
- **Contrast** — Dashboard 141 text nodes ผ่าน 137 (ตกแค่แท็บ #12), POS และหน้าบิล **0 failures**
- **ระบบ type/spacing สม่ำเสมอ** — 8 ขนาดตัวอักษร, 3 น้ำหนัก, 10 ค่า spacing
- **Focus ring มองเห็นได้** — ปุ่มมี border `#1E40AF` 8.35:1 + ring 3px (probe รายงาน FAIL เพราะตัด box-shadow — ตรวจด้วยตาและ computed style แล้ว ผ่าน)
- **Dialog ยกเลิกบิล** — `role=alertdialog`, อธิบายผลกระทบครบ (คืนสต็อก 3 รายการ, ไม่ลบข้อมูล, ย้อนไม่ได้), focus เริ่มที่ปุ่มปลอดภัย
- **ตัวเลขที่ควรตรงกันตรงจริง** — อัตรากำไร 71.3/284.5 = 25.06% ✓, ยอดเฉลี่ย 284,500/186 = 1,529.6 ✓, วิธีชำระเงินรวม ฿284,500 ✓, เงินทอน 500−315 = 185 ✓, บิล 950−50 = 900 และ 1,550−50 = 1,500 ✓, จำนวนเงินตัวอักษรไทย
- **ปุ่มในตะกร้ามีชื่อเฉพาะรายการ** — เช่น `aria-label="ลบ {ชื่อสินค้า} ออกจากตะกร้า"`, ไม่มี control ไร้ชื่อเลย
- **F9 ชำระเงินทำงาน**, route 2/2 ตอบ 200, ไม่มี long task > 50ms

## Where to start (impact ÷ effort)

1. **#03** F2/Esc — เปลี่ยน id เป็น ref (~5 บรรทัด)
2. **#11** use-mobile — คืนค่าเริ่มต้นเป็น `undefined` (1 บรรทัด) แล้วตรวจ #02 ซ้ำ
3. **#02** POS mobile overflow — `minmax(0,1fr)` + `min-w-0`
4. **#01** Enter บน query ว่าง — guard ใน `onSelect`
5. **#09, #12, #14, #15** — แก้คำ/คลาส/prop จุดเดียวต่อข้อ
6. **#06** ทิศทาง "ดี" ของ KPI — เพิ่ม field เดียว
7. **#04** ค่าเริ่มต้น "รับเงินมา" + ปุ่มลัดจำนวนเงิน
8. **#13** token `--input`
9. **#08 + #07** รวม mock เป็นชุดเดียวแล้วต่อ filter — งานใหญ่สุด แต่เป็นโครงเดียวกับ query จริงในเฟส 3
10. **#05, #10** ปรับ layout POS และ heatmap
