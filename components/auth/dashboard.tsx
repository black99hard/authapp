"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  User,
  Mail,
  Phone,
  Calendar,
  Activity,
  LogOut,
  CheckCircle,
  Clock,
  Smartphone,
  History,
} from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useAuth } from "@/hooks/use-auth"
import { SecurityDashboard } from "./security-dashboard"
import { WorkflowDemo } from "./workflow-demo"

export function Dashboard() {
  const { userId, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const user = userId ? AuthService.getUser(userId) : null

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">User not found</p>
            <Button onClick={logout} className="mt-4">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    // Simulate logout delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    logout()
  }

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Simulated recent activity for prototype
  const recentActivity = [
    {
      id: 1,
      action: "Successful login with 2FA",
      timestamp: new Date(),
      icon: CheckCircle,
      status: "success",
    },
    {
      id: 2,
      action: "Account created",
      timestamp: user.createdAt,
      icon: User,
      status: "info",
    },
    {
      id: 3,
      action: "2FA verification completed",
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      icon: Shield,
      status: "success",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="University Logo" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Saadu Zungur University</h1>
                <p className="text-sm text-muted-foreground">Secure Student Portal</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 bg-transparent"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Signing Out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <Avatar className="h-20 w-20 mx-auto mb-4 bg-primary/10">
            <AvatarFallback className="text-primary text-xl font-bold">{getInitials(user.username)}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back, {user.username}!</h2>
          <p className="text-muted-foreground">Your account is secured with two-factor authentication</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              How It Works
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Account Overview */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Account Information
                </CardTitle>
                <CardDescription>Your account details and security status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Username</p>
                        <p className="text-sm text-muted-foreground">{user.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Member Since</p>
                        <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Status
                </CardTitle>
                <CardDescription>Your account security features and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Smartphone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">SMS-based OTP verification</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded-full">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Password Protection</p>
                      <p className="text-sm text-muted-foreground">Encrypted with bcrypt hashing</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Secure
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {/* Recent Activity */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest account activities and security events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const IconComponent = activity.icon
                    return (
                      <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                        <div
                          className={`p-2 rounded-full ${
                            activity.status === "success"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity.action}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {activity.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow">
            <WorkflowDemo />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-xs text-muted-foreground">Saadu Zungur University - Secure Student Portal Prototype</p>
        </div>
      </div>
    </div>
  )
}
