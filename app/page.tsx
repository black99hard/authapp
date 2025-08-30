"use client"

import { useAuth } from "@/hooks/use-auth"
import { RegisterScreen } from "@/components/auth/register-screen"
import { LoginScreen } from "@/components/auth/login-screen"
import { OTPScreen } from "@/components/auth/otp-screen"
import { Dashboard } from "@/components/auth/dashboard"

export default function Home() {
  const { currentStep, isAuthenticated } = useAuth()

  if (isAuthenticated && currentStep === "dashboard") {
    return <Dashboard />
  }

  switch (currentStep) {
    case "register":
      return <RegisterScreen />
    case "login":
      return <LoginScreen />
    case "otp":
      return <OTPScreen />
    default:
      return <RegisterScreen />
  }
}
