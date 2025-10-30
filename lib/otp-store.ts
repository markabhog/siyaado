// Shared OTP store for development
// In production, use Redis or database

// Use global to persist across hot reloads in development
const globalForOTP = global as typeof global & {
  otpStore?: Map<string, { otp: string; expiresAt: number }>;
};

export const otpStore = globalForOTP.otpStore ?? new Map<string, { otp: string; expiresAt: number }>();

if (process.env.NODE_ENV !== 'production') {
  globalForOTP.otpStore = otpStore;
}

// Generate 6-digit OTP
export function generateOTP(): string {
  // For local development, use fixed OTP
  if (process.env.NODE_ENV === 'development') {
    return '111111';
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

