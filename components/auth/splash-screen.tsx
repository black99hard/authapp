"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, GraduationCap } from "lucide-react"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    "Initializing Security Protocols...",
    "Loading University Systems...",
    "Preparing Authentication...",
    "Ready for Secure Access",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 1
      })
    }, 30)

    return () => clearInterval(interval)
  }, [onComplete])

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 800)

    return () => clearInterval(stepInterval)
  }, [steps.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-university-gold/10 via-white to-university-green/10 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md w-full">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-0 w-32 h-32 border-4 border-university-gold/20 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-2 w-28 h-28 border-2 border-university-green/30 rounded-full"
            />
            <div className="relative w-32 h-32 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Saadu Zungur University"
                width={100}
                height={100}
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </motion.div>

        {/* University Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-university-gold">Saadu Zungur University</h1>
          <div className="flex items-center justify-center gap-2 text-university-green">
            <Shield className="w-5 h-5" />
            <p className="text-lg font-semibold">Secure Authentication System</p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-university-gold to-university-green rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Progress Percentage */}
          <motion.p
            className="text-lg font-bold text-university-gold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          >
            {progress}%
          </motion.p>
        </motion.div>

        {/* Loading Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <GraduationCap className="w-4 h-4" />
            </motion.div>
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-sm font-medium"
            >
              {steps[currentStep]}
            </motion.p>
          </div>

          {/* Security Indicators */}
          <div className="flex justify-center gap-4 mt-6">
            {[
              { icon: Shield, label: "Encrypted", delay: 1.5 },
              { icon: GraduationCap, label: "Verified", delay: 2 },
              { icon: Shield, label: "Secure", delay: 2.5 },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: item.delay, duration: 0.3 }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-8 h-8 bg-university-green/10 rounded-full flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-university-green" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground">Ilimi Tushen Cigaba • Knowledge is the Foundation of Progress</p>
        </motion.div>
      </div>
    </div>
  )
}
