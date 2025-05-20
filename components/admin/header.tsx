"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Bell, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getUserFromCookie } from "@/lib/auth"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminHeader() {
  const pathname = usePathname()
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null)

  useEffect(() => {
    const currentUser = getUserFromCookie()
    setUser(currentUser)
  }, [])

  // Get page title from pathname
  const getPageTitle = () => {
    const path = pathname.split("/").pop()

    switch (path) {
      case "dashboard":
        return "Dashboard"
      case "produk":
        return "Manajemen Produk"
      case "konten":
        return "Manajemen Konten"
      case "users":
        return "Manajemen Admin"
      case "settings":
        return "Pengaturan"
      default:
        if (pathname.includes("/produk/")) return "Detail Produk"
        if (pathname.includes("/konten/")) return "Detail Konten"
        return "Admin Panel"
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{getPageTitle()}</h1>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary-dark text-white">{user?.name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "Admin"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.role === "super-admin" ? "Super Admin" : "Admin"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href="/admin/logout" className="flex w-full">
                  Logout
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
