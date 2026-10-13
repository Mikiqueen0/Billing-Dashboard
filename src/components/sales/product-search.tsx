"use client";

import type { Ref } from "react";
import { PackageX, Search } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { formatMoney } from "@/lib/money";
import { categories, products } from "@/mocks/products";
import { cn } from "@/lib/utils";

// name | stock | price — shared by the header row and every result so columns line up.
const ROW_GRID = "grid grid-cols-[minmax(0,1fr)_9rem_6.5rem] items-center gap-4";

function categoryName(id: string) {
  return categories.find((c) => c.id === id)?.name ?? "";
}

export function ProductSearch({
  query,
  onQueryChange,
  onSelectProduct,
  inputRef,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSelectProduct: (productId: string) => void;
  inputRef?: Ref<HTMLInputElement>;
}) {
  const trimmed = query.trim().toLowerCase();
  const open = trimmed.length > 0;
  const results = open
    ? products.filter(
        (p) =>
          p.isActive &&
          (p.name.toLowerCase().includes(trimmed) ||
            p.sku.toLowerCase().includes(trimmed) ||
            p.barcode.includes(trimmed)),
      )
    : [];

  return (
    <div className="relative">
      <Command
        shouldFilter={false}
        label="ค้นหาสินค้า"
        className="overflow-visible bg-transparent"
      >
        <CommandInput
          ref={inputRef}
          autoFocus
          placeholder="ค้นหาสินค้า ชื่อ / SKU / สแกนบาร์โค้ด... (F2)"
          value={query}
          onValueChange={onQueryChange}
          className="h-12 text-base"
          wrapperClassName="p-0"
          groupClassName="h-12! border-input bg-card focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
        />
        {open && (
          <CommandList className="absolute inset-x-0 top-[calc(100%+4px)] z-20 max-h-[360px] rounded-lg border bg-popover shadow-lg">
            {results.length === 0 ? (
              <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
                <PackageX className="mx-auto mb-2 size-6" aria-hidden="true" />
                ไม่พบสินค้า
              </CommandEmpty>
            ) : (
              <CommandGroup>
                <div
                  aria-hidden="true"
                  className={cn(
                    ROW_GRID,
                    // pr-8 = item padding (8px) + CommandItem's check-icon slot (gap 8 + icon 16)
                    "pt-1 pr-8 pb-1.5 pl-2 text-xs text-muted-foreground",
                  )}
                >
                  <span>สินค้า</span>
                  <span>คงเหลือ</span>
                  <span className="text-right">ราคา</span>
                </div>
                {results.slice(0, 30).map((product) => {
                  const low = product.stockQty <= product.reorderPoint;
                  const out = product.stockQty <= 0;
                  return (
                    <CommandItem
                      key={product.id}
                      value={product.id}
                      onSelect={() => onSelectProduct(product.id)}
                      className="py-2.5"
                    >
                      <div className={cn(ROW_GRID, "flex-1")}>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{product.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {product.sku} · {categoryName(product.categoryId)}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "tabular-money text-sm",
                            out
                              ? "font-medium text-destructive"
                              : low
                                ? "font-medium text-warning"
                                : "text-muted-foreground",
                          )}
                        >
                          {product.stockQty} {product.unit}
                          {out ? " · หมด" : low ? " · ใกล้หมด" : ""}
                        </span>
                        <span className="tabular-money text-right font-medium">
                          {formatMoney(product.sellPrice)}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
      {!open && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Search className="size-3.5" aria-hidden="true" />
          พิมพ์ชื่อสินค้า, SKU หรือสแกนบาร์โค้ดเพื่อค้นหา
        </p>
      )}
    </div>
  );
}
