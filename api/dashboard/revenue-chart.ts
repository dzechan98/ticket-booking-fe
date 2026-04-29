import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { DASHBOARD_KEYS } from "./key";
import type { RevenueChartData, ChartPeriodType } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/dashboard/revenue-chart";

interface RevenueChartParams {
  period?: ChartPeriodType;
  startDate?: string;
  endDate?: string;
}

export const useRevenueChart = (params: RevenueChartParams = {}) => {
  const { period = "day", startDate, endDate } = params;

  return useQuery({
    queryKey: DASHBOARD_KEYS.revenueChart(period, startDate, endDate),
    queryFn: async () => {
      const response = await instance.get<ApiResponse<RevenueChartData[]>>(
        URL,
        {
          params: { period, startDate, endDate },
        },
      );
      return response.data;
    },
  });
};
