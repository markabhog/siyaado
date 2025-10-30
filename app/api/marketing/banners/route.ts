import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key') || undefined;
  const active = searchParams.get('active');
  const where: any = {};
  if (key) where.key = key;
  if (active != null) where.active = active === 'true';
  const now = new Date();
  where.OR = [
    { endsAt: null },
    { endsAt: { gt: now } },
  ];
  const banners = await prisma.banner.findMany({
    where,
    orderBy: [{ startsAt: 'desc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json({ banners });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Remove id from body if present (it will be auto-generated)
    const { id, ...dataWithoutId } = body;
    
    const banner = await prisma.banner.create({ 
      data: dataWithoutId 
    });
    
    return NextResponse.json({ banner }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create banner' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }
    
    const { id, ...updateData } = body;
    const banner = await prisma.banner.update({ 
      where: { id }, 
      data: updateData 
    });
    
    return NextResponse.json({ banner });
  } catch (error: any) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await prisma.banner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


