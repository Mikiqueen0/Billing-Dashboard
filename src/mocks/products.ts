import type { Category, Product } from "./types";

export const categories: Category[] = [
  { id: "cat-tool", name: "เครื่องมือ" },
  { id: "cat-paint", name: "สีและเคมีภัณฑ์" },
  { id: "cat-pipe", name: "ท่อและประปา" },
  { id: "cat-electric", name: "ไฟฟ้า" },
  { id: "cat-cement", name: "ปูนและซีเมนต์" },
  { id: "cat-hardware", name: "อุปกรณ์ก่อสร้างทั่วไป" },
];

export const products: Product[] = [
  { id: "p-001", sku: "TL-0001", barcode: "8850001000011", name: "ค้อนหงอนเหล็ก 16 oz", categoryId: "cat-tool", unit: "ชิ้น", costPrice: 95, sellPrice: 150, stockQty: 42, reorderPoint: 10, isActive: true },
  { id: "p-002", sku: "TL-0002", barcode: "8850001000028", name: "ไขควงลองไฟ 4 นิ้ว", categoryId: "cat-tool", unit: "ชิ้น", costPrice: 25, sellPrice: 45, stockQty: 8, reorderPoint: 15, isActive: true },
  { id: "p-003", sku: "TL-0003", barcode: "8850001000035", name: "ตลับเมตร 5 เมตร", categoryId: "cat-tool", unit: "ชิ้น", costPrice: 55, sellPrice: 90, stockQty: 23, reorderPoint: 10, isActive: true },
  { id: "p-004", sku: "TL-0004", barcode: "8850001000042", name: "สว่านไฟฟ้า 10mm", categoryId: "cat-tool", unit: "ชิ้น", costPrice: 650, sellPrice: 990, stockQty: 4, reorderPoint: 5, isActive: true },
  { id: "p-005", sku: "PT-0001", barcode: "8850002000012", name: "สีทาภายนอก TOA 5 แกลลอน", categoryId: "cat-paint", unit: "ถัง", costPrice: 1450, sellPrice: 1890, stockQty: 14, reorderPoint: 8, isActive: true },
  { id: "p-006", sku: "PT-0002", barcode: "8850002000029", name: "ทินเนอร์ 1 ลิตร", categoryId: "cat-paint", unit: "ขวด", costPrice: 55, sellPrice: 50, stockQty: 30, reorderPoint: 10, isActive: true },
  { id: "p-007", sku: "PT-0003", barcode: "8850002000036", name: "แปรงทาสี 3 นิ้ว", categoryId: "cat-paint", unit: "ชิ้น", costPrice: 20, sellPrice: 40, stockQty: 60, reorderPoint: 20, isActive: true },
  { id: "p-008", sku: "PP-0001", barcode: "8850003000013", name: "ท่อ PVC 4 หุน ยาว 4 เมตร", categoryId: "cat-pipe", unit: "ท่อน", costPrice: 65, sellPrice: 95, stockQty: 120, reorderPoint: 40, isActive: true },
  { id: "p-009", sku: "PP-0002", barcode: "8850003000020", name: "ข้องอ PVC 1 นิ้ว", categoryId: "cat-pipe", unit: "ชิ้น", costPrice: 8, sellPrice: 15, stockQty: 200, reorderPoint: 50, isActive: true },
  { id: "p-010", sku: "PP-0003", barcode: "8850003000037", name: "ก๊อกสนามทองเหลือง", categoryId: "cat-pipe", unit: "ชิ้น", costPrice: 85, sellPrice: 140, stockQty: 4, reorderPoint: 10, isActive: true },
  { id: "p-011", sku: "EL-0001", barcode: "8850004000014", name: "สายไฟ VAF 2x1.5 (ม้วน 100m)", categoryId: "cat-electric", unit: "ม้วน", costPrice: 980, sellPrice: 1250, stockQty: 11, reorderPoint: 5, isActive: true },
  { id: "p-012", sku: "EL-0002", barcode: "8850004000021", name: "ปลั๊กไฟ 3 ตา มีสวิตช์", categoryId: "cat-electric", unit: "ชิ้น", costPrice: 65, sellPrice: 120, stockQty: 35, reorderPoint: 15, isActive: true },
  { id: "p-013", sku: "EL-0003", barcode: "8850004000038", name: "หลอด LED 9W แสงขาว", categoryId: "cat-electric", unit: "หลอด", costPrice: 35, sellPrice: 65, stockQty: 72, reorderPoint: 20, isActive: true },
  { id: "p-014", sku: "CM-0001", barcode: "8850005000015", name: "ปูนซีเมนต์ตราเสือ 50 กก.", categoryId: "cat-cement", unit: "ถุง", costPrice: 135, sellPrice: 165, stockQty: 85, reorderPoint: 30, isActive: true },
  { id: "p-015", sku: "CM-0002", barcode: "8850005000022", name: "ปูนกาวซีเมนต์ 20 กก.", categoryId: "cat-cement", unit: "ถุง", costPrice: 180, sellPrice: 230, stockQty: 3, reorderPoint: 15, isActive: true },
  { id: "p-016", sku: "HW-0001", barcode: "8850006000016", name: "ลวดผูกเหล็ก เบอร์ 18", categoryId: "cat-hardware", unit: "กก.", costPrice: 45, sellPrice: 60, stockQty: 48, reorderPoint: 20, isActive: true },
  { id: "p-017", sku: "HW-0002", barcode: "8850006000023", name: "ตะปูเกลียวปูน 2 นิ้ว (กล่อง)", categoryId: "cat-hardware", unit: "กล่อง", costPrice: 38, sellPrice: 55, stockQty: 26, reorderPoint: 15, isActive: true },
  { id: "p-018", sku: "HW-0003", barcode: "8850006000030", name: "ตาข่ายกรงไก่ 1 นิ้ว", categoryId: "cat-hardware", unit: "ม้วน", costPrice: 420, sellPrice: 580, stockQty: 9, reorderPoint: 8, isActive: true },
  { id: "p-019", sku: "HW-0004", barcode: "8850006000047", name: "ถุงมือผ้าเคลือบยาง", categoryId: "cat-hardware", unit: "คู่", costPrice: 12, sellPrice: 20, stockQty: 150, reorderPoint: 40, isActive: true },
  { id: "p-020", sku: "TL-0005", barcode: "8850001000059", name: "เลื่อยลันดา 20 นิ้ว", categoryId: "cat-tool", unit: "ชิ้น", costPrice: 110, sellPrice: 95, stockQty: 17, reorderPoint: 10, isActive: true },
];
