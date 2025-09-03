"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, User, Fingerprint, Shield, GraduationCap } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useAuth } from "@/hooks/use-auth"
import { AnimatedBiometric } from "@/components/ui/animated-biometric"
import Image from "next/image"

export function LoginScreen() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isBiometricLoading, setIsBiometricLoading] = useState(false)
  const [showBiometricModal, setShowBiometricModal] = useState(false)
  const { setStep, setPendingUserId } = useAuth()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const result = await AuthService.loginUser(formData.username, formData.password)

      if (result.success && result.userId) {
        // Login successful, generate OTP and move to OTP screen
        setPendingUserId(result.userId)
        AuthService.generateOTPForUser(result.userId)
        setStep("otp")
      } else {
        setErrors({ general: result.message })
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBiometricLogin = async () => {
    setShowBiometricModal(true)
    setErrors({})
  }

  const handleBiometricComplete = (success: boolean) => {
    if (success) {
      // Try to authenticate with stored biometric user
      const result = AuthService.authenticateWithBiometric()

      if (result.success && result.userId) {
        setPendingUserId(result.userId)
        AuthService.generateOTPForUser(result.userId)
        setStep("otp")
      } else {
        setErrors({ general: result.message })
      }
    } else {
      setErrors({ general: "Biometric authentication failed. Please try again." })
    }
    setShowBiometricModal(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-6">
          <div className="university-header rounded-2xl p-6 shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Saadu Zungur University Logo"
                  width={140}
                  height={140}
                  className="object-contain drop-shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-secondary text-secondary-foreground rounded-full p-2 shadow-lg">
                  <Shield className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-primary-foreground tracking-tight">Secure Access Portal</h1>
              <div className="flex items-center justify-center gap-2 text-primary-foreground/80">
                <GraduationCap className="h-5 w-5" />
                <p className="text-lg font-medium">Saadu Zungur University</p>
              </div>
              <p className="text-primary-foreground/70 text-sm">Two-Factor Authentication System</p>
            </div>
          </div>
        </div>

        <Card className="academic-card border-2 border-primary/10 shadow-2xl">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-2xl text-center font-bold">Sign In</CardTitle>
            </div>
            <CardDescription className="text-center text-base">
              Enter your university credentials to access your secure account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.general && (
                <Alert variant="destructive" className="border-l-4 border-l-destructive">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="font-medium">{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Username Field */}
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-semibold text-foreground">
                  University Username
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your university username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`pl-12 h-12 text-base border-2 focus:border-primary/50 ${
                      errors.username ? "border-destructive" : "border-border"
                    }`}
                    disabled={isLoading || isBiometricLoading}
                    autoComplete="username"
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-destructive font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-destructive rounded-full"></span>
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your secure password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-12 h-12 text-base border-2 focus:border-primary/50 ${
                      errors.password ? "border-destructive" : "border-border"
                    }`}
                    disabled={isLoading || isBiometricLoading}
                    autoComplete="current-password"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-destructive rounded-full"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="professional-button w-full h-12 text-base font-semibold tracking-wide"
                disabled={isLoading || isBiometricLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Sign In Securely
                  </div>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t-2 border-border/50" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-card px-4 text-muted-foreground font-medium">Alternative Method</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base font-medium border-2 border-secondary/30 hover:border-secondary hover:bg-secondary/10 transition-all duration-200 bg-transparent"
                onClick={handleBiometricLogin}
                disabled={isLoading || isBiometricLoading}
              >
                {isBiometricLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"></div>
                    Scanning...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-5 w-5 text-secondary" />
                    Biometric Authentication
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                New to the university system?{" "}
                <button
                  onClick={() => setStep("register")}
                  className="text-primary hover:text-primary/80 font-semibold underline underline-offset-4 transition-colors"
                  disabled={isLoading || isBiometricLoading}
                >
                  Register Your Account
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-secondary" />
            <p className="text-sm font-semibold text-foreground">Enhanced Security</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This system uses two-factor authentication to protect your university account. You will receive a
            verification code after successful login.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showBiometricModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card rounded-2xl p-8 max-w-sm w-full border-2 border-primary/20 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Biometric Authentication</h3>
                <p className="text-sm text-muted-foreground">Please authenticate using your biometric sensor</p>
              </div>

              <AnimatedBiometric isScanning={true} onComplete={handleBiometricComplete} type="fingerprint" />

              <Button variant="outline" onClick={() => setShowBiometricModal(false)} className="w-full mt-6">
                Cancel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
