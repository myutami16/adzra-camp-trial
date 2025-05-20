"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface ProductSearchProps {
  initialQuery?: string
}

export default function ProductSearch({ initialQuery = "" }: ProductSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", query)

    const params = new URLSearchParams(searchParams.toString())

    if (query) {
      params.set("q", query)
    } else {
      params.delete("q")
    }

    // Reset to page 1 when searching
    params.delete("page")

    const searchUrl = `/produk?${params.toString()}`
    console.log("Search URL:", searchUrl)
    router.push(searchUrl)
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Cari produk camping..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Cari</Button>
      </div>
    </form>
  )
}
