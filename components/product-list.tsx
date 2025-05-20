import { fetchProducts } from "@/lib/api"
import ProductCard from "@/components/product-card"
import Pagination from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductListProps {
  page?: number
  kategori?: string
  sort?: string
  query?: string
  isForSale?: boolean
  isForRent?: boolean
}

export default async function ProductList({
  page = 1,
  kategori,
  sort = "newest",
  query,
  isForSale,
  isForRent,
}: ProductListProps) {
  // Fetch products with filters
  const productsData = await fetchProducts({
    page,
    limit: 12,
    kategori,
    sort,
    q: query,
    isForSale: isForSale ? "true" : undefined,
    isForRent: isForRent ? "true" : undefined,
  })

  console.log("Products data in ProductList:", productsData)

  // Safely access products and pagination
  const products = productsData?.data?.products || []
  const pagination = productsData?.data?.pagination || {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 12,
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Tidak ada produk ditemukan</h3>
        <p className="text-gray-500 dark:text-gray-400">Coba ubah filter atau kata kunci pencarian Anda</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan {products.length} dari {pagination.totalItems || products.length} produk
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <form action="/produk" method="GET" className="flex gap-2">
            {query && <input type="hidden" name="q" value={query} />}
            {kategori && <input type="hidden" name="kategori" value={kategori} />}
            {isForSale && <input type="hidden" name="isForSale" value="true" />}
            {isForRent && <input type="hidden" name="isForRent" value="true" />}
            <Select name="sort" defaultValue={sort}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="oldest">Terlama</SelectItem>
                <SelectItem value="price_asc">Harga: Rendah ke Tinggi</SelectItem>
                <SelectItem value="price_desc">Harga: Tinggi ke Rendah</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" variant="outline" size="icon">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id || `product-${Math.random()}`} product={product} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </div>
  )
}
