import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json();
  const productIds = (body?.productIds as string[]) || [];
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ ok: false }, { status: 404 });

  for (const pid of productIds) {
    await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: user.id, productId: pid } },
      create: { userId: user.id, productId: pid },
      update: {},
    });
  }
  return NextResponse.json({ ok: true });
}


