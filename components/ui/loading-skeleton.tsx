"use client"

import { motion } from "framer-motion"

interface LoadingSkeletonProps {
  className?: string
  variant?: "text" | "card" | "avatar" | "button"
}

export function LoadingSkeleton({ className = "", variant = "text" }: LoadingSkeletonProps) {
  const baseClasses = "bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-pulse"

  const variants = {
    text: "h-4 w-full",
    card: "h-32 w-full",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-24",
  }

  return (
    <motion.div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="academic-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <LoadingSkeleton variant="avatar" />
        <div className="space-y-2 flex-1">
          <LoadingSkeleton className="h-5 w-1/3" />
          <LoadingSkeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2 pt-4">
        <LoadingSkeleton variant="button" />
        <LoadingSkeleton variant="button" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <LoadingSkeleton className="h-8 w-64 mx-auto" />
          <LoadingSkeleton className="h-4 w-48 mx-auto" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>

        {/* Activity Skeleton */}
        <div className="academic-card p-6 space-y-4">
          <LoadingSkeleton className="h-6 w-32" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <LoadingSkeleton variant="avatar" className="w-8 h-8" />
                <div className="flex-1 space-y-2">
                  <LoadingSkeleton className="h-4 w-1/3" />
                  <LoadingSkeleton className="h-3 w-1/2" />
                </div>
                <LoadingSkeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
