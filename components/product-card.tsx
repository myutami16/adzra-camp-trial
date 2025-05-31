import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import ImageWithErrorBoundary from "./image-with-error-boundary";

interface ProductCardProps {
	product: {
		id?: number;
		namaProduk?: string;
		name?: string;
		title?: string;
		slug?: string;
		harga?: number;
		price?: number;
		thumbnailImage?: string;
		gambar?: string;
		image?: string;
	};
}

export default function ProductCard({ product }: ProductCardProps) {
	// Handle different API response formats
	const id = product.id || Math.floor(Math.random() * 1000);
	const name = product.namaProduk || product.name || product.title || "Produk";
	const price = product.harga || product.price || 0;
	const slug = product.slug || `product-${id}`;
	const image =
		product.thumbnailImage ||
		product.gambar ||
		product.image ||
		"/placeholder.svg?height=300&width=300";

	console.log(
		`ProductCard: Creating link for product ${name} with slug ${slug}`
	);

	return (
		<Card className="overflow-hidden border-none">
		<Link href={`/produk/${slug}`}>
			<div className="relative aspect-square w-full mb-3">
			<ImageWithErrorBoundary
				src={image || "/placeholder.svg?height=300&width=300"}
				alt={name}
				fill
				className="object-cover transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-110"
			/>
			</div>
			<CardContent className="p-4 flex flex-col items-center text-center">
			<h3 className="font-medium text-sm sm:text-lg mb-2 line-clamp-2 min-h-[3.5rem]">{name}</h3>
			<p className="text-gray-800 font-light dark:text-primary-light">
				{formatRupiah(price)}
			</p>
			</CardContent>
		</Link>
		</Card>


	);
}
