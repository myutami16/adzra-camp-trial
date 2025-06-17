"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { X } from "lucide-react";

interface ProductFiltersProps {
	categories: string[] | any;
}

export default function ProductFilters({
	categories = [],
}: ProductFiltersProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentCategory = searchParams.get("kategori") || "";
	const currentSort = searchParams.get("sort") || "newest";
	const currentQuery = searchParams.get("q") || "";

	const [selectedCategory, setSelectedCategory] =
		useState<string>(currentCategory);
	const [displayCategories, setDisplayCategories] = useState<string[]>([]);

	// Safe function to convert any value to string
	const safeToString = (value: any): string | null => {
		if (value === null || value === undefined) return null;

		try {
			if (typeof value === "string") return value;
			if (typeof value === "number" || typeof value === "boolean")
				return String(value);

			// Handle Symbol safely
			if (typeof value === "symbol") {
				// Try to use description
				try {
					return value.description || "[Symbol]";
				} catch (e) {
					// Fallback to string conversion with regex
					const str = String(value);
					const match = /Symbol\((.*)\)/.exec(str);
					return match ? match[1] || "[Symbol]" : "[Symbol]";
				}
			}

			// Handle objects
			if (typeof value === "object") {
				if (value.name && typeof value.name === "string") return value.name;
				if (value.title && typeof value.title === "string") return value.title;
				if (value.id && typeof value.id === "string") return value.id;
			}

			return String(value);
		} catch (e) {
			console.error("Failed to safely convert to string:", e);
			return "[Conversion Error]";
		}
	};

	// Process categories when component mounts or categories prop changes
	useEffect(() => {
		console.log("ProductFilters received categories:", categories);

		// Initialize with default categories
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
			"Lain-lain",
		];

		// Handle empty or invalid input
		if (!categories) {
			console.log("No categories provided, using defaults");
			setDisplayCategories(defaultCategories);
			return;
		}

		// If we already have a string array, use it directly
		if (
			Array.isArray(categories) &&
			categories.every((cat) => typeof cat === "string")
		) {
			console.log("Categories are already strings:", categories);
			setDisplayCategories(
				categories.length > 0 ? categories : defaultCategories
			);
			return;
		}

		// Try to convert array of non-strings to strings
		if (Array.isArray(categories)) {
			const stringCategories = categories
				.map(safeToString)
				.filter(Boolean) as string[];

			if (stringCategories.length > 0) {
				console.log("Converted categories to strings:", stringCategories);
				setDisplayCategories(stringCategories);
				return;
			}
		}

		// For any other case, just use the defaults
		console.log("Using default categories");
		setDisplayCategories(defaultCategories);
	}, [categories]);

	const handleCategoryChange = (category: string) => {
		const params = new URLSearchParams(searchParams.toString());

		if (category === selectedCategory) {
			// Deselect category
			params.delete("kategori");
			setSelectedCategory("");
		} else {
			// Select new category
			params.set("kategori", category);
			setSelectedCategory(category);
		}

		// Reset to page 1 when changing filters
		params.delete("page");

		router.push(`/produk?${params.toString()}`);
	};

	const clearFilters = () => {
		const params = new URLSearchParams();

		// Preserve search query if exists
		if (currentQuery) {
			params.set("q", currentQuery);
		}

		// Preserve sort if not default
		if (currentSort !== "newest") {
			params.set("sort", currentSort);
		}

		setSelectedCategory("");
		router.push(`/produk?${params.toString()}`);
	};

	const hasActiveFilters = !!selectedCategory;

	return (
		<div className="space-y-6">
			{hasActiveFilters && (
				<div className="flex items-center justify-between">
					<h3 className="font-medium">Filter Aktif</h3>
					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						className="h-8 text-sm">
						<X className="h-4 w-4 mr-1" />
						Reset
					</Button>
				</div>
			)}

			<Accordion type="single" collapsible defaultValue="kategori">
				<AccordionItem value="kategori" className="border-none">
					<AccordionTrigger className="py-2">Kategori</AccordionTrigger>
					<AccordionContent>
						<div className="space-y-2">
							{displayCategories.map((category: string, index: number) => (
								<div
									key={`category-${index}`}
									className="flex items-center space-x-2">
									<Checkbox
										id={`category-${index}`}
										checked={selectedCategory === category}
										onCheckedChange={() => handleCategoryChange(category)}
									/>
									<label
										htmlFor={`category-${index}`}
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
										{category}
									</label>
								</div>
							))}
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
