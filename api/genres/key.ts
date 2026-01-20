export const GENRES_KEYS = {
  all: () => ["genres"],
  lists: () => [...GENRES_KEYS.all(), "list"],
  list: (filters?: any) => [...GENRES_KEYS.lists(), filters],
  details: () => [...GENRES_KEYS.all(), "detail"],
  detail: (id?: string) => [...GENRES_KEYS.details(), id],
};
