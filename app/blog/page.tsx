import { Suspense } from "react"
import BlogList from "@/components/blog-list"
import BlogsLoading from "@/components/blogs-loading"
import BlogCategories from "@/components/blog-categories"

export const metadata = {
  title: "Blog - Adzra Camp",
  description: "Artikel dan tips seputar camping dan outdoor dari Adzra Camp",
}

interface BlogPageProps {
  searchParams: {
    page?: string
    type?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Parse search params
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const type = searchParams.type

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog & Informasi</h1>
          <p className="text-gray-600">Artikel dan tips seputar camping dan outdoor dari Adzra Camp</p>
        </div>

        <BlogCategories activeType={type} />

        <Suspense fallback={<BlogsLoading />}>
          <BlogList page={page} type={type} />
        </Suspense>
      </div>
    </div>
  )
}
