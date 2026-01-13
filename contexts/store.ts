import { CommonState } from "@/zustand/store";
import { createContext, use } from "react";
import { StoreApi, useStore } from "zustand";

export const StorageContext = createContext<StoreApi<CommonState>>(
  {} as StoreApi<CommonState>
);

export const useStoreContext = <S>(selector: (state: CommonState) => S) => {
  const store = use(StorageContext);

  if (!store) {
    throw new Error("Missing StoreProvider");
  }

  return useStore(store, selector);
};
