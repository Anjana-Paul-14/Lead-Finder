// import User from "@/models/User"
// import connectDB from "@/lib/connectDB"
// import bcrypt from "bcryptjs"
// import { NextResponse, NextRequest } from "next/server"

// // export async function POST(req: Request) {
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const body = await req.json();
//     console.log("Request body:", body); // ✅ log request

//     const { name, email, password } = body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return NextResponse.json({ error: "User already exists" }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     return NextResponse.json(
//       { message: "User created successfully", userId: newUser._id },
//       { status: 201 }
//     );
//   } catch (err) {
//     console.error("Signup error:", err); // ✅ detailed logging
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
// app/api/signup/router/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    console.log("⏳ Connecting to DB...");
    await connectDB();

    const body = await req.json();
    const { name, email, password } = body;
    console.log("📥 Received data:", body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists");
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    console.log("✅ User created:", newUser._id);

    return NextResponse.json({ message: "User created", userId: newUser._id }, { status: 201 });
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
