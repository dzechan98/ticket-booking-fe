"use client";

import { useStoreContext } from "@/contexts/store";

export const useAuth = () => {
  const user = useStoreContext((state) => state.auth.user);
  const setUser = useStoreContext((state) => state.auth.setUser);
  const hydrated = useStoreContext((state) => state.auth.hydrated);

  const logout = async () => {
    setUser(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return { user, hydrated, logout };
};
