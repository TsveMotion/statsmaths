import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has purchased this resource
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_resourceId: {
          userId: user.id,
          resourceId: params.resourceId,
        },
      },
      include: {
        resource: true,
      },
    });

    if (!purchase || purchase.paymentStatus !== "completed") {
      return NextResponse.json(
        { error: "Resource not purchased" },
        { status: 403 }
      );
    }

    if (!purchase.resource.fileUrl) {
      return NextResponse.json(
        { error: "No file available for this resource" },
        { status: 404 }
      );
    }

    // In production, you would fetch the file from cloud storage (S3, etc.)
    // For now, we'll return a response indicating where the file would be
    // You'll need to implement actual file storage and retrieval

    // Example for production with S3:
    // const fileUrl = purchase.resource.fileUrl;
    // const response = await fetch(fileUrl);
    // const blob = await response.blob();
    // return new NextResponse(blob, {
    //   headers: {
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': `attachment; filename="${purchase.resource.title}.pdf"`,
    //   },
    // });

    // Temporary response for development
    return NextResponse.json({
      message: "File download endpoint ready",
      fileUrl: purchase.resource.fileUrl,
      resourceTitle: purchase.resource.title,
      note: "Implement file storage integration (S3/Cloud Storage) for production"
    });

  } catch (error) {
    console.error("Error downloading resource:", error);
    return NextResponse.json(
      { error: "Failed to download resource" },
      { status: 500 }
    );
  }
}
