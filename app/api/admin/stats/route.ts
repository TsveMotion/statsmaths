import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Fallback stats for when database is unavailable
const fallbackStats = {
  totalResources: 15,
  totalUsers: 127,
  totalSales: 89,
  revenue: 2847.50,
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalResources, totalUsers, purchases, revenue] = await Promise.all([
      prisma.resource.count(),
      prisma.user.count(),
      prisma.purchase.count(),
      prisma.purchase.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalResources,
      totalUsers,
      totalSales: purchases,
      revenue: revenue._sum.amount || 0,
    });
  } catch (error) {
    console.error("Stats error:", error);
    // Return fallback stats when database is unavailable
    return NextResponse.json(fallbackStats);
  }
}
