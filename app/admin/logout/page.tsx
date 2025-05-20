"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { logout } from "@/lib/auth"

export default function LogoutPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()

        toast({
          title: "Berhasil Logout",
          description: "Anda telah keluar dari sistem",
        })
      } catch (error) {
        console.error("Logout error:", error)
      } finally {
        // Redirect to login page regardless of success/failure
        router.push("/admin/login")
      }
    }

    performLogout()
  }, [router, toast])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary-dark mb-4" />
      <p>Logging out...</p>
    </div>
  )
}
