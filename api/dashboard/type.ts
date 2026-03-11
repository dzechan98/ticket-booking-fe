export interface OverviewStats {
  totalTicketsSold: number;
  totalRevenue: number;
  totalUsers: number;
  totalMoviesShowing: number;
  totalRooms: number;
  totalShowtimesToday: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  tickets: number;
}

export interface TopMovie {
  id: string;
  title: string;
  posterUrl: string;
  ticketsSold: number;
  revenue: number;
  rating: number;
}

export type PeriodType = "today" | "week" | "month" | "all";
export type ChartPeriodType = "day" | "week" | "month";
