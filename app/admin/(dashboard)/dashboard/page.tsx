"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FileText, Users, Loader2 } from "lucide-react"
import { fetchAdminStats } from "@/lib/api"
import { getUserFromCookie } from "@/lib/auth"

interface Stats {
  productCount: number
  contentCount: number
  userCount?: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ role?: string } | null>(null)

  useEffect(() => {
    const currentUser = getUserFromCookie()
    setUser(currentUser)

    const fetchStats = async () => {
      try {
        console.log("Fetching admin stats...")
        const data = await fetchAdminStats()
        console.log("Admin stats received:", data)

        // Ensure we have valid numbers for the stats
        const processedStats = {
          productCount: typeof data.productCount === "number" ? data.productCount : 0,
          contentCount: typeof data.contentCount === "number" ? data.contentCount : 0,
          userCount: typeof data.userCount === "number" ? data.userCount : 0,
        }

        console.log("Processed stats:", processedStats)
        setStats(processedStats)
        setError(null)
      } catch (error) {
        console.error("Error fetching stats:", error)
        setError("Failed to load dashboard statistics. Please try again later.")

        // Set fallback stats
        setStats({
          productCount: 0,
          contentCount: 0,
          userCount: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch stats if we have a user
    if (currentUser) {
      fetchStats()
    } else {
      setIsLoading(false)
      setError("Authentication required. Please log in.")
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Selamat Datang di Dashboard Admin</h2>
        <p className="text-gray-500">Kelola produk, konten, dan pengguna Adzra Camp</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.productCount || 0}</div>
                <p className="text-xs text-gray-500 mt-1">Produk yang tersedia di website</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Konten</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.contentCount || 0}</div>
                <p className="text-xs text-gray-500 mt-1">Artikel dan konten yang dipublikasikan</p>
              </>
            )}
          </CardContent>
        </Card>

        {user?.role === "super-admin" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Admin</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.userCount || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">Pengguna dengan akses admin</p>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-gray-500">Tidak ada aktivitas terbaru</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistik Pengunjung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-gray-500">Data statistik belum tersedia</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
