"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui';
import { signIn } from 'next-auth/react';

interface AuthStepProps {
  onAuthenticated: (userData: any) => void;
  initialEmail?: string;
  initialPhone?: string;
}

export const AuthStep: React.FC<AuthStepProps> = ({ onAuthenticated, initialEmail, initialPhone }) => {
  const [step, setStep] = useState<'email' | 'password' | 'otp' | 'register'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState(initialEmail || initialPhone || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [phone, setPhone] = useState(initialPhone || '');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Detect if input is email or phone
  const isEmail = (value: string) => {
    return value.includes('@') && value.includes('.');
  };

  // Check if user exists
  const handleCheckUser = async () => {
    if (!emailOrPhone.trim()) {
      setError('Please enter email or phone number');
      return;
    }

    // Determine if it's email or phone
    const inputIsEmail = isEmail(emailOrPhone);
    const emailValue = inputIsEmail ? emailOrPhone : '';
    const phoneValue = inputIsEmail ? '' : emailOrPhone;
    
    // Update state
    setEmail(emailValue);
    setPhone(phoneValue);

    console.log('=== Check User Debug ===');
    console.log('Input:', emailOrPhone);
    console.log('Is Email:', inputIsEmail);
    console.log('Email Value:', emailValue);
    console.log('Phone Value:', phoneValue);
    console.log('======================');

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: emailValue, 
          phone: phoneValue 
        })
      });

      const data = await response.json();

      if (data.exists) {
        setIsExistingUser(true);
        setStep('password');
      } else {
        setIsExistingUser(false);
        setStep('otp');
        // Send OTP with the values we just determined
        await handleSendOTP(emailValue, phoneValue);
      }
    } catch (err) {
      setError('Failed to check user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const handleSendOTP = async (emailVal?: string, phoneVal?: string) => {
    const emailToSend = emailVal || email;
    const phoneToSend = phoneVal || phone;

    console.log('=== Send OTP Debug ===');
    console.log('Email to send:', emailToSend);
    console.log('Phone to send:', phoneToSend);
    console.log('====================');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: emailToSend, 
          phone: phoneToSend 
        })
      });

      if (response.ok) {
        setOtpSent(true);
        setError('');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    }
  };

  // Login existing user
  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        setError('Invalid password. Please try again.');
      } else {
        // Fetch user data
        const userResponse = await fetch('/api/auth/session');
        const userData = await userResponse.json();
        onAuthenticated(userData.user);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and register
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, otp })
      });

      if (response.ok) {
        setStep('register');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Complete registration
  const handleRegister = async () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone,
          name: fullName,
          otp
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Auto-login
        await signIn('credentials', {
          email,
          password: data.tempPassword,
          redirect: false
        });

        onAuthenticated(data.user);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-md mx-auto"
    >
      <AnimatePresence mode="wait">
        {/* Step 1: Email/Phone Entry */}
        {step === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛍️</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Checkout</h2>
              <p className="text-slate-600">Enter your email or phone to continue</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="your@email.com or +252 61 123 4567"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleCheckUser()}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Enter your email address or phone number to continue
                </p>
              </div>

              <Button
                onClick={handleCheckUser}
                disabled={loading || !emailOrPhone.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? 'Checking...' : 'Continue'}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 2a: Password for existing user */}
        {step === 'password' && (
          <motion.div
            key="password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👋</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back!</h2>
              <p className="text-slate-600">Enter your password to continue</p>
              <p className="text-sm text-slate-500 mt-2">{email || phone}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  autoFocus
                />
              </div>

              <Button
                onClick={handleLogin}
                disabled={loading || !password}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <button
                onClick={() => setStep('email')}
                className="w-full text-sm text-blue-600 hover:text-blue-700"
              >
                ← Use a different email/phone
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2b: OTP for new user */}
        {step === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Verify Your Identity</h2>
              <p className="text-slate-600">We've sent a 6-digit code to</p>
              <p className="text-sm font-medium text-slate-900 mt-2">{email || phone}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {error}
              </div>
            )}

            {otpSent && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                ✓ OTP sent successfully! Check your {email ? 'email' : 'phone'}.
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  onKeyPress={(e) => e.key === 'Enter' && otp.length === 6 && handleVerifyOTP()}
                  autoFocus
                />
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <button
                onClick={() => handleSendOTP()}
                className="w-full text-sm text-blue-600 hover:text-blue-700"
                disabled={loading}
              >
                Resend OTP
              </button>

              <button
                onClick={() => setStep('email')}
                className="w-full text-sm text-slate-600 hover:text-slate-700"
              >
                ← Use a different email/phone
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Complete Registration */}
        {step === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Almost Done!</h2>
              <p className="text-slate-600">Just tell us your name to complete your account</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                  autoFocus
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <p className="font-medium mb-1">✓ Your account will be created with:</p>
                <p className="text-xs">{email || phone}</p>
              </div>

              <Button
                onClick={handleRegister}
                disabled={loading || !fullName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? 'Creating Account...' : 'Complete & Continue'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

