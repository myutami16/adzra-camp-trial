import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-primary-dark">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Halaman Tidak Ditemukan</h2>
      <p className="mt-2 text-gray-600 max-w-md">
        Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  )
}
