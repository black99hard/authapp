"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { RegisterScreen } from "@/components/auth/register-screen"
import { LoginScreen } from "@/components/auth/login-screen"
import { OTPScreen } from "@/components/auth/otp-screen"
import { Dashboard } from "@/components/auth/dashboard"
import { SplashScreen } from "@/components/auth/splash-screen"

export default function Home() {
  const { currentStep, isAuthenticated } = useAuth()
  const [showSplash, setShowSplash] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const handleScreenTransition = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 300)
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  const getCurrentScreen = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-university-gold/5 via-white to-university-green/5">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full"
        >
          {getCurrentScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
