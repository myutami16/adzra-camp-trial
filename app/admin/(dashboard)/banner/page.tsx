"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Eye, EyeOff, ImageIcon } from "lucide-react";
import { fetchAdminBanners, deleteBanner } from "@/lib/admin-api";
import { toast } from "sonner";
import DeleteBannerDialog from "@/components/admin/delete-banner-dialog";
import BannerStatsCard from "@/components/admin/banner-stats-card";
import BannerFilter, {
	type BannerFilters,
} from "@/components/admin/banner-filter";

// Interface untuk banner data
interface Banner {
	id: string;
	image: string;
	location: "homepage" | "productpage";
	isActive: boolean;
	createdAt: string;
}

// Interface untuk location stats
interface LocationStats {
	homepage?: { total: number; active: number };
	productpage?: { total: number; active: number };
}

export default function BannerManagementPage() {
	const [banners, setBanners] = useState<Banner[]>([]);
	const [loading, setLoading] = useState(true);
	const [locationStats, setLocationStats] = useState<LocationStats>({});
	const [activeTab, setActiveTab] = useState<
		"all" | "homepage" | "productpage"
	>("all");
	const [filters, setFilters] = useState<BannerFilters>({
		search: "",
		location: "",
		status: "",
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	// Fetch banners data from API
	const fetchBanners = async (location?: string) => {
		try {
			setLoading(true);
			console.log("Fetching banners with location:", location);

			// Create params object for API call
			const params: Record<string, any> = {};
			if (location) {
				params.location = location;
			}

			const response = await fetchAdminBanners(params);
			console.log("Banners response:", response);

			if (response && Array.isArray(response.banners)) {
				setBanners(response.banners);
				setLocationStats(response.locationStats || {});
			} else {
				console.error("Invalid response format:", response);
				toast.error("Format respons tidak valid");
				setBanners([]);
			}
		} catch (error) {
			console.error("Error fetching banners:", error);
			toast.error("Gagal memuat data banner");
			setBanners([]);
		} finally {
			setLoading(false);
		}
	};

	// Handle banner deletion
	const handleDeleteBanner = async (id: string) => {
		try {
			setLoading(true);
			console.log(`Deleting banner with ID: ${id}`);

			await deleteBanner(id);
			toast.success("Banner berhasil dihapus");

			// Refresh the banner list
			fetchBanners(activeTab === "all" ? undefined : activeTab);
		} catch (error) {
			console.error("Error deleting banner:", error);
			toast.error("Gagal menghapus banner");
		} finally {
			setLoading(false);
		}
	};

	// Load banners on component mount
	useEffect(() => {
		fetchBanners();
	}, []);

	// Filter and sort banners based on current filters
	const filteredBanners = useMemo(() => {
		const filtered = banners.filter((banner) => {
			// Tab filter
			if (activeTab !== "all" && banner.location !== activeTab) return false;

			// Search filter
			if (filters.search) {
				const searchLower = filters.search.toLowerCase();
				const locationName =
					banner.location === "homepage" ? "homepage" : "halaman produk";
				if (!locationName.includes(searchLower)) return false;
			}

			// Location filter
			if (filters.location && banner.location !== filters.location)
				return false;

			// Status filter
			if (filters.status) {
				if (filters.status === "active" && !banner.isActive) return false;
				if (filters.status === "inactive" && banner.isActive) return false;
			}

			return true;
		});

		// Sort banners
		filtered.sort((a, b) => {
			let aValue: any, bValue: any;

			switch (filters.sortBy) {
				case "location":
					aValue = a.location;
					bValue = b.location;
					break;
				case "isActive":
					aValue = a.isActive ? 1 : 0;
					bValue = b.isActive ? 1 : 0;
					break;
				case "createdAt":
				default:
					aValue = new Date(a.createdAt).getTime();
					bValue = new Date(b.createdAt).getTime();
					break;
			}

			if (filters.sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		return filtered;
	}, [banners, activeTab, filters]);

	// Handle tab change
	const handleTabChange = (value: string) => {
		setActiveTab(value as "all" | "homepage" | "productpage");
		// Reset location filter when changing tabs
		if (value !== "all") {
			setFilters((prev) => ({ ...prev, location: value }));
		} else {
			setFilters((prev) => ({ ...prev, location: "" }));
		}
	};

	// Handle filter change
	const handleFilterChange = (newFilters: BannerFilters) => {
		setFilters(newFilters);
	};

	// Format date for display
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("id-ID", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Get location display name
	const getLocationDisplayName = (location: string) => {
		return location === "homepage" ? "Homepage" : "Halaman Produk";
	};

	// Check if location has reached maximum banners (5)
	const isLocationFull = (location: "homepage" | "productpage") => {
		const stats = locationStats[location];
		return stats ? stats.total >= 5 : false;
	};

	if (loading && banners.length === 0) {
		return (
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold">Manajemen Banner</h1>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{[...Array(6)].map((_, i) => (
						<Card key={i} className="animate-pulse">
							<CardContent className="p-4">
								<div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
								<div className="h-4 bg-gray-200 rounded mb-2"></div>
								<div className="h-3 bg-gray-200 rounded w-2/3"></div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Manajemen Banner</h1>
					<p className="text-gray-600 mt-1">
						Kelola banner untuk homepage dan halaman produk
					</p>
				</div>
				<Link href="/admin/banner/tambah">
					<Button>
						<Plus className="h-4 w-4 mr-2" />
						Tambah Banner
					</Button>
				</Link>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<BannerStatsCard
					title="Total Banner"
					total={banners.length}
					active={banners.filter((b) => b.isActive).length}
					maxAllowed={10}
					icon={<ImageIcon className="h-4 w-4 text-muted-foreground" />}
				/>

				<BannerStatsCard
					title="Homepage"
					total={locationStats.homepage?.total || 0}
					active={locationStats.homepage?.active || 0}
					maxAllowed={5}
				/>

				<BannerStatsCard
					title="Halaman Produk"
					total={locationStats.productpage?.total || 0}
					active={locationStats.productpage?.active || 0}
					maxAllowed={5}
				/>
			</div>

			{/* Filter Component */}
			<BannerFilter
				onFilterChange={handleFilterChange}
				totalCount={banners.length}
				filteredCount={filteredBanners.length}
			/>

			{/* Tabs for filtering */}
			<Tabs value={activeTab} onValueChange={handleTabChange}>
				<TabsList>
					<TabsTrigger value="all">Semua Banner</TabsTrigger>
					<TabsTrigger value="homepage">Homepage</TabsTrigger>
					<TabsTrigger value="productpage">Halaman Produk</TabsTrigger>
				</TabsList>

				<TabsContent value={activeTab} className="mt-6">
					{/* Warning for full locations */}
					{activeTab !== "all" &&
						isLocationFull(activeTab as "homepage" | "productpage") && (
							<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
								<p className="text-yellow-800">
									<strong>Peringatan:</strong> Lokasi{" "}
									{getLocationDisplayName(activeTab)}
									sudah mencapai batas maksimal 5 banner. Hapus banner yang ada
									untuk menambah yang baru.
								</p>
							</div>
						)}

					{/* Banner Grid */}
					{filteredBanners.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									{banners.length === 0
										? "Belum ada banner"
										: "Tidak ada banner yang sesuai filter"}
								</h3>
								<p className="text-gray-500 text-center mb-4">
									{banners.length === 0
										? activeTab === "all"
											? "Belum ada banner yang dibuat. Mulai dengan menambah banner pertama."
											: `Belum ada banner untuk ${getLocationDisplayName(
													activeTab
											  )}.`
										: "Coba ubah filter pencarian atau hapus beberapa filter."}
								</p>
								{banners.length === 0 && (
									<Link href="/admin/banner/tambah">
										<Button>
											<Plus className="h-4 w-4 mr-2" />
											Tambah Banner
										</Button>
									</Link>
								)}
							</CardContent>
						</Card>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredBanners.map((banner) => (
								<Card key={banner.id} className="overflow-hidden">
									<div className="aspect-video relative">
										<Image
											src={banner.image || "/placeholder.svg"}
											alt={`Banner ${getLocationDisplayName(banner.location)}`}
											fill
											className="object-cover"
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										/>
										<div className="absolute top-2 right-2">
											<Badge
												variant={banner.isActive ? "default" : "secondary"}
												className={banner.isActive ? "bg-green-600" : ""}>
												{banner.isActive ? (
													<>
														<Eye className="h-3 w-3 mr-1" />
														Aktif
													</>
												) : (
													<>
														<EyeOff className="h-3 w-3 mr-1" />
														Nonaktif
													</>
												)}
											</Badge>
										</div>
									</div>

									<CardContent className="p-4">
										<div className="flex justify-between items-start mb-2">
											<div>
												<h3 className="font-medium">
													{getLocationDisplayName(banner.location)}
												</h3>
												<p className="text-sm text-gray-500">
													{formatDate(banner.createdAt)}
												</p>
											</div>
										</div>

										<div className="flex gap-2 mt-4">
											<DeleteBannerDialog
												bannerId={banner.id}
												bannerLocation={getLocationDisplayName(banner.location)}
												onSuccess={() => {
													handleDeleteBanner(banner.id);
												}}
											/>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
