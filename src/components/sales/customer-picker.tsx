"use client";

import { useState } from "react";
import { ChevronsUpDown, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { customers } from "@/mocks/customers";
import { cn } from "@/lib/utils";

const WALK_IN_CODE = "W-000";

export function CustomerPicker({
  customerId,
  onChange,
}: {
  customerId: string;
  onChange: (customerId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const selected = customers.find((c) => c.id === customerId);

  return (
    <div className="flex items-center gap-2">
      {/* Combobox, not <Select>: always opens below the field (Select's item-aligned
          mode jumps to the chosen row) and stays usable with hundreds of customers. */}
      <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={pickerOpen}
            aria-label="เลือกลูกค้า"
            className="h-10 flex-1 justify-between px-3 font-normal"
          >
            <span className="truncate">
              {selected ? selected.name : "เลือกลูกค้า"}
              {selected && selected.code !== WALK_IN_CODE && (
                <span className="ml-1.5 text-muted-foreground">{selected.code}</span>
              )}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          className="w-(--radix-popover-trigger-width) min-w-72 p-0"
        >
          <Command
            label="ค้นหาลูกค้า"
            filter={(value, search) => {
              const c = customers.find((x) => x.id === value);
              if (!c) return 0;
              const q = search.trim().toLowerCase();
              return [c.name, c.code, c.phone].some((f) => f.toLowerCase().includes(q)) ? 1 : 0;
            }}
          >
            <CommandInput placeholder="ค้นหาชื่อ, รหัส หรือเบอร์โทร..." />
            <CommandList className="max-h-72">
              <CommandEmpty>ไม่พบลูกค้า</CommandEmpty>
              <CommandGroup>
                {customers.map((c) => (
                  <CommandItem
                    key={c.id}
                    value={c.id}
                    data-checked={c.id === customerId}
                    onSelect={() => {
                      onChange(c.id);
                      setPickerOpen(false);
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className={cn("truncate", c.id === customerId && "font-medium")}>
                        {c.name}
                      </p>
                      {c.code !== WALK_IN_CODE && (
                        <p className="truncate text-xs text-muted-foreground">
                          {c.code} · {c.phone}
                        </p>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 shrink-0"
            aria-label="เพิ่มลูกค้าใหม่"
          >
            <UserPlus className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("เพิ่มลูกค้าใหม่แล้ว (ตัวอย่าง UI — ยังไม่เชื่อมข้อมูลจริง)");
              setOpen(false);
            }}
          >
            <DialogHeader>
              <DialogTitle>เพิ่มลูกค้าใหม่</DialogTitle>
              <DialogDescription>
                กรอกข้อมูลลูกค้าเพื่อเพิ่มเข้าระบบอย่างรวดเร็ว
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="customer-name">ชื่อลูกค้า</Label>
                <Input id="customer-name" required placeholder="เช่น ร้านช่างสมบัติ" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customer-phone">เบอร์โทร</Label>
                <Input id="customer-phone" placeholder="08x-xxx-xxxx" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  ยกเลิก
                </Button>
              </DialogClose>
              <Button type="submit">บันทึก</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
