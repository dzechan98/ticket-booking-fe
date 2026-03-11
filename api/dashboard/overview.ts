import { useQuery } from "@tanstack/react-query";
import instance from "../instance";
import { DASHBOARD_KEYS } from "./key";
import type { OverviewStats, PeriodType } from "./type";
import type { ApiResponse } from "@/types/common";

const URL = "/dashboard/overview";

interface OverviewParams {
  period?: PeriodType;
}

export const useOverviewStats = (params: OverviewParams = {}) => {
  const { period = "all" } = params;

  return useQuery({
    queryKey: DASHBOARD_KEYS.overview(period),
    queryFn: async () => {
      const response = await instance.get<ApiResponse<OverviewStats>>(URL, {
        params: { period },
      });
      return response.data;
    },
  });
};
