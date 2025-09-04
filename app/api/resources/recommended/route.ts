import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    let userPurchases: { resourceId: string }[] = [];
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (user) {
        userPurchases = await prisma.purchase.findMany({
          where: { userId: user.id },
          select: { resourceId: true },
        });
      }
    }

    const purchasedIds = userPurchases.map((p: { resourceId: string }) => p.resourceId);

    // Get featured resources that the user hasn't purchased
    const recommendedResources = await prisma.resource.findMany({
      where: {
        id: { notIn: purchasedIds },
        featured: true,
      },
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
    });

    // If not enough featured, get regular resources
    if (recommendedResources.length < 6) {
      const additionalResources = await prisma.resource.findMany({
        where: {
          id: { notIn: [...purchasedIds, ...recommendedResources.map((r: { id: string }) => r.id)] },
          featured: false,
        },
        take: 6 - recommendedResources.length,
        orderBy: {
          createdAt: "desc",
        },
      });
      recommendedResources.push(...additionalResources);
    }

    return NextResponse.json(recommendedResources);
  } catch (error) {
    console.error("Error fetching recommended resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommended resources" },
      { status: 500 }
    );
  }
}
