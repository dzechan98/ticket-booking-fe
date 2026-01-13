export const ROOMS_KEYS = {
  all: () => ["rooms"],
  lists: () => [...ROOMS_KEYS.all(), "list"],
  list: (filters?: any) => [...ROOMS_KEYS.lists(), filters],
  details: () => [...ROOMS_KEYS.all(), "detail"],
  detail: (id?: string) => [...ROOMS_KEYS.details(), id],
};
