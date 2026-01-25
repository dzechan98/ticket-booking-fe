export const SHOWTIME_QUERY_KEYS = {
  all: ["showtimes"] as const,
  lists: () => [...SHOWTIME_QUERY_KEYS.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...SHOWTIME_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SHOWTIME_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SHOWTIME_QUERY_KEYS.details(), id] as const,
  seats: (id: string) => [...SHOWTIME_QUERY_KEYS.all, "seats", id] as const,
};
