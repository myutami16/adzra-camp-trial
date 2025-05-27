"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

interface BannerFilterProps {
	onFilterChange: (filters: BannerFilters) => void;
	totalCount: number;
	filteredCount: number;
}

export interface BannerFilters {
	search: string;
	location: string;
	status: string;
	sortBy: string;
	sortOrder: "asc" | "desc";
}

export default function BannerFilter({
	onFilterChange,
	totalCount,
	filteredCount,
}: BannerFilterProps) {
	const [filters, setFilters] = useState<BannerFilters>({
		search: "",
		location: "all", // Updated default value
		status: "all", // Updated default value
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const [showFilters, setShowFilters] = useState(false);

	const updateFilters = (newFilters: Partial<BannerFilters>) => {
		const updatedFilters = { ...filters, ...newFilters };
		setFilters(updatedFilters);
		onFilterChange(updatedFilters);
	};

	const clearFilters = () => {
		const clearedFilters: BannerFilters = {
			search: "",
			location: "all", // Updated default value
			status: "all", // Updated default value
			sortBy: "createdAt",
			sortOrder: "desc",
		};
		setFilters(clearedFilters);
		onFilterChange(clearedFilters);
	};

	const hasActiveFilters =
		filters.search || filters.location !== "all" || filters.status !== "all";

	return (
		<div className="space-y-4">
			{/* Search and Filter Toggle */}
			<div className="flex gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder="Cari banner..."
						value={filters.search}
						onChange={(e) => updateFilters({ search: e.target.value })}
						className="pl-10"
					/>
				</div>
				<Button
					variant="outline"
					onClick={() => setShowFilters(!showFilters)}
					className={showFilters ? "bg-gray-100" : ""}>
					<Filter className="h-4 w-4 mr-2" />
					Filter
					{hasActiveFilters && (
						<Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
							!
						</Badge>
					)}
				</Button>
			</div>

			{/* Advanced Filters */}
			{showFilters && (
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
					<div>
						<label className="text-sm font-medium mb-2 block">Lokasi</label>
						<Select
							value={filters.location}
							onValueChange={(value) => updateFilters({ location: value })}>
							<SelectTrigger>
								<SelectValue placeholder="Semua lokasi" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Semua lokasi</SelectItem>
								<SelectItem value="homepage">Homepage</SelectItem>
								<SelectItem value="productpage">Halaman Produk</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<label className="text-sm font-medium mb-2 block">Status</label>
						<Select
							value={filters.status}
							onValueChange={(value) => updateFilters({ status: value })}>
							<SelectTrigger>
								<SelectValue placeholder="Semua status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Semua status</SelectItem>
								<SelectItem value="active">Aktif</SelectItem>
								<SelectItem value="inactive">Nonaktif</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<label className="text-sm font-medium mb-2 block">Urutkan</label>
						<Select
							value={filters.sortBy}
							onValueChange={(value) => updateFilters({ sortBy: value })}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="createdAt">Tanggal dibuat</SelectItem>
								<SelectItem value="location">Lokasi</SelectItem>
								<SelectItem value="isActive">Status</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<label className="text-sm font-medium mb-2 block">Urutan</label>
						<Select
							value={filters.sortOrder}
							onValueChange={(value: "asc" | "desc") =>
								updateFilters({ sortOrder: value })
							}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="desc">Terbaru</SelectItem>
								<SelectItem value="asc">Terlama</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			)}

			{/* Filter Results Info */}
			<div className="flex items-center justify-between text-sm text-gray-600">
				<div>
					Menampilkan {filteredCount} dari {totalCount} banner
					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="sm"
							onClick={clearFilters}
							className="ml-2 h-6 px-2 text-xs">
							<X className="h-3 w-3 mr-1" />
							Hapus filter
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
