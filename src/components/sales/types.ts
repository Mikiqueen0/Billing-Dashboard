export type CartLine = {
  lineId: string;
  productId: string;
  name: string;
  unit: string;
  sku: string;
  qty: number;
  unitPrice: number;
  unitCost: number;
  discount: number;
  stockQty: number;
};

export type PosPaymentMethod = "cash" | "transfer" | "card" | "credit";
