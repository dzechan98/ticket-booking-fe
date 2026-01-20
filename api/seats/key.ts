export const SEATS_KEYS = {
  all: () => ["seats"],
  lists: () => [...SEATS_KEYS.all(), "list"],
  list: (filters?: any) => [...SEATS_KEYS.lists(), filters],
  details: () => [...SEATS_KEYS.all(), "detail"],
  detail: (id?: string) => [...SEATS_KEYS.details(), id],
  byRoom: (roomId?: string) => [...SEATS_KEYS.all(), "room", roomId],
};
