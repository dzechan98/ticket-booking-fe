export const TICKETS_KEYS = {
  all: ["tickets"] as const,
  lists: () => [...TICKETS_KEYS.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...TICKETS_KEYS.lists(), params] as const,
};
