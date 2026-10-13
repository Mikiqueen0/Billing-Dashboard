"use client";

import { Ban, Download, Printer } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Sale } from "@/mocks/types";

export function SaleActions({ sale }: { sale: Sale }) {
  const isVoid = sale.status === "void";

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          toast.info("พิมพ์ใบเสร็จ — เร็วๆ นี้", {
            description: "ฟีเจอร์ PDF จะเชื่อมต่อในเฟสถัดไป",
          })
        }
      >
        <Printer className="size-4" />
        {isVoid ? "พิมพ์สำเนา" : "พิมพ์"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          toast.info("ดาวน์โหลด PDF — เร็วๆ นี้", {
            description: "ฟีเจอร์ PDF จะเชื่อมต่อในเฟสถัดไป",
          })
        }
      >
        <Download className="size-4" />
        ดาวน์โหลด PDF
      </Button>

      {!isVoid && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="outline" className="text-destructive hover:text-destructive">
              <Ban className="size-4" />
              ยกเลิกบิล
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ยืนยันยกเลิกบิล {sale.billNo}?</AlertDialogTitle>
              <AlertDialogDescription>
                ระบบจะคืนสต็อกสินค้าทั้ง {sale.items.length} รายการกลับเข้าคลัง
                และเปลี่ยนสถานะบิลเป็น &quot;ยกเลิกแล้ว&quot; ข้อมูลจะไม่ถูกลบออกจากระบบ
                และไม่สามารถย้อนกลับการยกเลิกนี้ได้
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>เก็บบิลไว้</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() =>
                  toast.success("ยกเลิกบิลแล้ว (ตัวอย่าง UI — ยังไม่เชื่อมข้อมูลจริง)")
                }
              >
                ยืนยันยกเลิกบิล
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
