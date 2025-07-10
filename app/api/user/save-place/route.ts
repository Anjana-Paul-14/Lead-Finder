// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/lib/connectDB";
// import User from "@/models/User";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const { email, places } = body;

//     if (!email || !places || !Array.isArray(places)) {
//       return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const existingPlaceIds = new Set(user.savedPlaces.map((p: any) => p.place_id));

//     const newPlaces = places.filter((place: any) => !existingPlaceIds.has(place.place_id));

//     if (newPlaces.length === 0) {
//       return NextResponse.json({ message: "No new places to save" });
//     }

//     user.savedPlaces.push(...newPlaces);
//     await user.save();

//     return NextResponse.json({ message: "Places saved successfully" });
//   } catch (error) {
//     console.error("Error saving all places:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
// apps/v4/app/api/user/save-place/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, places } = body;

    if (!email || !places || !Array.isArray(places)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent duplicates
    const newPlaces = places.filter(place => 
      !user.savedPlaces.some((saved: any) => saved.place_id === place.place_id)
    );

    if (newPlaces.length === 0) {
      return NextResponse.json({ message: "No new places to save" });
    }

    user.savedPlaces.push(...newPlaces);
    await user.save();

    return NextResponse.json({ message: "Places saved successfully" });
  } catch (error) {
    console.error("Error saving places:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}