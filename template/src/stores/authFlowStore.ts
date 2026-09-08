import { create } from "zustand";

type AuthFlowState = {
  passwordResetPending: boolean;
  setPasswordResetPending: (value: boolean) => void;
};

export const useAuthFlowStore = create<AuthFlowState>((set) => ({
  passwordResetPending: false,
  setPasswordResetPending: (value: boolean) =>
    set({ passwordResetPending: value }),
}));
