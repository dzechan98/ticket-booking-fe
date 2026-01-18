export const USER_KEYS = {
  users: () => ["users"],
  userMe: () => "userMe",
  list: (filters?: any) => [...USER_KEYS.users(), "list", filters],
};
