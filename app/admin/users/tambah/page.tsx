"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createAdmin } from "@/lib/admin-api"
import { getUserFromCookie } from "@/lib/auth"

export default function AddAdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "admin",
  })

  useEffect(() => {
    const user = getUserFromCookie()

    if (user?.role !== "super-admin") {
      toast({
        title: "Akses Ditolak",
        description: "Anda tidak memiliki akses ke halaman ini",
        variant: "destructive",
      })
      router.push("/admin/dashboard")
    }
  }, [router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, role: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createAdmin(formData)

      toast({
        title: "Berhasil",
        description: "Admin baru berhasil ditambahkan",
      })

      router.push("/admin/users")
    } catch (error) {
      console.error("Error creating admin:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan admin",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Tambah Admin</h2>
          <p className="text-gray-500">Tambahkan pengguna admin baru</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleSelectChange}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()} className="mr-2">
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Admin"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
