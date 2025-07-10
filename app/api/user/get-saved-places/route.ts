// import { NextRequest, NextResponse, } from "next/server";
// import connectDB from "@/lib/connectDB";
// import User from "@/models/User";
// import { getToken } from "next-auth/jwt";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth"; 


// export async function GET(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//     if (!session?.user?.email) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     await connectDB();
//     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//     if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = await User.findOne({ email: token.email });
//     if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

//     return NextResponse.json({ savedPlaces: user.savedPlaces });
//   } catch (error) {
//     console.error("Fetch saved places error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
// apps/v4/app/api/user/get-saved-places/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ savedPlaces: user.savedPlaces || [] });
  } catch (error) {
    console.error("Error fetching saved places:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}