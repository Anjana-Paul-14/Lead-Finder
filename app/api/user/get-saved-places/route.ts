import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await User.findOne({ email: token.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ savedPlaces: user.savedPlaces });
  } catch (error) {
    console.error("Fetch saved places error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
