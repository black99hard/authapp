"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  User,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Lock,
  Fingerprint,
  MessageSquare,
  Eye,
  EyeOff,
} from "lucide-react"

interface WorkflowStep {
  id: number
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
  details: string[]
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 1,
    title: "User Registration",
    description: "Create secure account with strong password",
    icon: User,
    color: "bg-blue-500",
    details: [
      "Enter username, email, and phone number",
      "Create strong password with validation",
      "Password encrypted with bcrypt hashing",
      "Account stored securely in system",
    ],
  },
  {
    id: 2,
    title: "Login Attempt",
    description: "Authenticate with username and password",
    icon: Lock,
    color: "bg-green-500",
    details: [
      "Enter registered username and password",
      "System verifies credentials",
      "Password hash comparison for security",
      "Biometric option available for returning users",
    ],
  },
  {
    id: 3,
    title: "OTP Generation",
    description: "System generates 6-digit verification code",
    icon: MessageSquare,
    color: "bg-yellow-500",
    details: [
      "Random 6-digit OTP generated",
      "60-second expiration timer starts",
      "SMS notification simulation",
      "Code displayed for prototype testing",
    ],
  },
  {
    id: 4,
    title: "OTP Verification",
    description: "Enter verification code to complete login",
    icon: Shield,
    color: "bg-purple-500",
    details: [
      "Enter 6-digit verification code",
      "Real-time validation and feedback",
      "Auto-submit when complete",
      "Request new code if expired",
    ],
  },
  {
    id: 5,
    title: "Secure Access",
    description: "Access granted to protected dashboard",
    icon: CheckCircle,
    color: "bg-primary",
    details: [
      "Two-factor authentication complete",
      "Access to secure student portal",
      "Session management and security",
      "Biometric setup for future logins",
    ],
  },
]

export function WorkflowDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showDetails, setShowDetails] = useState<number | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % workflowSteps.length)
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
    setIsPlaying(false)
  }

  const toggleDetails = (stepId: number) => {
    setShowDetails(showDetails === stepId ? null : stepId)
  }

  const resetDemo = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    setShowDetails(null)
  }

  const CurrentStepIcon = workflowSteps[currentStep].icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Shield className="h-6 w-6 text-primary" />
            Two-Factor Authentication Workflow
          </CardTitle>
          <CardDescription className="text-base">
            Interactive demonstration of our secure multi-factor authentication process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4 mb-6">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant={isPlaying ? "secondary" : "default"}
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? "Pause Demo" : "Start Demo"}
            </Button>
            <Button onClick={resetDemo} variant="outline" className="flex items-center gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="relative mb-8">
            <div className="flex justify-between items-center">
              {workflowSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <button
                    onClick={() => handleStepClick(index)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      index <= currentStep
                        ? `${step.color} text-white shadow-lg scale-110`
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </button>
                  <span className="text-xs mt-2 text-center max-w-16 font-medium">Step {step.id}</span>
                </div>
              ))}
            </div>

            {/* Progress Line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted -z-0">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${(currentStep / (workflowSteps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Step Display */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${workflowSteps[currentStep].color} text-white`}>
                  <CurrentStepIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">{workflowSteps[currentStep].title}</h3>
                  <p className="text-muted-foreground mb-4">{workflowSteps[currentStep].description}</p>
                  <Button
                    onClick={() => toggleDetails(workflowSteps[currentStep].id)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {showDetails === workflowSteps[currentStep].id ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {showDetails === workflowSteps[currentStep].id ? "Hide Details" : "Show Details"}
                  </Button>
                </div>
              </div>

              {/* Step Details */}
              {showDetails === workflowSteps[currentStep].id && (
                <div className="mt-4 p-4 bg-background rounded-lg border">
                  <h4 className="font-semibold mb-3 text-foreground">Process Details:</h4>
                  <ul className="space-y-2">
                    {workflowSteps[currentStep].details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Security Features Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Lock className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-semibold">Password Security</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Passwords are encrypted using bcrypt hashing with salt rounds for maximum security.
            </p>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
              bcrypt Encryption
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-full">
                <Smartphone className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-semibold">OTP Verification</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Time-based 6-digit codes with 60-second expiration for enhanced security.
            </p>
            <Badge variant="secondary" className="bg-green-500/10 text-green-600">
              60s Expiry
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Fingerprint className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-semibold">Biometric Auth</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Fingerprint authentication for returning users with stored credentials.
            </p>
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-600">
              Touch ID Ready
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Technical Specifications */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Technical Specifications
          </CardTitle>
          <CardDescription>Security measures and technical implementation details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Security Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Account lockout after failed attempts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Password strength validation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Session timeout management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Audit logging and monitoring
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Implementation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  React with TypeScript
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Next.js App Router
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Tailwind CSS styling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Local storage simulation
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
