import { NextRequest, NextResponse } from 'next/server';
import { otpStore } from '@/lib/otp-store';

export async function POST(request: NextRequest) {
  try {
    const { email, phone, otp } = await request.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone is required' },
        { status: 400 }
      );
    }

    if (!otp) {
      return NextResponse.json(
        { error: 'OTP is required' },
        { status: 400 }
      );
    }

    const key = email || phone;
    const storedData = otpStore.get(key);

    // Debug logging
    console.log('=== OTP Verification Debug ===');
    console.log('Key:', key);
    console.log('Stored Data:', storedData);
    console.log('Received OTP:', otp, 'Type:', typeof otp);
    console.log('Stored OTP:', storedData?.otp, 'Type:', typeof storedData?.otp);
    console.log('OTP Store size:', otpStore.size);
    console.log('All keys in store:', Array.from(otpStore.keys()));
    console.log('============================');

    if (!storedData) {
      return NextResponse.json(
        { error: 'OTP not found or expired' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(key);
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Verify OTP - convert both to strings for comparison
    if (String(storedData.otp) !== String(otp)) {
      console.log('OTP MISMATCH:', String(storedData.otp), '!==', String(otp));
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // OTP is valid - keep it for registration
    // Don't delete yet, we'll need it for registration

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}

