import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalResources, totalUsers, purchases, revenue] = await Promise.all([
      prisma.resource.count(),
      prisma.user.count(),
      prisma.purchase.count({
        where: { paymentStatus: "completed" }
      }),
      prisma.purchase.aggregate({
        where: { paymentStatus: "completed" },
        _sum: { amount: true }
      })
    ]);

    return NextResponse.json({
      totalResources,
      totalUsers,
      totalSales: purchases,
      revenue: revenue._sum.amount || 0,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
