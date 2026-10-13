import type { Customer } from "./types";

export const customers: Customer[] = [
  { id: "c-000", code: "W-000", name: "ลูกค้าทั่วไป", phone: "-", address: "-", creditLimit: 0, outstandingBalance: 0, lastPurchaseAt: null },
  { id: "c-001", code: "C-001", name: "ร้านช่างสมบัติ", phone: "081-234-5678", address: "45/2 ถ.สุขุมวิท ต.บางนา กรุงเทพฯ", creditLimit: 50000, outstandingBalance: 18500, lastPurchaseAt: "2026-10-10T14:20:00+07:00" },
  { id: "c-002", code: "C-002", name: "บจก. วัสดุก่อสร้างไทยรุ่งเรือง", phone: "02-345-6789", address: "99 ถ.พระราม 2 กรุงเทพฯ", creditLimit: 200000, outstandingBalance: 142000, lastPurchaseAt: "2026-10-11T09:05:00+07:00" },
  { id: "c-003", code: "C-003", name: "คุณสมหญิง ใจดี", phone: "089-111-2222", address: "12 ม.3 ต.คลองหลวง อ.คลองหลวง ปทุมธานี", creditLimit: 10000, outstandingBalance: 0, lastPurchaseAt: "2026-10-09T11:40:00+07:00" },
  { id: "c-004", code: "C-004", name: "ช่างแดง รับเหมาก่อสร้าง", phone: "086-555-7890", address: "8 ถ.เทพารักษ์ สมุทรปราการ", creditLimit: 30000, outstandingBalance: 31500, lastPurchaseAt: "2026-09-28T16:10:00+07:00" },
  { id: "c-005", code: "C-005", name: "หจก. เอ.พี. โฮมมาร์ท", phone: "02-888-1234", address: "77 ถ.บางนา-ตราด กม.5", creditLimit: 100000, outstandingBalance: 0, lastPurchaseAt: "2026-10-05T10:00:00+07:00" },
];
