"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchAdmins, deleteAdmin } from "@/lib/admin-api"
import { formatDate } from "@/lib/utils"
import { getUserFromCookie } from "@/lib/auth"
import DeleteAdminDialog from "@/components/admin/delete-admin-dialog"

interface Admin {
  id: number
  name: string
  username: string
  role: string
  createdAt: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id?: number; role?: string } | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null)

  useEffect(() => {
    const user = getUserFromCookie()
    setCurrentUser(user)

    if (user?.role !== "super-admin") {
      toast({
        title: "Akses Ditolak",
        description: "Anda tidak memiliki akses ke halaman ini",
        variant: "destructive",
      })
      router.push("/admin/dashboard")
      return
    }

    fetchAdminData()
  }, [router, toast])

  const fetchAdminData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchAdmins()
      setAdmins(data || [])
    } catch (error) {
      console.error("Error fetching admins:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data admin",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (id: number) => {
    setAdminToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return

    try {
      await deleteAdmin(adminToDelete)
      setAdmins(admins.filter((admin) => admin.id !== adminToDelete))
      toast({
        title: "Berhasil",
        description: "Admin telah dihapus",
      })
    } catch (error) {
      console.error("Error deleting admin:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus admin",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setAdminToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Admin</h2>
          <p className="text-gray-500">Kelola pengguna dengan akses admin</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/tambah">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Admin
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary-dark" />
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center p-8 text-gray-500">Belum ada data admin</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.username}</TableCell>
                  <TableCell>
                    <Badge variant={admin.role === "super-admin" ? "default" : "outline"}>
                      {admin.role === "super-admin" ? "Super Admin" : "Admin"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(admin.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/admin/users/edit/${admin.id}`)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {admin.id !== currentUser?.id && (
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(admin.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <DeleteAdminDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={handleDeleteConfirm} />
    </div>
  )
}
