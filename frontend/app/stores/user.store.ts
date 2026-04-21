import { create } from "zustand";
import { UserResponse } from "../schemas/generated/type";

export type userStore = {
    user: UserResponse | null;
    setUser: (user: UserResponse | null) => void;
}

export const useUserStore = create<userStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}))