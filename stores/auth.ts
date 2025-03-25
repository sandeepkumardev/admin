import { create } from "zustand";

interface IAuthStore {
  user: any;
  setUser: (user: any) => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
