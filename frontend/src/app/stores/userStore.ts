import IUser from "@services/users/interfaces/IUser";
import { create } from "zustand";

interface IUserStore {
  user?: IUser;
  setUser: (user?: IUser) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));
