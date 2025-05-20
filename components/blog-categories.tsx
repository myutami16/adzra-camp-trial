"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BlogCategoriesProps {
  activeType?: string
}

export default function BlogCategories({ activeType }: BlogCategoriesProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (type === "all") {
      params.delete("type")
    } else {
      params.set("type", type)
    }

    // Reset to page 1 when changing category
    params.delete("page")

    router.push(`/blog?${params.toString()}`)
  }

  return (
    <div className="w-full overflow-auto pb-2">
      <Tabs defaultValue={activeType || "all"} className="w-full" onValueChange={handleCategoryChange}>
        <TabsList className="h-10 w-fit">
          <TabsTrigger value="all" className="px-4">
            Semua
          </TabsTrigger>
          <TabsTrigger value="blog" className="px-4">
            Blog
          </TabsTrigger>
          <TabsTrigger value="promo" className="px-4">
            Promo
          </TabsTrigger>
          <TabsTrigger value="event" className="px-4">
            Event
          </TabsTrigger>
          <TabsTrigger value="announcement" className="px-4">
            Pengumuman
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
