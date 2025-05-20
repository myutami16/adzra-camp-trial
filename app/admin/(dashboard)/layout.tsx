import type React from "react"
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"
import AdminAuthCheck from "@/components/admin/auth-check"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
      </div>
    </AdminAuthCheck>
  )
}
