"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, Clock, AlertTriangle } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect } from "react"

export function SecurityDashboard() {
  const { user } = useAuth()
  const [loginHistory, setLoginHistory] = useState<any[]>([])
  const [securitySettings, setSecuritySettings] = useState<any>({})

  useEffect(() => {
    if (user?.id) {
      setLoginHistory(AuthService.getLoginHistory(user.id))
      setSecuritySettings(AuthService.getSecuritySettings(user.id))
    }
  }, [user])

  const updateSetting = (key: string, value: any) => {
    if (user?.id) {
      const newSettings = { ...securitySettings, [key]: value }
      setSecuritySettings(newSettings)
      AuthService.updateSecuritySettings(user.id, { [key]: value })
    }
  }

  return (
    <div className="space-y-6">
      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Security Status
          </CardTitle>
          <CardDescription>Your account security overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Two-Factor Authentication</span>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800">
              Enabled
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Session Timeout</span>
            </div>
            <span className="text-sm text-muted-foreground">{securitySettings.sessionTimeout || 30} minutes</span>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Preferences</CardTitle>
          <CardDescription>Manage your security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Login Notifications</Label>
              <p className="text-xs text-muted-foreground">Get notified of new login attempts</p>
            </div>
            <Switch
              checked={securitySettings.loginNotifications}
              onCheckedChange={(checked) => updateSetting("loginNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Two-Factor Authentication</Label>
              <p className="text-xs text-muted-foreground">Require OTP for all logins</p>
            </div>
            <Switch
              checked={securitySettings.twoFactorEnabled}
              onCheckedChange={(checked) => updateSetting("twoFactorEnabled", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Login Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Login Activity
          </CardTitle>
          <CardDescription>Your recent login attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loginHistory.slice(0, 5).map((attempt, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {attempt.success ? (
                    <Shield className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {attempt.success ? "Successful Login" : "Failed Login Attempt"}
                    </p>
                    <p className="text-xs text-muted-foreground">{attempt.timestamp.toLocaleString()}</p>
                  </div>
                </div>
                <Badge variant={attempt.success ? "default" : "destructive"}>
                  {attempt.success ? "Success" : "Failed"}
                </Badge>
              </div>
            ))}

            {loginHistory.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No recent login activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
