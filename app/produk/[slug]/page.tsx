import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug, fetchProducts } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import ProductCard from "@/components/product-card";

// ✅ Static generation with on-demand revalidation
export const revalidate = 1800;
interface ProductPageProps {
	params: {
		slug: string;
	};
}

// Generate static params for popular products at build time
export async function generateStaticParams() {
	try {
		// Fetch initial products to pre-generate popular/common product pages
		const products = await fetchProducts({ limit: 20 });

		return products.data.products
			.filter((product) => product.slug) // Only include products that have a slug
			.map((product) => ({
				slug: product.slug,
			}));
	} catch (error) {
		console.error("Error generating static params:", error);
		// Return empty array if there's an error, Next.js will generate pages on-demand
		return [];
	}
}

export async function generateMetadata({ params }: ProductPageProps) {
	const product = await getProductBySlug(params.slug);

	if (!product) {
		return {
			title: "Produk Tidak Ditemukan - Adzra Camp",
			description: "Produk yang Anda cari tidak ditemukan",
		};
	}

	return {
		title: `${product.namaProduk} - Adzra Camp`,
		description:
			product.deskripsi ||
			`Detail produk ${product.namaProduk} dari Adzra Camp`,
		openGraph: {
			title: `${product.namaProduk} - Adzra Camp`,
			description:
				product.deskripsi ||
				`Detail produk ${product.namaProduk} dari Adzra Camp`,
			images: product.gambar ? [product.gambar] : [],
		},
	};
}

export default async function ProductPage({ params }: ProductPageProps) {
	console.log("Fetching product with slug:", params.slug);
	const product = await getProductBySlug(params.slug);
	console.log("Product data:", product);

	if (!product) {
		console.log("Product not found, returning 404");
		notFound();
	}

	// Fetch related products with specific tags
	const relatedProducts = await fetchProducts(
		{
			kategori: product.kategori,
			limit: 4,
		},
		[`category-${product.kategori}`, "related-products"]
	);

	// Filter out current product from related products
	const filteredRelatedProducts = relatedProducts.data.products
		.filter((p) => p.id !== product.id)
		.slice(0, 4);

	return (
		<div className="container mx-auto px-4 py-8">
			<Link
				href="/produk"
				className="inline-flex items-center text-gray-600 hover:text-primary-dark mb-6">
				<ArrowLeft className="h-4 w-4 mr-2" />
				Kembali ke Produk
			</Link>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
				<div className="relative h-[300px] md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
					<Image
						src={product.gambar || "/placeholder.svg?height=500&width=500"}
						alt={product.namaProduk}
						fill
						className="object-contain"
						priority
					/>
				</div>

				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold mb-2">{product.namaProduk}</h1>
						{product.kategori && (
							<div className="inline-block bg-primary-light/10 text-primary-dark px-3 py-1 rounded-full text-sm">
								{product.kategori}
							</div>
						)}
					</div>

					<div className="text-2xl font-bold text-primary-dark">
						{formatRupiah(product.harga)}
					</div>

					<div className="flex items-center gap-4">
						<div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
							{product.stok > 0 ? "Tersedia" : "Stok Habis"}
						</div>
						{product.isForRent && (
							<div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
								Tersedia untuk Disewa
							</div>
						)}
					</div>

					<div className="prose max-w-none">
						<h3 className="text-lg font-medium">Deskripsi</h3>
						<p style={{ whiteSpace: "pre-line" }}>
							{product.deskripsi ||
								"Tidak ada deskripsi tersedia untuk produk ini."}
						</p>
					</div>

					{product.specifications && (
						<div>
							<h3 className="text-lg font-medium mb-3">Spesifikasi</h3>
							<div className="grid grid-cols-1 gap-2">
								{Object.entries(product.specifications).map(([key, value]) => (
									<div key={key} className="flex">
										<span className="font-medium min-w-[120px]">{key}:</span>
										<span className="ml-2">{value as string}</span>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="flex flex-col sm:flex-row gap-4">
						{product.isForSale && product.stok > 0 && (
							<Button asChild>
								<Link
									href={`/jual-rental/form-pembelian?produk=${encodeURIComponent(
										product.namaProduk
									)}`}
									className="flex items-center gap-2">
									<ShoppingCart className="h-4 w-4" />
									Beli Sekarang
								</Link>
							</Button>
						)}
						{product.isForRent && (
							<Button asChild variant="outline">
								<Link
									href={`/jual-rental/form-persewaan?produk=${encodeURIComponent(
										product.namaProduk
									)}`}>
									Sewa Sekarang
								</Link>
							</Button>
						)}
					</div>
				</div>
			</div>

			{filteredRelatedProducts.length > 0 && (
				<div className="mt-16">
					<h2 className="text-2xl font-bold mb-6">Produk Terkait</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{filteredRelatedProducts.map((relatedProduct) => (
							<ProductCard key={relatedProduct.id} product={relatedProduct} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}
