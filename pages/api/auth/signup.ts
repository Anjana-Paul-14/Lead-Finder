// import connectDB from "@/lib/mongodb"
// import User from "@/models/User"
// import bcrypt from "bcryptjs"

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).end()

//   const { name, email, password } = req.body

//   try {
//     await connectDB()

//     const existingUser = await User.findOne({ email })
//     if (existingUser) return res.status(400).json({ error: "User already exists" })

//     const hashedPassword = await bcrypt.hash(password, 10)

//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     })

//     return res.status(201).json({ message: "User created", user: newUser._id })
//   } catch (err) {
//     console.error(err)
//     return res.status(500).json({ error: "Server error" })
//   }
// }

import User from "@/models/User"
import connectDB from "@/lib/connectDB"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
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
