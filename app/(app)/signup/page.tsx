"use client"

import {
  Manrope as FontManrope,
  Lexend as FontSans,
  Newsreader as FontSerif,
} from "next/font/google"
import { cn } from "@/lib/utils"
import { SignUp } from "@/components/sign-up"
import LoginImg from '../../../public/login_img.jpg'
import Image from "next/image"
const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" })
const fontSerif = FontSerif({ subsets: ["latin"], variable: "--font-serif" })
const fontManrope = FontManrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export default function SignUpPage() {
  return (
    <div
      className={cn(
        "bg-muted dark:bg-background flex flex-1 flex-col items-center justify-center gap-16 p-6 md:p-10",
        fontSans.variable,
        fontSerif.variable,
        fontManrope.variable
      )}
      style={{ height:'100vh'}}
    >
      <div className="theme-login-one w-full max-w-sm md:max-w-3xl">
        <SignUp imageUrl={LoginImg.src} />
      </div>

    </div>
  )
}
