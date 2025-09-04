import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const featuredResources = await prisma.resource.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return NextResponse.json(featuredResources);
  } catch (error: any) {
    console.error("Error fetching featured resources:", error);
    
    // Return empty array when database is unavailable
    // This allows the app to work with mock data
    if (error.code === 'P2010' || error.message?.includes('timeout')) {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
