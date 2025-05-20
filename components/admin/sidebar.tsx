"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, FileText, Users, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { getUserFromCookie } from "@/lib/auth"

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  adminOnly?: boolean
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<{ role?: string } | null>(null)

  useEffect(() => {
    const currentUser = getUserFromCookie()
    setUser(currentUser)
  }, [])

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Produk",
      href: "/admin/produk",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Konten",
      href: "/admin/konten",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Admin",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      adminOnly: true,
    },
    {
      title: "Pengaturan",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const filteredItems = sidebarItems.filter((item) => !item.adminOnly || user?.role === "super-admin")

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-center p-4 border-b border-gray-200">
        {collapsed ? (
          <div className="w-8 h-8 relative">
            <Image src="/images/logo.png" alt="Adzra Camp Logo" fill className="object-contain" />
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <Image src="/images/logo.png" alt="Adzra Camp Logo" width={100} height={100} className="h-12 w-auto" />
          </div>
        )}
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {filteredItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href ? "bg-primary-light/10 text-primary-dark" : "text-gray-600 hover:bg-gray-100",
              )}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Link href="/admin/logout">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50",
              collapsed && "justify-center",
            )}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </Link>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="absolute top-20 -right-3 h-6 w-6 rounded-full border border-gray-200 bg-white p-0"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  )
}
