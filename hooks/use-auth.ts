"use client";

import { useStoreContext } from "@/contexts/store";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();
  const user = useStoreContext((state) => state.auth.user);
  const setUser = useStoreContext((state) => state.auth.setUser);
  const hydrated = useStoreContext((state) => state.auth.hydrated);

  const logout = async () => {
    setUser(null);
    router.push("/login");
    localStorage.removeItem("accessToken");
  };

  return { user, hydrated, logout };
};
