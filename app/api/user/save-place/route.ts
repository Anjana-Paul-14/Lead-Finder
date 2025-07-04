// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/lib/connectDB";
// import User from "@/models/User";
// import { getToken } from "next-auth/jwt";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//     if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();
//     const { place } = body;

//     const user = await User.findOne({ email: token.email });
//     if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

//     user.savedPlaces.push(place);
//     await user.save();

//     return NextResponse.json({ message: "Place saved" }, { status: 200 });
//   } catch (error) {
//     console.error("Save place error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get the JWT token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const { places } = body;

    if (!Array.isArray(places) || places.length === 0) {
      return NextResponse.json({ error: "Invalid or empty place list" }, { status: 400 });
    }

    // Find the user by email from token
    const user = await User.findOne({ email: token.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Filter and add only new places to avoid duplicates by place_id
    const existingPlaceIds = user.savedPlaces.map(p => p.place_id);
    const newPlaces = places.filter(p => !existingPlaceIds.includes(p.place_id));
    user.savedPlaces.push(...newPlaces);

    // Save the updated user
    await user.save();

    return NextResponse.json({ message: "Places saved successfully", count: newPlaces.length }, { status: 200 });
  } catch (error) {
    console.error("Save place error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
