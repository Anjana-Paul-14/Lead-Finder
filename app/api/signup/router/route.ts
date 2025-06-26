
import User from "@/models/User"
import connectDB from "@/lib/connectDB"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("Request body:", body); // ✅ log request

    const { name, email, password } = body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User created successfully", userId: newUser._id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err); // ✅ detailed logging
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
