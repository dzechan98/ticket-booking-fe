import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { DASHBOARD_KEYS } from "./key";
import type { RevenueChartData, ChartPeriodType } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/dashboard/revenue-chart";

interface RevenueChartParams {
  period?: ChartPeriodType;
  days?: number;
}

export const useRevenueChart = (params: RevenueChartParams = {}) => {
  const { period = "day", days = 7 } = params;

  return useQuery({
    queryKey: DASHBOARD_KEYS.revenueChart(period, days),
    queryFn: async () => {
      const response = await instance.get<ApiResponse<RevenueChartData[]>>(
        URL,
        {
          params: { period, days },
        },
      );
      return response.data;
    },
  });
};
