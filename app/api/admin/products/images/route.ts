import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' }, { status: 400 });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // If Vercel Blob is configured, upload there (works on Vercel)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blobKey = `uploads/products/${fileName}`;
      const { url } = await put(blobKey, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return NextResponse.json({ 
        url,
        fileName: fileName,
        size: file.size,
        type: file.type
      });
    }

    // Fallback: save to local filesystem (for local dev)
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'products');
    await mkdir(uploadsDir, { recursive: true });
    const filePath = join(uploadsDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    const publicUrl = `/uploads/products/${fileName}`;
    return NextResponse.json({ url: publicUrl, fileName, size: file.size, type: file.type });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}