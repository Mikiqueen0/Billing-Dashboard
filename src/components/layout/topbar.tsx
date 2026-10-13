"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Plus, Search, Settings, LogOut, User } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Topbar() {
  const pathname = usePathname();
  const onPosPage = pathname.startsWith("/sales/new");

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3 sm:px-4">
      <SidebarTrigger aria-label="เปิด/ปิดแถบเมนู" />

      <div className="relative hidden flex-1 max-w-md sm:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ค้นหาสินค้า, ลูกค้า, เลขบิล..."
          className="pl-8"
          aria-label="ค้นหาทั่วระบบ"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {!onPosPage && (
          <Button asChild size="sm" className="h-9">
            <Link href="/sales/new">
              <Plus className="size-4" />
              <span className="hidden sm:inline">เปิดบิลใหม่</span>
            </Link>
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="relative size-9"
          aria-label="การแจ้งเตือน"
        >
          <Bell className="size-4" />
          <Badge className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full p-0 text-[10px] bg-destructive text-destructive-foreground">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full"
              aria-label="เมนูผู้ใช้"
            >
              <Avatar className="size-8">
                <AvatarFallback>จอ</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">เจ้าของร้าน</span>
                <span className="text-xs text-muted-foreground">
                  owner@mockshop.test
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="size-4" />
              โปรไฟล์
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="size-4" />
              ตั้งค่าร้าน
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut className="size-4" />
              ออกจากระบบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
