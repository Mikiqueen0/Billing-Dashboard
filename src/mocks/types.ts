export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  categoryId: string;
  unit: string;
  costPrice: number;
  sellPrice: number;
  stockQty: number;
  reorderPoint: number;
  isActive: boolean;
};

export type Customer = {
  id: string;
  code: string;
  name: string;
  phone: string;
  address: string;
  creditLimit: number;
  outstandingBalance: number;
  lastPurchaseAt: string | null;
};

export type PaymentMethod = "cash" | "transfer" | "card" | "credit";

export type SaleStatus = "completed" | "void";

export type SaleItem = {
  id: string;
  productId: string;
  productName: string;
  unit: string;
  qty: number;
  unitPrice: number;
  unitCost: number;
  discount: number;
  lineTotal: number;
};

export type Sale = {
  id: string;
  billNo: string;
  customerId: string | null;
  soldAt: string;
  status: SaleStatus;
  items: SaleItem[];
  subtotal: number;
  discountTotal: number;
  vatAmount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paidAmount: number;
  note: string | null;
  soldBy: string;
};
