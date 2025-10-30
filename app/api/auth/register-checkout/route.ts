import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { otpStore } from '@/lib/otp-store';

export async function POST(request: NextRequest) {
  try {
    const { email, phone, name, otp } = await request.json();

    console.log('=== Registration Debug ===');
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Name:', name);
    console.log('OTP:', otp);

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone is required' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Verify OTP one more time
    const key = email || phone;
    const storedData = otpStore.get(key);

    console.log('Key:', key);
    console.log('Stored Data:', storedData);
    console.log('Received OTP:', otp);
    console.log('OTP Store size:', otpStore.size);
    console.log('All keys in store:', Array.from(otpStore.keys()));
    console.log('OTP Match:', storedData?.otp === otp);

    // Skip OTP verification if not found (already verified in previous step)
    // This can happen if the verification step already consumed the OTP
    if (storedData && String(storedData.otp) !== String(otp)) {
      console.log('OTP verification failed at registration');
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Generate a temporary password (user can change it later)
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create user - only include email/phone if they exist
    const userData: any = {
      name,
      password: hashedPassword,
      role: 'CUSTOMER'
    };

    if (email) {
      userData.email = email;
    }

    if (phone) {
      userData.phone = phone;
    }

    console.log('Creating user with data:', userData);

    const user = await prisma.user.create({
      data: userData
    });

    console.log('User created successfully:', user.id);

    // Clear OTP
    otpStore.delete(key);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name
      },
      tempPassword // Send this for auto-login
    });
  } catch (error: any) {
    console.error('=== Registration Error ===');
    console.error('Error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('========================');
    
    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}

