import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Fallback resources for when database is unavailable
const fallbackResources = [
  {
    id: "1",
    title: "Statistics Fundamentals",
    description: "Master the core concepts of statistics",
    category: "Statistics",
    price: 29.99,
    featured: true,
    pdfUrl: "/pdfs/stats-fundamentals.pdf",
    imageUrl: "/images/stats-preview.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Calculus Complete Guide",
    description: "Everything you need about calculus",
    category: "Mathematics",
    price: 39.99,
    featured: true,
    pdfUrl: "/pdfs/calculus-guide.pdf",
    imageUrl: "/images/calculus-preview.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Linear Algebra Basics",
    description: "Learn linear algebra fundamentals",
    category: "Mathematics",
    price: 24.99,
    featured: false,
    pdfUrl: "/pdfs/linear-algebra.pdf",
    imageUrl: "/images/linear-preview.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    // Return fallback data when database is unavailable
    return NextResponse.json(fallbackResources);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, price, category, fileUrl, previewUrl, featured } = await req.json();

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        fileUrl: fileUrl || null,
        previewUrl: previewUrl || null,
        featured: featured || false,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
