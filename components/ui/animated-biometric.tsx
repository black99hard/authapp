"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Fingerprint, Eye, CheckCircle, XCircle } from "lucide-react"

interface AnimatedBiometricProps {
  isScanning: boolean
  onComplete: (success: boolean) => void
  type?: "fingerprint" | "face"
}

export function AnimatedBiometric({ isScanning, onComplete, type = "fingerprint" }: AnimatedBiometricProps) {
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStatus, setScanStatus] = useState<"scanning" | "success" | "error" | "idle">("idle")

  useEffect(() => {
    if (!isScanning) {
      setScanProgress(0)
      setScanStatus("idle")
      return
    }

    setScanStatus("scanning")
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Simulate random success/failure for demo
          const success = Math.random() > 0.2 // 80% success rate
          setScanStatus(success ? "success" : "error")
          setTimeout(() => onComplete(success), 1000)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isScanning, onComplete])

  const Icon = type === "fingerprint" ? Fingerprint : Eye

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Biometric Scanner */}
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-32 h-32 rounded-full border-4 border-muted relative overflow-hidden">
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted" />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className={`${
                scanStatus === "success"
                  ? "text-university-green"
                  : scanStatus === "error"
                    ? "text-destructive"
                    : "text-university-gold"
              }`}
              strokeDasharray={`${2 * Math.PI * 46}`}
              strokeDashoffset={`${2 * Math.PI * 46 * (1 - scanProgress / 100)}`}
              transition={{ duration: 0.1 }}
            />
          </svg>

          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {scanStatus === "success" ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-university-green"
                >
                  <CheckCircle className="w-12 h-12" />
                </motion.div>
              ) : scanStatus === "error" ? (
                <motion.div
                  key="error"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-destructive"
                >
                  <XCircle className="w-12 h-12" />
                </motion.div>
              ) : (
                <motion.div
                  key="scanning"
                  animate={scanStatus === "scanning" ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  className="text-university-gold"
                >
                  <Icon className="w-12 h-12" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scanning Line Effect */}
          {scanStatus === "scanning" && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-university-gold/20 to-transparent"
              animate={{ y: [-128, 128] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          )}
        </div>

        {/* Pulse Effect */}
        {scanStatus === "scanning" && (
          <motion.div
            className="absolute inset-0 w-32 h-32 rounded-full border-2 border-university-gold/30"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />
        )}
      </div>

      {/* Status Text */}
      <div className="text-center space-y-2">
        <AnimatePresence mode="wait">
          {scanStatus === "scanning" && (
            <motion.div
              key="scanning-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-lg font-semibold text-foreground">Scanning...</p>
              <p className="text-sm text-muted-foreground">
                {type === "fingerprint" ? "Place your finger on the sensor" : "Look at the camera"}
              </p>
            </motion.div>
          )}
          {scanStatus === "success" && (
            <motion.div
              key="success-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-lg font-semibold text-university-green">Authentication Successful</p>
              <p className="text-sm text-muted-foreground">Redirecting to your account...</p>
            </motion.div>
          )}
          {scanStatus === "error" && (
            <motion.div
              key="error-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-lg font-semibold text-destructive">Authentication Failed</p>
              <p className="text-sm text-muted-foreground">Please try again or use password login</p>
            </motion.div>
          )}
          {scanStatus === "idle" && (
            <motion.div
              key="idle-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-lg font-semibold text-foreground">Ready to Scan</p>
              <p className="text-sm text-muted-foreground">
                {type === "fingerprint" ? "Touch the sensor to begin" : "Position your face in view"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Percentage */}
        {scanStatus === "scanning" && (
          <motion.p
            className="text-2xl font-bold text-university-gold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          >
            {Math.round(scanProgress)}%
          </motion.p>
        )}
      </div>
    </div>
  )
}
