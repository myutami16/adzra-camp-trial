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

	// Process categories when component mounts or categories prop changes
	useEffect(() => {
		console.log("Processing categories in ProductFilters:", categories);
		let processedCategories: string[] = [];

		try {
			if (Array.isArray(categories) && categories.length > 0) {
				// Convert any potential Symbol values to strings and filter out non-string values
				processedCategories = categories
					.map((cat) => {
						try {
							// Only include string values or values that can be safely converted to strings
							return typeof cat === "string"
								? cat
								: cat !== null && cat !== undefined
								? String(cat)
								: null;
						} catch (e) {
							console.error("Error converting category to string:", e);
							return null;
						}
					})
					.filter(Boolean); // Remove null/undefined/empty values

				console.log("Categories are an array with length:", categories.length);
			} else if (typeof categories === "object" && categories !== null) {
				// Try to extract categories from object
				console.log("Categories is an object, attempting to extract array");
				if (Array.isArray(categories.data)) {
					processedCategories = categories.data
						.map((cat) => {
							try {
								return typeof cat === "string"
									? cat
									: cat !== null && cat !== undefined
									? String(cat)
									: null;
							} catch (e) {
								console.error("Error converting category to string:", e);
								return null;
							}
						})
						.filter(Boolean);
				} else if (Array.isArray(categories.categories)) {
					processedCategories = categories.categories
						.map((cat) => {
							try {
								return typeof cat === "string"
									? cat
									: cat !== null && cat !== undefined
									? String(cat)
									: null;
							} catch (e) {
								console.error("Error converting category to string:", e);
								return null;
							}
						})
						.filter(Boolean);
				}
			}
		} catch (error) {
			console.error("Error processing categories:", error);
		}

		// If we still don't have categories, use default ones
		if (processedCategories.length === 0) {
			console.log("No valid categories found, using defaults");
			processedCategories = [
				"Tenda Camping",
				"Aksesori",
				"Sleeping Bag",
				"Perlengkapan Outdoor & Survival",
				"Lampu",
				"Carrier & Ransel",
				"Peralatan Memasak Outdoor",
				"Lain-lain",
			];
		}

		console.log("Final processed categories:", processedCategories);
		setDisplayCategories(processedCategories);
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
									key={`${category}-${index}`}
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
