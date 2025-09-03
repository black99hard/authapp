"use client"

import { motion } from "framer-motion"
import { Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SecurityScoreProps {
  score: number
  factors: {
    name: string
    status: "good" | "warning" | "error"
    description: string
  }[]
}

export function SecurityScore({ score, factors }: SecurityScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-university-green"
    if (score >= 60) return "text-university-gold"
    return "text-destructive"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Poor"
  }

  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <Card className="academic-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-university-gold" />
          Security Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Circular Progress */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
              {/* Progress Circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className={getScoreColor(score)}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>

            {/* Score Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className={`text-3xl font-bold ${getScoreColor(score)}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {score}
              </motion.span>
              <span className="text-sm text-muted-foreground font-medium">{getScoreLabel(score)}</span>
            </div>
          </div>
        </div>

        {/* Security Factors */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Security Factors</h4>
          <div className="space-y-2">
            {factors.map((factor, index) => (
              <motion.div
                key={factor.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 1, duration: 0.3 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
              >
                <div className="flex-shrink-0">
                  {factor.status === "good" && <CheckCircle className="w-5 h-5 text-university-green" />}
                  {factor.status === "warning" && <AlertTriangle className="w-5 h-5 text-university-gold" />}
                  {factor.status === "error" && <XCircle className="w-5 h-5 text-destructive" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{factor.name}</p>
                  <p className="text-sm text-muted-foreground">{factor.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-4 bg-university-gold/10 rounded-lg border border-university-gold/20">
          <h5 className="font-semibold text-university-gold mb-2">Security Recommendations</h5>
          <ul className="text-sm text-muted-foreground space-y-1">
            {score < 80 && (
              <>
                <li>• Enable two-factor authentication on all accounts</li>
                <li>• Use strong, unique passwords for each service</li>
                <li>• Regularly update your security settings</li>
              </>
            )}
            {score >= 80 && <li>• Your security is excellent! Keep up the good practices.</li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
