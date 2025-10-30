import { NextRequest, NextResponse } from 'next/server';
import { otpStore, generateOTP } from '@/lib/otp-store';

export async function POST(request: NextRequest) {
  try {
    const { email, phone } = await request.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone is required' },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const key = email || phone;
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(key, { otp, expiresAt });

    // Verify it was stored
    const verification = otpStore.get(key);
    console.log('=== OTP Send Debug ===');
    console.log(`Key: ${key}`);
    console.log(`OTP: ${otp}`);
    console.log(`Store size: ${otpStore.size}`);
    console.log(`Verification: ${JSON.stringify(verification)}`);
    console.log(`All keys: ${Array.from(otpStore.keys()).join(', ')}`);
    console.log('====================');

    // TODO: Integrate with email/SMS service
    // if (email) {
    //   await sendEmail(email, 'Your OTP Code', `Your verification code is: ${otp}`);
    // } else if (phone) {
    //   await sendSMS(phone, `Your verification code is: ${otp}`);
    // }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // In development, return OTP (remove in production!)
      ...(process.env.NODE_ENV === 'development' && { otp })
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}

