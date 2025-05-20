import { fetchContent } from "@/lib/api"
import BlogCard from "@/components/blog-card"
import Pagination from "@/components/pagination"

interface BlogListProps {
  page?: number
  type?: string
}

export default async function BlogList({ page = 1, type }: BlogListProps) {
  // Fetch blog posts with filters
  const blogData = await fetchContent({
    page,
    limit: 9,
    type,
  })

  console.log("Blog data in BlogList:", blogData)

  // Safely access content and pagination
  const content = blogData?.data?.content || []
  const pagination = blogData?.data?.pagination || {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 9,
  }

  if (!content || content.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Tidak ada artikel ditemukan</h3>
        <p className="text-gray-500 dark:text-gray-400">Coba ubah filter atau kunjungi kembali nanti</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.map((post) => (
          <BlogCard key={post.id || `post-${Math.random()}`} post={post} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </div>
  )
}
