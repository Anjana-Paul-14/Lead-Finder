import connectDB from "@/lib/connectDB"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: "Login successful", userId: user._id },
      { status: 200 }
    )
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}