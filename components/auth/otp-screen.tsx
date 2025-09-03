"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Notification } from "@/components/ui/notification"
import { Shield, Clock, RefreshCw, Smartphone } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useAuth } from "@/hooks/use-auth"

export function OTPScreen() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [showNotification, setShowNotification] = useState(false)
  const [prototypeOTP, setPrototypeOTP] = useState("")
  const { pendingUserId, login, setStep } = useAuth()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Get the current OTP for prototype display
  useEffect(() => {
    if (pendingUserId) {
      const user = AuthService.getUser(pendingUserId)
      if (user) {
        const { otp: generatedOTP } = AuthService.generateOTPForUser(pendingUserId)
        setPrototypeOTP(generatedOTP)
        setTimeout(() => setShowNotification(true), 1000)
      }
    }
  }, [pendingUserId])

  // Countdown timer
  useEffect(() => {
    if (!pendingUserId) return

    const timer = setInterval(() => {
      const remaining = AuthService.getOTPTimeRemaining(pendingUserId)
      setTimeRemaining(remaining)

      if (remaining <= 0) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [pendingUserId])

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (errors.otp) {
      setErrors({})
    }

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (value && index === 5 && newOtp.every((digit) => digit !== "")) {
      handleVerifyOTP(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6).split("")
        const newOtp = [...otp]
        digits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit
        })
        setOtp(newOtp)
        if (digits.length === 6) {
          handleVerifyOTP(newOtp.join(""))
        }
      })
    }
  }

  const handleVerifyOTP = async (otpCode?: string) => {
    const codeToVerify = otpCode || otp.join("")

    if (codeToVerify.length !== 6) {
      setErrors({ otp: "Please enter all 6 digits" })
      return
    }

    if (!pendingUserId) {
      setErrors({ otp: "Session expired. Please login again." })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result = AuthService.verifyOTP(pendingUserId, codeToVerify)

      if (result.success) {
        login(pendingUserId)
      } else {
        setErrors({ otp: result.message })
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      setErrors({ otp: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestNewOTP = () => {
    if (!pendingUserId) return

    const { otp: newOTP } = AuthService.generateOTPForUser(pendingUserId)
    setPrototypeOTP(newOTP)
    setTimeRemaining(60)
    setOtp(["", "", "", "", "", ""])
    setErrors({})
    inputRefs.current[0]?.focus()
    setTimeout(() => setShowNotification(true), 500)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!pendingUserId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>Session expired. Please login again.</AlertDescription>
            </Alert>
            <Button onClick={() => setStep("login")} className="w-full mt-4">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Notification
        show={showNotification}
        onClose={() => setShowNotification(false)}
        title="Saadu Zungur University"
        message="Your verification code for secure login:"
        code={prototypeOTP}
        duration={8000}
      />

      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verify Your Identity</h1>
          <p className="text-muted-foreground">{"Enter the 6-digit code sent to your device"}</p>
        </div>

        {/* SMS Status Indicator */}
        <Card className="border-university-green/20 bg-university-green/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="bg-university-green/20 p-2 rounded-full">
                <Smartphone className="h-5 w-5 text-university-green" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-university-green">SMS Sent Successfully</p>
                <p className="text-xs text-muted-foreground">Check your notification panel above</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotification(true)}
                className="text-university-green hover:text-university-green/80 text-xs"
              >
                Show Again
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* OTP Verification Form */}
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Enter Verification Code</CardTitle>
            <CardDescription className="text-center">{"We've sent a 6-digit code for verification"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors.otp && (
              <Alert variant="destructive">
                <AlertDescription>{errors.otp}</AlertDescription>
              </Alert>
            )}

            {/* OTP Input Grid */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-mono font-bold border-2 focus:border-primary focus:ring-primary/20"
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Timer and Resend */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {timeRemaining > 0 ? `Code expires in ${formatTime(timeRemaining)}` : "Code expired"}
                </span>
              </div>

              {timeRemaining <= 0 ? (
                <Button
                  variant="outline"
                  onClick={handleRequestNewOTP}
                  className="w-full bg-transparent"
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Request New Code
                </Button>
              ) : (
                <Button
                  onClick={() => handleVerifyOTP()}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading || otp.some((digit) => digit === "")}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              )}
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <button
                onClick={() => setStep("login")}
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                disabled={isLoading}
              >
                Back to Login
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {"This code is valid for 60 seconds and can only be used once"}
          </p>
        </div>
      </div>
    </div>
  )
}
