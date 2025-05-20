"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { login, getToken } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(username, password)

      // Verify that the token was actually set
      const token = getToken()
      if (!token) {
        throw new Error("Login berhasil tetapi token tidak tersimpan. Silakan coba lagi.")
      }

      // Add a success message
      console.log("Login successful, token set:", token)

      // Redirect to admin dashboard
      router.push("/admin/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Login gagal. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-24 h-24 mb-4">
            <Image src="/images/logo.png" alt="Adzra Camp Logo" width={100} height={100} className="w-full h-full" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Masuk ke dashboard admin Adzra Camp</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500 text-center w-full">
            Hanya untuk admin Adzra Camp. Jika Anda bukan admin, silakan kembali ke{" "}
            <a href="/" className="text-primary-dark hover:underline">
              halaman utama
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
