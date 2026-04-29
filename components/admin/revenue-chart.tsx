"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRevenueChart } from "@/api/dashboard/revenue-chart";
import type { ChartPeriodType } from "@/api/dashboard/type";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, ComposedChart, XAxis, YAxis, CartesianGrid } from "recharts";

interface RevenueChartProps {
  period?: ChartPeriodType;
  startDate?: string;
  endDate?: string;
  rangeLabel?: string;
}

const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function RevenueChart({
  period = "day",
  startDate,
  endDate,
  rangeLabel,
}: RevenueChartProps) {
  const { data, isLoading, error } = useRevenueChart({
    period,
    startDate,
    endDate,
  });

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Biểu đồ doanh thu</CardTitle>
          <CardDescription>
            {rangeLabel ?? "Khoảng thời gian đã chọn"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-75 flex items-center justify-center">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.data) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Biểu đồ doanh thu</CardTitle>
          <CardDescription>
            {rangeLabel ?? "Khoảng thời gian đã chọn"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-75 flex items-center justify-center">
            <p className="text-muted-foreground">Không thể tải dữ liệu</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.data.map((item) => ({
    date: item.date,
    revenue: item.revenue,
    tickets: item.tickets,
  }));

  if (chartData.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Biểu đồ doanh thu</CardTitle>
          <CardDescription>
            {rangeLabel ?? "Khoảng thời gian đã chọn"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-75 flex items-center justify-center">
            <p className="text-muted-foreground">
              Không có dữ liệu trong khoảng thời gian đã chọn
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Biểu đồ doanh thu</CardTitle>
        <CardDescription>
          {rangeLabel ?? "Khoảng thời gian đã chọn"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-87.5">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ComposedChart accessibilityLayer data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                yAxisId="left"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => (value / 1000000).toFixed(0) + "M"}
                label={{
                  value: "Doanh thu (VNĐ)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => {
                      if (name === "Doanh thu") {
                        const tickets = Number(
                          (item?.payload as { tickets?: number })?.tickets ?? 0,
                        );

                        return [
                          <div key="value" className="space-y-0.5">
                            <div>
                              {Number(value).toLocaleString("vi-VN")} VNĐ
                            </div>
                            <div className="text-muted-foreground">
                              Số vé: {tickets}
                            </div>
                          </div>,
                          name,
                        ];
                      }

                      return [<span key="value">{String(value)}</span>, name];
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                name="Doanh thu"
                fill="var(--color-revenue)"
                radius={[8, 8, 0, 0]}
              />
            </ComposedChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
