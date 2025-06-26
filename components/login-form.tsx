"use client"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { useRouter } from "next/navigation"
import {  useState } from "react"
import axios from "axios"

export function LoginForm({
  className,
  imageUrl,
  ...props
}: React.ComponentProps<"div"> & {
  imageUrl?: string
}) 
{
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")  
      const [password, setPassword] = useState("")
      const [error, setError] = useState<string | null>(null)


//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   setLoading(true)
//     setError(null)

//   try{
//     // setLoading(true);
//     const response = await fetch("/api/login/router", { email, password})
// console.log("login success:", response.data);
//     router.push("/map"); 

//   }catch (error: any) {
//     console.error("Login error:", error.response?.data || error.message);
//     alert(error.response?.data?.error || "Login failed");
//   }
//   finally {
//     setLoading(false);
//   }
// //   console.log("firstttttt");
// // router.push("/map");
//   // setTimeout(() => {
//   //   setLoading(false);
//   //   startTransition(() => {
//   //     router.push("/map");
//   //   });
//   // }, 1000);
// };
  
// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault()
//   setLoading(true)
//   const email = e.currentTarget.email.value
//   const password = e.currentTarget.password.value

//   try {
//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     })

//     const data = await res.json() // <-- crashing here if server returns HTML

//     if (!res.ok) {
//       throw new Error(data?.error || "Login failed")
//     }

//     router.push("/map")
//   } catch (err: any) {
//     alert(err.message || "Something went wrong")
//     setLoading(false)
//   }
// }
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('/api/login/router', { email, password })
      
      if (response.status === 200) {
        router.push("/map")
      } else {
        setError(response.data.error || "Login failed")
      }
    } // Replace the catch block in handleSubmit
catch (error) {
  console.error("Signup error:", error);
  if (axios.isAxiosError(error) && error.response) {
    setError(error.response.data.error || "Signup failed");
  } else if (error instanceof Error) {
    setError(error.message);
  } else {
    setError("An unexpected error occurred");
  }
} finally {
  setLoading(false);
}

}

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" 
                type="password" 
                required 
                onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              
              <Button type="submit" 
              className="w-full" 
              disabled={loading}>
                {/* Login */}
                {loading ? "Logging in..." : "Login"}
              </Button>
              
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="bg-primary/50 relative hidden md:block">
            {imageUrl && (
              <Image
                fill
                src={imageUrl}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )


}
