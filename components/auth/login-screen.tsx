"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, User, Fingerprint } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

export function LoginScreen() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isBiometricLoading, setIsBiometricLoading] = useState(false)
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
    setIsBiometricLoading(true)
    setErrors({})

    try {
      // Simulate biometric authentication
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For prototype, simulate successful biometric login
      const mockUserId = "biometric-user"
      setPendingUserId(mockUserId)
      AuthService.generateOTPForUser(mockUserId)
      setStep("otp")
    } catch (error) {
      setErrors({ general: "Biometric authentication failed. Please try again." })
    } finally {
      setIsBiometricLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Saadu Zungur University Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">{"Sign in to your secure account"}</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="border-border shadow-lg bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">{"Enter your credentials to access your account"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`pl-10 ${errors.username ? "border-destructive" : ""}`}
                    disabled={isLoading || isBiometricLoading}
                    autoComplete="username"
                  />
                </div>
                {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                    disabled={isLoading || isBiometricLoading}
                    autoComplete="current-password"
                  />
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading || isBiometricLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-border hover:bg-accent/10 bg-transparent"
                onClick={handleBiometricLogin}
                disabled={isLoading || isBiometricLoading}
              >
                <Fingerprint className="mr-2 h-4 w-4" />
                {isBiometricLoading ? "Authenticating..." : "Use Biometric Login"}
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {"Don't have an account? "}
                <button
                  onClick={() => setStep("register")}
                  className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
                  disabled={isLoading || isBiometricLoading}
                >
                  Create one here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {"After signing in, you'll receive a verification code for added security"}
          </p>
        </div>
      </div>
    </div>
  )
}
