export const MOVIES_KEYS = {
  all: () => ["movies"],
  lists: () => [...MOVIES_KEYS.all(), "list"],
  list: (filters?: any) => [...MOVIES_KEYS.lists(), filters],
  details: () => [...MOVIES_KEYS.all(), "detail"],
  detail: (id?: string) => [...MOVIES_KEYS.details(), id],
};
