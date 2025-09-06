import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fallback data for when database is unavailable
const fallbackResources = [
  {
    id: "1",
    title: "Statistics Fundamentals",
    description: "Master the core concepts of statistics with this comprehensive guide.",
    category: "Statistics",
    price: 29.99,
    featured: true,
    imageUrl: "/images/stats-preview.jpg",
    pdfUrl: "/pdfs/stats-fundamentals.pdf",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Calculus Complete Guide",
    description: "Everything you need to know about calculus in one comprehensive resource.",
    category: "Mathematics",
    price: 39.99,
    featured: true,
    imageUrl: "/images/calculus-preview.jpg",
    pdfUrl: "/pdfs/calculus-guide.pdf",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Linear Algebra Basics",
    description: "Learn the fundamentals of linear algebra with practical examples.",
    category: "Mathematics",
    price: 24.99,
    featured: true,
    imageUrl: "/images/linear-algebra-preview.jpg",
    pdfUrl: "/pdfs/linear-algebra.pdf",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
    // Return fallback data when database is unavailable
    return NextResponse.json(fallbackResources);
  }
}
