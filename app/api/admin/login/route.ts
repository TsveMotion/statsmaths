import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "your-secret-key"
);

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Check against environment variables
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Create JWT token
      const token = await new SignJWT({ 
        username, 
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);

      // Set cookie
      (await cookies()).set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
