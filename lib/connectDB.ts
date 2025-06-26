// import connectDB from "@/lib/mongodb"
// import mongoose from "mongoose"
// import User from "@/models/User"
// import bcrypt from "bcryptjs"

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).end()

//   const { email, password } = req.body

//   try {
//     await connectDB()

//     const user = await User.findOne({ email })
//     if (!user) {
//       return res.status(400).json({ error: "User not found" })
//     }

//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid password" })
//     }

//     return res.status(200).json({ message: "Login successful", user: user._id })
//   } catch (err) {
//     console.error("Login error:", err)
//     return res.status(500).json({ error: "Server error" })
//   }
// }

// import mongoose from "mongoose"


// const connectDB = async () => {
//     try{
//         // await mongoose.connect(process.env.MONGODB_URI)
//         // console.log("Connected to DB")
//         const uri = process.env.MONGODB_URI;
//         if (!uri) throw new Error("MONGODB_URI is not defined");
//         await mongoose.connect(uri);
//         console.log("Connected to DB");

//     } catch (err) {
//         console.error("DB connection error:", err);
//         throw err;
//     }
// }
// export default connectDB;

// lib/connectDB.ts
import mongoose from "mongoose";

const connection: { isConnected?: boolean } = {};

async function connectDB() {
  if (connection.isConnected) return;
  
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI not defined");
    
    const db = await mongoose.connect(uri);
    // connection.isConnected = db.connections[0].readyState;
    connection.isConnected = db.connections[0].readyState === 1;
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection error:", err);
    throw err;
  }
}

export default connectDB;