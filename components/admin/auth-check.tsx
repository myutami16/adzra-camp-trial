"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { verifyToken, getToken, setToken, setUser } from "@/lib/auth"

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists
        const token = getToken()

        if (!token) {
          // In development, we can use a mock token for testing
          if (process.env.NODE_ENV === "development") {
            console.warn("No auth token found, using mock authentication for development")
            const mockToken = "mock-dev-token"
            const mockUser = {
              id: 1,
              name: "Admin User",
              username: "admin",
              role: "super-admin",
            }

            setToken(mockToken)
            setUser(mockUser)
            setIsAuthenticated(true)
            setIsLoading(false)
            return
          } else {
            // Redirect to login
            toast({
              title: "Silakan login terlebih dahulu",
              description: "Anda belum login atau sesi telah berakhir",
              variant: "destructive",
            })
            router.push("/admin/login")
            return
          }
        }

        const isValid = await verifyToken()

        if (isValid) {
          setIsAuthenticated(true)
        } else {
          // Redirect to login if token is invalid
          toast({
            title: "Sesi telah berakhir",
            description: "Silakan login kembali",
            variant: "destructive",
          })
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-dark" />
        <span className="ml-2">Memeriksa autentikasi...</span>
      </div>
    )
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>
  }

  // This should not be visible as we redirect in the useEffect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary-dark" />
      <span className="ml-2">Redirecting to login...</span>
    </div>
  )
}
