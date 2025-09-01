import bcrypt from "bcryptjs"
import crypto from "crypto"

export interface User {
  id: string
  username: string
  email: string
  phone: string
  passwordHash: string
  createdAt: Date
}

export interface OTPSession {
  userId: string
  otp: string
  expiresAt: Date
  attempts: number
}

export interface LoginAttempt {
  timestamp: Date
  success: boolean
  ipAddress?: string
  userAgent?: string
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  trustedDevices: string[]
  sessionTimeout: number
  loginNotifications: boolean
}

// In-memory storage for prototype
const users: Map<string, User> = new Map()
const otpSessions: Map<string, OTPSession> = new Map()
const loginAttempts: Map<string, LoginAttempt[]> = new Map()
const accountLockouts: Map<string, Date> = new Map()
const securitySettings: Map<string, SecuritySettings> = new Map()

export class AuthService {
  // Generate a random 6-digit OTP
  static generateOTP(): string {
     return Math.floor(100000 + Math.random() * 900000).toString()
    // return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Hash password using bcrypt
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  // Verify password
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  // Register new user
  static async registerUser(
    username: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<{ success: boolean; message: string; userId?: string }> {
    // Check if user already exists
    const existingUser = Array.from(users.values()).find(
      (user) => user.username === username || user.email === email || user.phone === phone,
    )

    if (existingUser) {
      return { success: false, message: "User already exists with this username, email, or phone" }
    }

    // Create new user
    const userId = crypto.randomUUID()
    const passwordHash = await this.hashPassword(password)

    const newUser: User = {
      id: userId,
      username,
      email,
      phone,
      passwordHash,
      createdAt: new Date(),
    }

    users.set(userId, newUser)
    return { success: true, message: "User registered successfully", userId }
  }

  // Login user
  static async loginUser(
    username: string,
    password: string,
    deviceInfo?: { ipAddress?: string; userAgent?: string },
  ): Promise<{ success: boolean; message: string; userId?: string; isLocked?: boolean }> {
    const user = Array.from(users.values()).find((u) => u.username === username)

    if (!user) {
      return { success: false, message: "Invalid username or password" }
    }

    // Check if account is locked
    const lockoutTime = accountLockouts.get(user.id)
    if (lockoutTime && new Date() < lockoutTime) {
      const remainingMinutes = Math.ceil((lockoutTime.getTime() - Date.now()) / (1000 * 60))
      return {
        success: false,
        message: `Account locked. Try again in ${remainingMinutes} minutes.`,
        isLocked: true,
      }
    }

    const isValidPassword = await this.verifyPassword(password, user.passwordHash)

    // Record login attempt
    const attempt: LoginAttempt = {
      timestamp: new Date(),
      success: isValidPassword,
      ipAddress: deviceInfo?.ipAddress,
      userAgent: deviceInfo?.userAgent,
    }

    const userAttempts = loginAttempts.get(user.id) || []
    userAttempts.push(attempt)
    loginAttempts.set(user.id, userAttempts.slice(-10)) // Keep last 10 attempts

    if (!isValidPassword) {
      // Check for account lockout (5 failed attempts in 15 minutes)
      const recentFailures = userAttempts.filter(
        (a) => !a.success && new Date().getTime() - a.timestamp.getTime() < 15 * 60 * 1000,
      )

      if (recentFailures.length >= 5) {
        accountLockouts.set(user.id, new Date(Date.now() + 30 * 60 * 1000)) // Lock for 30 minutes
        return {
          success: false,
          message: "Too many failed attempts. Account locked for 30 minutes.",
          isLocked: true,
        }
      }

      return { success: false, message: "Invalid username or password" }
    }

    // Clear lockout on successful login
    accountLockouts.delete(user.id)

    return { success: true, message: "Login successful", userId: user.id }
  }

  // Generate and store OTP for user
  static generateOTPForUser(userId: string): { otp: string; expiresAt: Date } {
    const otp = this.generateOTP()
    const expiresAt = new Date(Date.now() + 60 * 1000) // 60 seconds from now

    otpSessions.set(userId, {
      userId,
      otp,
      expiresAt,
      attempts: 0,
    })

    // For prototype: log OTP to console
    console.log(`[2FA Prototype] OTP for user ${userId}: ${otp}`)

    return { otp, expiresAt }
  }

  // Verify OTP
  static verifyOTP(userId: string, inputOTP: string): { success: boolean; message: string } {
    const session = otpSessions.get(userId)

    if (!session) {
      return { success: false, message: "No OTP session found. Please request a new OTP." }
    }

    // Check if OTP is expired
    if (new Date() > session.expiresAt) {
      otpSessions.delete(userId)
      return { success: false, message: "OTP has expired. Please request a new one." }
    }

    // Increment attempts
    session.attempts++

    // Check if too many attempts
    if (session.attempts > 3) {
      otpSessions.delete(userId)
      return { success: false, message: "Too many failed attempts. Please request a new OTP." }
    }

    // Verify OTP
    if (session.otp !== inputOTP) {
      return { success: false, message: "Invalid OTP. Please try again." }
    }

    // Success - clean up session
    otpSessions.delete(userId)
    return { success: true, message: "OTP verified successfully" }
  }

  // Get user by ID
  static getUser(userId: string): User | undefined {
    return users.get(userId)
  }

  // Get remaining OTP time
  static getOTPTimeRemaining(userId: string): number {
    const session = otpSessions.get(userId)
    if (!session) return 0

    const remaining = session.expiresAt.getTime() - Date.now()
    return Math.max(0, Math.floor(remaining / 1000))
  }

  // Get login history
  static getLoginHistory(userId: string): LoginAttempt[] {
    return loginAttempts.get(userId) || []
  }

  // Get security settings
  static getSecuritySettings(userId: string): SecuritySettings {
    return (
      securitySettings.get(userId) || {
        twoFactorEnabled: true,
        trustedDevices: [],
        sessionTimeout: 30,
        loginNotifications: true,
      }
    )
  }

  // Update security settings
  static updateSecuritySettings(userId: string, settings: Partial<SecuritySettings>): void {
    const current = this.getSecuritySettings(userId)
    securitySettings.set(userId, { ...current, ...settings })
  }
}
