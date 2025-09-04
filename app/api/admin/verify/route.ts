import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "your-secret-key"
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token.value, secret);
      return NextResponse.json({ 
        authenticated: true, 
        username: payload.username 
      });
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
