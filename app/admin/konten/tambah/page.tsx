"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createContent } from "@/lib/admin-api"

// Content types
const CONTENT_TYPES = ["blog", "promo", "event", "announcement"]

export default function AddContentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: CONTENT_TYPES[0],
    isActive: true,
    tags: "",
  })
  const [image, setImage] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create FormData object for multipart/form-data
      const contentFormData = new FormData()
      contentFormData.append("title", formData.title)
      contentFormData.append("description", formData.description)
      contentFormData.append("contentType", formData.contentType)
      contentFormData.append("isActive", formData.isActive.toString())

      // Convert tags string to array
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")

      if (tagsArray.length > 0) {
        contentFormData.append("tags", JSON.stringify(tagsArray))
      }

      if (image) {
        contentFormData.append("image", image)
      }

      await createContent(contentFormData)

      toast({
        title: "Berhasil",
        description: "Konten berhasil ditambahkan",
      })

      router.push("/admin/konten")
    } catch (error) {
      console.error("Error creating content:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan konten",
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
          <h2 className="text-2xl font-bold">Tambah Konten</h2>
          <p className="text-gray-500">Tambahkan artikel atau konten baru ke website</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contentType">Tipe Konten</Label>
                  <Select
                    value={formData.contentType}
                    onValueChange={(value) => handleSelectChange("contentType", value)}
                  >
                    <SelectTrigger id="contentType">
                      <SelectValue placeholder="Pilih tipe konten" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="camping, outdoor, tips"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Konten</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={15}
                  placeholder="Tulis konten artikel di sini (mendukung format HTML)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Gambar Thumbnail</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Publikasikan</Label>
                  <p className="text-sm text-gray-500">Konten akan langsung ditampilkan di website</p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                />
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
              "Simpan Konten"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
