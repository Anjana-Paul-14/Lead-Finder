"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import axios from "axios"


export function SignUp({
  className,
  imageUrl,
  ...props
}: React.ComponentProps<"div"> & {
  imageUrl?: string
}) {

    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")  
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)


  //   const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
  //       e.preventDefault();
  // setLoading(true);

  // router.push("/")
  //   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault()
//   setLoading(true)
//   const name = e.currentTarget.name.value
//   const email = e.currentTarget.email.value
//   const password = e.currentTarget.password.value

//   const res = await fetch("/api/auth/signup", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name, email, password }),
//   })

//   const data = await res.json()

//   if (res.ok) {
//     router.push("/")
//   } else {
//     alert(data.error || "Something went wrong")
//     setLoading(false)
//   }
// }

// const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();

//   const response = await axios.post('/api/auth/signup', {name, email, password})
//   console.log(response)
//   // setLoading(true);
// }


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError(null)

    const response = await axios.post('/api/signup/router', { name, email, password });
    console.log("Signup success:", response.data);

    // router.push("/")
    if (response.status === 201) {
        router.push("/")
      } else {
        setError(response.data.error || "Signup failed")
      }

  } catch  (err: any) {
    setError(
        err.response?.data?.error || 
        "An error occurred during signup"
      )
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="name"
                      placeholder="Name"
                      required
                      onChange={(e) => setName(e.target.value)}
                    />
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
                <Label htmlFor="password">Password</Label>
                <Input id="password" 
                type="password" 
                required  
                onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
                  <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Sign up"}
              </Button>
                  
                  <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/" className="underline underline-offset-4">
                  Login
                </Link>
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
            By clicking continue, you agree to our <Link href="#">Terms of Service</Link>{" "}
            and <Link href="#">Privacy Policy</Link>.
          </div>
        </div>
  )
}
