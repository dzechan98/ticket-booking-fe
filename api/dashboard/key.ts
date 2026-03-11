export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  overview: (period?: string) =>
    [...DASHBOARD_KEYS.all, "overview", period] as const,
  revenueChart: (period?: string, days?: number) =>
    [...DASHBOARD_KEYS.all, "revenue-chart", period, days] as const,
  topMovies: (limit?: number) =>
    [...DASHBOARD_KEYS.all, "top-movies", limit] as const,
};
