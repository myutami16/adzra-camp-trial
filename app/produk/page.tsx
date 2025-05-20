// Import the polyfill first to ensure it's loaded before any potential Symbol operations
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
		isForSale?: string;
		isForRent?: string;
	};
}

// Safe function to ensure we have string values
function ensureStringArray(input: any): string[] {
	const defaultCategories = [
		"Tenda Camping",
		"Aksesori",
		"Sleeping Bag",
		"Perlengkapan Outdoor & Survival",
		"Lampu",
		"Carrier & Ransel",
		"Peralatan Memasak Outdoor",
		"Lain-lain",
	];

	try {
		// If we got null or undefined, return defaults
		if (!input) return defaultCategories;

		// If we already have a string array, use it
		if (
			Array.isArray(input) &&
			input.every((item) => typeof item === "string")
		) {
			return input.length > 0 ? input : defaultCategories;
		}

		// If we have array-like data, convert each item to string safely
		if (Array.isArray(input)) {
			const result = input
				.map((item) => {
					if (item === null || item === undefined) return null;
					try {
						// For primitive values
						if (typeof item === "string") return item;
						if (typeof item === "number" || typeof item === "boolean")
							return String(item);

						// For Symbol, use description or "[Symbol]"
						if (typeof item === "symbol") {
							const symbolString = String(item);
							return (
								symbolString.replace(/^Symbol\((.+)\)$/, "$1") || "[Symbol]"
							);
						}

						// For objects, try to get meaningful string
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

		// If we have an object with categories inside
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
	// Get categories for filter
	let categories: string[] = [];

	try {
		console.log("Attempting to fetch product categories...");
		const rawCategories = await getProductCategories();
		console.log("Categories fetched successfully:", rawCategories);

		// Convert to safe string array with fallback
		categories = ensureStringArray(rawCategories);

		console.log("Processed categories:", categories);
	} catch (error) {
		console.error("Error in ProductsPage when fetching categories:", error);
		// Fallback categories
		categories = [
			"Tenda Camping",
			"Aksesori",
			"Sleeping Bag",
			"Perlengkapan Outdoor & Survival",
			"Lampu",
			"Carrier & Ransel",
			"Peralatan Memasak Outdoor",
			"Lain-lain",
		];
		console.log("Using fallback categories:", categories);
	}

	// Parse search params
	const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
	const kategori = searchParams.kategori;
	const sort = searchParams.sort;
	const query = searchParams.q;
	const isForSale = searchParams.isForSale === "true";
	const isForRent = searchParams.isForRent === "true";

	// Create URLs for filter buttons
	const createFilterUrl = (filter: "sale" | "rent" | "all") => {
		const params = new URLSearchParams(searchParams as Record<string, string>);

		// Reset page when changing filters
		params.delete("page");

		if (filter === "sale") {
			params.set("isForSale", "true");
			params.delete("isForRent");
		} else if (filter === "rent") {
			params.set("isForRent", "true");
			params.delete("isForSale");
		} else {
			// 'all' - remove both filters
			params.delete("isForSale");
			params.delete("isForRent");
		}

		return `/produk?${params.toString()}`;
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col gap-6">
				<div>
					<h1 className="text-3xl font-bold mb-2">Produk Kami</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Jelajahi berbagai produk camping berkualitas dari Adzra Camp
					</p>
				</div>

				<ProductSearch initialQuery={query} />

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

				<div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
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
