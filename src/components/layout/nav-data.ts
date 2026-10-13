import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Receipt,
  History,
  PackagePlus,
  Boxes,
  Package,
  Users,
  Truck,
  Tags,
  BarChart3,
  FileSpreadsheet,
  Settings,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "ภาพรวม",
    items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "ขาย",
    items: [
      { title: "เปิดบิล", url: "/sales/new", icon: Receipt },
      { title: "ประวัติบิล", url: "/sales", icon: History, comingSoon: true },
    ],
  },
  {
    label: "ซื้อ / สต็อก",
    items: [
      { title: "รับสินค้าเข้า", url: "/purchases/new", icon: PackagePlus, comingSoon: true },
      { title: "สต็อกคงเหลือ", url: "/inventory", icon: Boxes, comingSoon: true },
    ],
  },
  {
    label: "ข้อมูลหลัก",
    items: [
      { title: "สินค้า", url: "/products", icon: Package, comingSoon: true },
      { title: "ลูกค้า", url: "/customers", icon: Users, comingSoon: true },
      { title: "ผู้ขาย", url: "/suppliers", icon: Truck, comingSoon: true },
      { title: "โปรโมชั่น", url: "/promotions", icon: Tags, comingSoon: true },
    ],
  },
  {
    label: "รายงาน / เครื่องมือ",
    items: [
      { title: "รายงาน", url: "/reports", icon: BarChart3, comingSoon: true },
      { title: "นำเข้า Excel", url: "/import", icon: FileSpreadsheet, comingSoon: true },
      { title: "ตั้งค่า", url: "/settings", icon: Settings, comingSoon: true },
    ],
  },
];

export const mobilePrimaryNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "เปิดบิล", url: "/sales/new", icon: Receipt },
  { title: "สต็อก", url: "/inventory", icon: Boxes, comingSoon: true },
  { title: "รายงาน", url: "/reports", icon: BarChart3, comingSoon: true },
];
