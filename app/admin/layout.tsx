import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Admin Dashboard - Adzra Camp",
  description: "Admin dashboard for Adzra Camp website",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  )
}
