import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { formatRupiah } from "@/lib/utils"

interface ProductCardProps {
  product: {
    id?: number
    namaProduk?: string
    name?: string
    title?: string
    slug?: string
    harga?: number
    price?: number
    thumbnailImage?: string
    gambar?: string
    image?: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  // Handle different API response formats
  const id = product.id || Math.floor(Math.random() * 1000)
  const name = product.namaProduk || product.name || product.title || "Produk"
  const price = product.harga || product.price || 0
  const slug = product.slug || `product-${id}`
  const image = product.thumbnailImage || product.gambar || product.image || "/placeholder.svg?height=300&width=300"

  console.log(`ProductCard: Creating link for product ${name} with slug ${slug}`)

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
      <Link href={`/produk/${slug}`}>
        <div className="relative h-48 sm:h-56">
          <Image
            src={image || "/placeholder.svg?height=300&width=300"}
            alt={name}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=300&width=300"
            }}
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-lg mb-2 line-clamp-2">{name}</h3>
          <p className="text-primary-dark font-semibold dark:text-primary-light">{formatRupiah(price)}</p>
        </CardContent>
      </Link>
    </Card>
  )
}
