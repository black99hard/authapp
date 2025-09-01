"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  isAuthenticated: boolean
  userId: string | null
  currentStep: "register" | "login" | "otp" | "dashboard"
  pendingUserId: string | null
  login: (userId: string) => void
  logout: () => void
  setStep: (step: "register" | "login" | "otp" | "dashboard") => void
  setPendingUserId: (userId: string | null) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      currentStep: "register",
      pendingUserId: null,
      login: (userId: string) => set({ isAuthenticated: true, userId, currentStep: "dashboard", pendingUserId: null }),
      logout: () => set({ isAuthenticated: false, userId: null, currentStep: "register", pendingUserId: null }),
      setStep: (step) => set({ currentStep: step }),
      setPendingUserId: (userId) => set({ pendingUserId: userId }),
    }),
    {
      name: "2fa-auth-storage",
    },
  ),
)
