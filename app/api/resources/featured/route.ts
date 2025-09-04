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
  } catch (error) {
    console.error("Error fetching featured resources:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
