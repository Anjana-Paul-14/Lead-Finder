import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { email, password } = req.body

  try {
    await connectDB()

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: "Invalid email or password" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" })

    return res.status(200).json({ message: "Login success", user: user._id })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
}
