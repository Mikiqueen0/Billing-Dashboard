"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { mobilePrimaryNav } from "./nav-data";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  return (
    <nav
      aria-label="เมนูหลัก"
      className="fixed inset-x-0 bottom-0 z-20 flex h-14 items-stretch border-t bg-background md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {mobilePrimaryNav.map((item) => {
        const isActive = pathname.startsWith(item.url);
        return (
          <Link
            key={item.title}
            href={item.comingSoon ? "#" : item.url}
            aria-disabled={item.comingSoon}
            onClick={(e) => {
              if (item.comingSoon) e.preventDefault();
            }}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px]",
              isActive ? "text-primary" : "text-muted-foreground",
              item.comingSoon && "opacity-50",
            )}
          >
            <item.icon className="size-5" />
            {item.title}
            {item.comingSoon && (
              <span className="text-[9px] leading-none text-muted-foreground">
                เร็วๆนี้
              </span>
            )}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={toggleSidebar}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] text-muted-foreground"
        aria-label="เมนูทั้งหมด"
      >
        <Menu className="size-5" />
        เมนู
      </button>
    </nav>
  );
}
