"use client";

import { toast } from "sonner";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DateRangeKey } from "@/mocks/analytics";

const ranges: { value: DateRangeKey; label: string }[] = [
  { value: "today", label: "วันนี้" },
  { value: "7d", label: "7 วัน" },
  { value: "month", label: "เดือนนี้" },
];

export function TimeRangeFilter({
  value,
  onChange,
}: {
  value: DateRangeKey;
  onChange: (value: DateRangeKey) => void;
}) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => {
        if (v === "custom") {
          toast.info("เลือกช่วงวันที่เอง — เร็วๆ นี้");
          return;
        }
        onChange(v as DateRangeKey);
      }}
    >
      <TabsList>
        {ranges.map((r) => (
          <TabsTrigger key={r.value} value={r.value}>
            {r.label}
          </TabsTrigger>
        ))}
        <TabsTrigger value="custom">กำหนดเอง</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
