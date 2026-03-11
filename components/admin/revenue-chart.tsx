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
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RevenueChartProps {
  period?: ChartPeriodType;
  days?: number;
}

export function RevenueChart({ period = "day", days = 7 }: RevenueChartProps) {
  const { data, isLoading, error } = useRevenueChart({ period, days });

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Biểu đồ doanh thu</CardTitle>
          <CardDescription>7 ngày gần nhất</CardDescription>
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
          <CardDescription>7 ngày gần nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-75 flex items-center justify-center">
            <p className="text-muted-foreground">Không thể tải dữ liệu</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.data.map((item) => {
    const date = new Date(item.date);
    return {
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      "Doanh thu (VNĐ)": item.revenue,
      "Số vé": item.tickets,
      revenue: item.revenue,
      tickets: item.tickets,
    };
  });

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Biểu đồ doanh thu</CardTitle>
        <CardDescription>7 ngày gần nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-87.5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                label={{
                  value: "Số vé",
                  angle: 90,
                  position: "insideRight",
                  style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                formatter={(value: any, name: string) => {
                  if (name === "Doanh thu (VNĐ)") {
                    return [
                      Number(value).toLocaleString("vi-VN") + " VNĐ",
                      name,
                    ];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="Doanh thu (VNĐ)"
                fill="hsl(var(--primary))"
                radius={[8, 8, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Số vé"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
