export const BOOKINGS_KEYS = {
  all: ["bookings"] as const,
  lists: () => [...BOOKINGS_KEYS.all, "list"] as const,
  list: (params: any) => [...BOOKINGS_KEYS.lists(), params] as const,
  details: () => [...BOOKINGS_KEYS.all, "detail"] as const,
  detail: (id: string) => [...BOOKINGS_KEYS.details(), id] as const,
  myBookings: () => [...BOOKINGS_KEYS.all, "my-bookings"] as const,
  myBooking: (id: string) => [...BOOKINGS_KEYS.all, "my-booking", id] as const,
};
