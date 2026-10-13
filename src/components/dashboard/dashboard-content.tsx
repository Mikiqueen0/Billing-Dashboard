"use client";

import { useMemo, useState } from "react";

import { ActionItems } from "@/components/dashboard/action-items";
import { CategorySalesChart } from "@/components/dashboard/category-sales-chart";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PaymentBreakdownChart } from "@/components/dashboard/payment-breakdown-chart";
import { SalesHeatmap } from "@/components/dashboard/sales-heatmap";
import { SalesTrendChart } from "@/components/dashboard/sales-trend-chart";
import { TimeRangeFilter } from "@/components/dashboard/time-range-filter";
import { TopCustomersList } from "@/components/dashboard/top-customers-list";
import { TopProductsChart } from "@/components/dashboard/top-products-chart";
import { PageHeader } from "@/components/layout/page-header";
import { computeDashboardData, type DateRangeKey } from "@/mocks/analytics";

export function DashboardContent() {
  const [range, setRange] = useState<DateRangeKey>("month");
  const data = useMemo(() => computeDashboardData(range), [range]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        description="ภาพรวมยอดขาย กำไร และสิ่งที่ต้องจัดการวันนี้"
        actions={<TimeRangeFilter value={range} onChange={setRange} />}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.key} kpi={kpi} />
        ))}
      </div>

      <ActionItems />

      <SalesTrendChart dailySales={data.dailySales} />

      <div className="grid gap-4 lg:grid-cols-2">
        <TopProductsChart
          topProductsByQty={data.topProductsByQty}
          topProductsByProfit={data.topProductsByProfit}
        />
        <CategorySalesChart categorySales={data.categorySales} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PaymentBreakdownChart paymentBreakdown={data.paymentBreakdown} />
        <TopCustomersList topCustomers={data.topCustomers} />
      </div>

      <SalesHeatmap />
    </div>
  );
}
