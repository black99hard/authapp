"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Clock, RefreshCw, Eye, EyeOff } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useAuth } from "@/hooks/use-auth"

export function OTPScreen() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [showPrototypeOTP, setShowPrototypeOTP] = useState(false)
  const [prototypeOTP, setPrototypeOTP] = useState("")
  const { pendingUserId, login, setStep } = useAuth()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Get the current OTP for prototype display
  useEffect(() => {
    if (pendingUserId) {
      // In a real app, we wouldn't expose this, but for prototype we show it
      const user = AuthService.getUser(pendingUserId)
      if (user) {
        // Generate a new OTP and capture it
        const { otp: generatedOTP } = AuthService.generateOTPForUser(pendingUserId)
        setPrototypeOTP(generatedOTP)
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
    // Only allow single digits
    if (value.length > 1) return

    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Clear errors when user starts typing
    if (errors.otp) {
      setErrors({})
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (value && index === 5 && newOtp.every((digit) => digit !== "")) {
      handleVerifyOTP(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Handle paste
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
        // OTP verified successfully, complete login
        login(pendingUserId)
      } else {
        setErrors({ otp: result.message })
        // Clear OTP inputs on error
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
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verify Your Identity</h1>
          <p className="text-muted-foreground">{"Enter the 6-digit code to complete your login"}</p>
        </div>

        {/* Prototype OTP Display */}
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-accent/20 p-1 rounded">
                  <Eye className="h-4 w-4 text-accent" />
                </div>
                <span className="text-sm font-medium text-accent">Prototype Mode</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrototypeOTP(!showPrototypeOTP)}
                className="text-accent hover:text-accent/80"
              >
                {showPrototypeOTP ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {showPrototypeOTP && (
              <div className="mt-2 p-2 bg-accent/10 rounded text-center">
                <p className="text-sm text-muted-foreground">Your OTP code is:</p>
                <p className="text-lg font-mono font-bold text-accent">{prototypeOTP}</p>
              </div>
            )}
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
