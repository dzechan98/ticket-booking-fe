import { UserResponse } from "@/api/users/type";
import { ImmerStateCreator } from "@/zustand/store";

export type AuthState = {
  user: UserResponse | null;
  hydrated: boolean;
  setUser: (user: any | null) => void;
  setHydrated: () => void;
};

export const createAuthSlice: ImmerStateCreator<AuthState> = (set) => {
  return {
    user: null,
    hydrated: false,
    setUser: (user) =>
      set((state) => {
        state.auth.user = user;
      }),
    setHydrated: () => {
      set((state) => {
        state.auth.hydrated = true;
      });
    },
  };
};
