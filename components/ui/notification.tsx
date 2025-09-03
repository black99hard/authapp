"use client"

import { useState, useEffect } from "react"
import { X, Smartphone, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface NotificationProps {
  show: boolean
  onClose: () => void
  title: string
  message: string
  code?: string
  duration?: number
}

export function Notification({ show, onClose, title, message, code, duration = 5000 }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setTimeout(() => setIsAnimating(true), 50)

      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose()
        }, duration)
        return () => clearTimeout(timer)
      }
    }
  }, [show, duration])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 300)
  }

  const handleCopyCode = async () => {
    if (!code) return

    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/20 transition-opacity duration-300",
          isAnimating ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Notification */}
      <div
        className={cn(
          "absolute top-4 left-4 right-4 mx-auto max-w-sm pointer-events-auto",
          "transform transition-all duration-300 ease-out",
          isAnimating ? "translate-y-0 opacity-100 scale-100" : "-translate-y-full opacity-0 scale-95",
        )}
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-university-gold to-university-gold/90 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1 rounded-full">
                  <Smartphone className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-medium text-sm">SMS Message</span>
              </div>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-university-green/10 p-2 rounded-full flex-shrink-0">
                <Smartphone className="h-5 w-5 text-university-green" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
                <p className="text-gray-600 text-sm mt-1">{message}</p>
                {code && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border-l-4 border-university-green">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-500">Verification Code:</p>
                      <button
                        onClick={handleCopyCode}
                        className={cn(
                          "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200",
                          isCopied ? "bg-university-green text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300",
                        )}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-mono font-bold text-lg text-gray-900 tracking-wider">{code}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-right">
              <span className="text-xs text-gray-400">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
