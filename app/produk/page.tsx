import "@/lib/symbol-polyfill";
import { Suspense } from "react";
import { getProductCategories } from "@/lib/api";
import ProductList from "@/components/product-list";
import ProductFilters from "@/components/product-filters";
import ProductsLoading from "@/components/products-loading";
import ProductSearch from "@/components/product-search";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Tent } from "lucide-react";
import Link from "next/link";
import ProductBanner from "@/components/Product-Banner";

// ISR Configuration - Revalidate every 180 seconds (3 minutes)
export const revalidate = 180;

export const metadata = {
	title: "Produk - Adzra Camp",
	description: "Jelajahi berbagai produk camping berkualitas dari Adzra Camp",
};

interface ProductsPageProps {
	searchParams: {
		page?: string;
		kategori?: string;
		sort?: string;
		q?: string;
		search?: string;
		isForSale?: string;
		isForRent?: string;
	};
}

function ensureStringArray(input: any): string[] {
	const defaultCategories = [
		"Tenda Camping",
		"Matras & Sleeping Kit",
		"Sleeping Bag",
		"Carrier & Daypack",
		"Flysheet & Aksesorinya",
		"Meja & Kursi Lipat",
		"Peralatan Masak Outdoor & Grill Kit",
		"Trekking Pole",
		"Lampu & Penerangan Outdoor",
		"Pisau Lipat & Peralatan Survival",
		"Aksesori Tambahan",
		"Paket Komplit Camping",
		"Paket Komplit Adzra Camp",
		"Lain-lain",
	];

	try {
		if (!input) return defaultCategories;

		if (
			Array.isArray(input) &&
			input.every((item) => typeof item === "string")
		) {
			return input.length > 0 ? input : defaultCategories;
		}

		if (Array.isArray(input)) {
			const result = input
				.map((item) => {
					if (item === null || item === undefined) return null;
					try {
						if (typeof item === "string") return item;
						if (typeof item === "number" || typeof item === "boolean")
							return String(item);

						if (typeof item === "symbol") {
							try {
								return item.description || "[Symbol]";
							} catch (err) {
								try {
									const stringValue = String(item).replace(
										/^Symbol\((.+)\)$/,
										"$1"
									);
									return stringValue || "[Symbol]";
								} catch (convErr) {
									console.error("Failed to convert symbol:", convErr);
									return "[Symbol]";
								}
							}
						}

						if (typeof item === "object") {
							if (item.name && typeof item.name === "string") return item.name;
							if (item.title && typeof item.title === "string")
								return item.title;
							if (item.id && typeof item.id === "string") return item.id;
							return "[Object]";
						}

						return String(item);
					} catch (e) {
						console.error("Failed to convert category to string:", e);
						return null;
					}
				})
				.filter(Boolean);

			return result.length > 0 ? result : defaultCategories;
		}

		if (typeof input === "object" && input !== null) {
			if (Array.isArray(input.data)) {
				const processed = ensureStringArray(input.data);
				if (processed.length > 0) return processed;
			}

			if (Array.isArray(input.categories)) {
				const processed = ensureStringArray(input.categories);
				if (processed.length > 0) return processed;
			}
		}

		return defaultCategories;
	} catch (error) {
		console.error("Error processing categories:", error);
		return defaultCategories;
	}
}

export default async function ProductsPage({
	searchParams,
}: ProductsPageProps) {
	let categories: string[] = [];

	try {
		console.log("Attempting to fetch product categories...");
		const rawCategories = await getProductCategories();
		console.log("Categories fetched successfully:", rawCategories);

		categories = ensureStringArray(rawCategories);

		console.log("Processed categories:", categories);
	} catch (error) {
		console.error("Error in ProductsPage when fetching categories:", error);

		categories = [
			"Tenda Camping",
			"Matras & Sleeping Kit",
			"Sleeping Bag",
			"Carrier & Daypack",
			"Flysheet & Aksesorinya",
			"Meja & Kursi Lipat",
			"Peralatan Masak Outdoor & Grill Kit",
			"Trekking Pole",
			"Lampu & Penerangan Outdoor",
			"Pisau Lipat & Peralatan Survival",
			"Aksesori Tambahan",
			"Paket Komplit Camping",
			"Lain-lain",
		];
		console.log("Using fallback categories:", categories);
	}

	const page = Number.isNaN(Number(searchParams.page))
		? 1
		: Number(searchParams.page);
	const kategori = searchParams.kategori;
	const sort = searchParams.sort;
	const query = searchParams.search || searchParams.q;
	const isForSale = searchParams.isForSale === "true";
	const isForRent = searchParams.isForRent === "true";

	const createFilterUrl = (filter: "sale" | "rent" | "all") => {
		const rawParams = searchParams as Record<string, unknown>;

		const params = new URLSearchParams();

		for (const key in rawParams) {
			const value = rawParams[key];

			// Lewatkan undefined, null, dan symbol
			if (value === undefined || value === null || typeof value === "symbol") {
				continue;
			}

			try {
				params.set(key, String(value));
			} catch (e) {
				console.warn(`Skipping key ${key} due to conversion error`, e);
			}
		}

		// Remove pagination
		params.delete("page");

		// Overwrite filter logic
		if (filter === "sale") {
			params.set("isForSale", "true");
			params.delete("isForRent");
		} else if (filter === "rent") {
			params.set("isForRent", "true");
			params.delete("isForSale");
		} else {
			params.delete("isForSale");
			params.delete("isForRent");
		}

		return `/produk?${params.toString()}`;
	};

	return (
		<div className="container py-8 max-w-full">
			<div className="flex flex-col gap-6">
				{/* <div>
					<h1 className="text-3xl font-bold mb-2">Produk Kami</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Jelajahi berbagai produk camping berkualitas dari Adzra Camp
					</p>
				</div> */}

				<ProductSearch initialQuery={query} />
				<ProductBanner />

				{/* Show current search query */}
				{query && (
					<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
						<p className="text-sm text-blue-700 dark:text-blue-300">
							Menampilkan hasil pencarian untuk: <strong>"{query}"</strong>
						</p>
					</div>
				)}

				{/* Sale/Rent Filter Buttons */}
				<div className="flex flex-wrap gap-2">
					<Button
						variant={!isForSale && !isForRent ? "default" : "outline"}
						asChild>
						<Link href={createFilterUrl("all")}>Semua Produk</Link>
					</Button>
					<Button
						variant={isForSale ? "default" : "outline"}
						asChild
						className="flex items-center gap-2">
						<Link href={createFilterUrl("sale")}>
							<ShoppingBag className="h-4 w-4" />
							Untuk Dijual
						</Link>
					</Button>
					<Button
						variant={isForRent ? "default" : "outline"}
						asChild
						className="flex items-center gap-2">
						<Link href={createFilterUrl("rent")}>
							<Tent className="h-4 w-4" />
							Untuk Disewa
						</Link>
					</Button>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
					<ProductFilters categories={categories} />

					<div>
						<Suspense fallback={<ProductsLoading />}>
							<ProductList
								page={page}
								kategori={kategori}
								sort={sort}
								query={query}
								isForSale={isForSale}
								isForRent={isForRent}
							/>
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	);
}
