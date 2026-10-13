import { PosWorkspace } from "@/components/sales/pos-workspace";
import { PageHeader } from "@/components/layout/page-header";

export default function NewSalePage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="เปิดบิลขาย"
        description="ค้นหาสินค้า เพิ่มลงตะกร้า แล้วเลือกวิธีชำระเงิน"
      />
      <PosWorkspace />
    </div>
  );
}
