import { create } from "zustand";

interface RefreshStore {
  refreshToken: number;
  triggerRefresh: () => void;
}

export const useRefreshStore = create<RefreshStore>((set) => ({
  refreshToken: 0,     // number change triggers re-renders
  triggerRefresh: () => set((state) => ({ refreshToken: state.refreshToken + 1 }))
}));
