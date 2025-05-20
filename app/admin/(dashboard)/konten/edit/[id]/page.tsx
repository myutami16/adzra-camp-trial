"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getContentById, updateContent } from "@/lib/admin-api"
import Link from "next/link"

// Form schema
const formSchema = z.object({
  title: z.string().min(3, { message: "Judul harus minimal 3 karakter" }),
  description: z.string().min(10, { message: "Deskripsi harus minimal 10 karakter" }),
  contentType: z.string(),
  isActive: z.boolean().default(true),
  tags: z.string().optional(),
  image: z.any().optional(), // For file input
})

type FormValues = z.infer<typeof formSchema>

export default function EditContentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      contentType: "article",
      isActive: true,
      tags: "",
      image: undefined,
    },
  })

  // Fetch content data
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const content = await getContentById(params.id)
        console.log("Fetched content:", content)

        if (content) {
          // Set form values
          form.reset({
            title: content.title || "",
            description: content.body || "",
            contentType: content.contentType || "article",
            isActive: content.isActive !== false, // Default to true if not explicitly false
            tags: content.tags ? content.tags.join(", ") : "",
            image: undefined,
          })

          // Set current image
          if (content.thumbnailUrl) {
            setCurrentImage(content.thumbnailUrl)
          }
        } else {
          setError("Konten tidak ditemukan")
        }
      } catch (error) {
        console.error("Error fetching content:", error)
        setError("Gagal memuat data konten")
        toast({
          title: "Error",
          description: "Gagal memuat data konten",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [params.id, form, toast])

  // Handle image change and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("image", file)
      const fileUrl = URL.createObjectURL(file)
      setPreviewUrl(fileUrl)
    }
  }

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSaving(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("description", values.description)
      formData.append("contentType", values.contentType)
      formData.append("isActive", values.isActive.toString())

      // Handle tags
      if (values.tags) {
        const tagsArray = values.tags.split(",").map((tag) => tag.trim())
        formData.append("tags", JSON.stringify(tagsArray))
      }

      // Add image if selected
      if (values.image instanceof File) {
        formData.append("image", values.image)
      }

      console.log("Submitting form data:", Object.fromEntries(formData))
      const response = await updateContent(params.id, formData)
      console.log("Update response:", response)

      toast({
        title: "Berhasil",
        description: "Konten berhasil diperbarui",
      })

      // Redirect back to content list
      router.push("/admin/konten")
    } catch (error) {
      console.error("Error updating content:", error)
      setError("Gagal memperbarui konten")
      toast({
        title: "Error",
        description: "Gagal memperbarui konten",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-dark" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/konten">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold">Edit Konten</h2>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Informasi Konten</CardTitle>
          <CardDescription>Edit informasi konten yang akan ditampilkan di website</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan judul konten" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Masukkan deskripsi konten" className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Konten</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe konten" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="article">Artikel</SelectItem>
                          <SelectItem value="announcement">Pengumuman</SelectItem>
                          <SelectItem value="promotion">Promosi</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="Tag1, Tag2, Tag3" {...field} />
                      </FormControl>
                      <FormDescription>Pisahkan tag dengan koma</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Gambar</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleImageChange(e)
                              // This ensures the form field value is updated
                              onChange(e.target.files?.[0] || null)
                            }}
                            {...fieldProps}
                          />
                        </FormControl>
                        <FormDescription>Pilih gambar baru untuk mengganti gambar saat ini</FormDescription>
                      </div>
                      <div className="flex justify-center items-center">
                        {previewUrl ? (
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="max-h-[150px] object-contain border rounded"
                          />
                        ) : currentImage ? (
                          <img
                            src={currentImage || "/placeholder.svg"}
                            alt="Current"
                            className="max-h-[150px] object-contain border rounded"
                          />
                        ) : (
                          <div className="h-[150px] w-full bg-gray-100 flex items-center justify-center text-gray-500 border rounded">
                            Tidak ada gambar
                          </div>
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Aktif</FormLabel>
                      <FormDescription>Konten akan ditampilkan di website jika diaktifkan</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
