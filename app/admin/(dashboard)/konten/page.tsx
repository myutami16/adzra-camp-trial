"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Loader2,
	Plus,
	MoreHorizontal,
	Pencil,
	Trash2,
	Search,
	Eye,
	RefreshCw,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchAdminContent, deleteContent } from "@/lib/admin-api";
import { formatDate } from "@/lib/utils";
import DeleteContentDialog from "@/components/admin/delete-content-dialog";

interface Content {
	id: string | number;
	title: string;
	slug: string;
	contentType: string;
	createdAt: string;
	isActive?: boolean;
}

interface Pagination {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
}

// Mock data for development mode
const MOCK_CONTENT: Content[] = [
	{
		id: "6826d135dddc290d62610cb8", // Using real ID from example
		title: "Libur Hari Raya Idul Adha 1446 H",
		slug: "libur-hari-raya-idul-adha-1446-h-389116",
		contentType: "announcement",
		createdAt: "2025-05-16T05:46:29.114Z",
		isActive: true,
	},
	{
		id: "2",
		title: "Promo Akhir Tahun",
		slug: "promo-akhir-tahun-123456",
		contentType: "promotion",
		createdAt: "2025-04-10T08:30:00.000Z",
		isActive: true,
	},
	{
		id: "3",
		title: "Tips Camping untuk Pemula",
		slug: "tips-camping-untuk-pemula-789012",
		contentType: "article",
		createdAt: "2025-03-22T14:15:00.000Z",
		isActive: true,
	},
];

const ITEMS_PER_PAGE = 10; // Fixed constant for items per page

export default function AdminContentPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [content, setContent] = useState<Content[]>([]);
	const [pagination, setPagination] = useState<Pagination>({
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		itemsPerPage: ITEMS_PER_PAGE,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [contentToDelete, setContentToDelete] = useState<
		string | number | null
	>(null);
	const [useMockData, setUseMockData] = useState(false);

	useEffect(() => {
		fetchContentData();
	}, [pagination.currentPage, searchQuery]); // Added searchQuery to dependencies

	const fetchContentData = async (page = pagination.currentPage) => {
		setIsLoading(true);
		setError(null);
		setUseMockData(false);

		try {
			console.log(`Fetching content for admin panel, page: ${page}...`);
			const params = {
				page: page.toString(),
				limit: ITEMS_PER_PAGE.toString(), // Use fixed constant
				...(searchQuery && { search: searchQuery }), // Add search parameter if query exists
			};
			const data = await fetchAdminContent(params);
			console.log("Admin content data:", data);

			// Check if the data is correctly structured
			if (data && Array.isArray(data.content) && data.content.length > 0) {
				setContent(data.content);
				
				// Update pagination with fixed itemsPerPage
				if (data.pagination) {
					setPagination({
						...data.pagination,
						itemsPerPage: ITEMS_PER_PAGE, // Always use fixed constant
					});
				}
			} else {
				console.warn("Unexpected content data format or empty content:", data);

				// In development mode, use mock data
				if (process.env.NODE_ENV === "development") {
					console.log("Using mock data in development mode");
					
					// Filter mock data based on search query
					const filteredMockContent = searchQuery
						? MOCK_CONTENT.filter(item =>
								item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
								item.contentType?.toLowerCase().includes(searchQuery.toLowerCase())
						  )
						: MOCK_CONTENT;
					
					setContent(filteredMockContent);
					setPagination({
						currentPage: 1,
						totalPages: 1,
						totalItems: filteredMockContent.length,
						itemsPerPage: ITEMS_PER_PAGE,
					});
					setUseMockData(true);
					setError(
						"Menggunakan data contoh karena API tidak tersedia. Ini hanya untuk mode pengembangan."
					);
				} else {
					setContent([]);
					setPagination({
						currentPage: 1,
						totalPages: 1,
						totalItems: 0,
						itemsPerPage: ITEMS_PER_PAGE,
					});
					setError(
						"Data konten tidak dalam format yang diharapkan atau tidak ada konten yang tersedia"
					);
				}
			}
		} catch (error) {
			console.error("Error fetching content:", error);

			// In development mode, use mock data
			if (process.env.NODE_ENV === "development") {
				console.log("Using mock data in development mode due to error");
				
				// Filter mock data based on search query
				const filteredMockContent = searchQuery
					? MOCK_CONTENT.filter(item =>
							item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
							item.contentType?.toLowerCase().includes(searchQuery.toLowerCase())
					  )
					: MOCK_CONTENT;
				
				setContent(filteredMockContent);
				setPagination({
					currentPage: 1,
					totalPages: 1,
					totalItems: filteredMockContent.length,
					itemsPerPage: ITEMS_PER_PAGE,
				});
				setUseMockData(true);
				setError(
					"Gagal memuat data konten. Menggunakan data contoh untuk mode pengembangan."
				);
			} else {
				setContent([]);
				setPagination({
					currentPage: 1,
					totalPages: 1,
					totalItems: 0,
					itemsPerPage: ITEMS_PER_PAGE,
				});
				setError("Gagal memuat data konten. Silakan coba lagi.");
				toast({
					title: "Error",
					description: "Gagal memuat data konten",
					variant: "destructive",
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	const refreshData = async () => {
		setIsRefreshing(true);
		try {
			await fetchContentData();
			toast({
				title: "Berhasil",
				description: "Data konten berhasil diperbarui",
			});
		} catch (error) {
			console.error("Error refreshing content:", error);
			toast({
				title: "Error",
				description: "Gagal memperbarui data konten",
				variant: "destructive",
			});
		} finally {
			setIsRefreshing(false);
		}
	};

	const handleDeleteClick = (id: string | number) => {
		setContentToDelete(id);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!contentToDelete) return;

		try {
			if (useMockData) {
				// Simulate deletion in mock data
				console.log("Simulating deletion in mock data mode");
				setContent(
					content.filter((item) => item.id !== contentToDelete)
				);
				toast({
					title: "Berhasil (Simulasi)",
					description: "Konten telah dihapus (simulasi)",
				});
			} else {
				// Real deletion
				await deleteContent(contentToDelete);
				setContent(
					content.filter((item) => item.id !== contentToDelete)
				);
				toast({
					title: "Berhasil",
					description: "Konten telah dihapus",
				});
			}
		} catch (error) {
			console.error("Error deleting content:", error);
			toast({
				title: "Error",
				description: "Gagal menghapus konten",
				variant: "destructive",
			});
		} finally {
			setDeleteDialogOpen(false);
			setContentToDelete(null);
		}
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			setPagination(prev => ({ ...prev, currentPage: newPage }));
		}
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
		// Reset to first page when searching
		setPagination(prev => ({ ...prev, currentPage: 1 }));
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-2xl font-bold">Manajemen Konten</h2>
					<p className="text-gray-500">
						Kelola artikel dan konten yang ditampilkan di website
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={refreshData}
						disabled={isRefreshing}>
						<RefreshCw
							className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
						/>
						Refresh
					</Button>
					<Button asChild>
						<Link href="/admin/konten/tambah">
							<Plus className="h-4 w-4 mr-2" />
							Tambah Konten
						</Link>
					</Button>
				</div>
			</div>

			{error && (
				<div
					className={`border px-4 py-3 rounded-lg ${
						useMockData
							? "bg-yellow-50 border-yellow-200 text-yellow-700"
							: "bg-red-50 border-red-200 text-red-700"
					}`}>
					{error}
				</div>
			)}

			<div className="flex items-center gap-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
					<Input
						placeholder="Cari konten..."
						value={searchQuery}
						onChange={handleSearchChange}
						className="pl-10"
					/>
				</div>
			</div>

			<div className="border rounded-lg">
				{isLoading ? (
					<div className="flex justify-center items-center p-8">
						<Loader2 className="h-8 w-8 animate-spin text-primary-dark" />
					</div>
				) : content.length === 0 ? (
					<div className="text-center p-8 text-gray-500">
						{searchQuery
							? "Tidak ada konten yang sesuai dengan pencarian"
							: "Belum ada konten"}
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Judul</TableHead>
								<TableHead>Tipe</TableHead>
								<TableHead>Tanggal Dibuat</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{content.map((item) => (
								<TableRow key={item.id}>
									<TableCell className="font-medium">{item.title}</TableCell>
									<TableCell>{item.contentType}</TableCell>
									<TableCell>{formatDate(item.createdAt)}</TableCell>
									<TableCell>
										<Badge
											variant={item.isActive === false ? "outline" : "default"}>
											{item.isActive === false ? "Draft" : "Published"}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Aksi</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem asChild>
													<Link href={`/blog/${item.slug}`} target="_blank">
														<Eye className="h-4 w-4 mr-2" />
														Lihat
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														router.push(`/admin/konten/edit/${item.id}`)
													}>
													<Pencil className="h-4 w-4 mr-2" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-red-600"
													onClick={() => handleDeleteClick(item.id)}>
													<Trash2 className="h-4 w-4 mr-2" />
													Hapus
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>

			{/* Pagination Controls */}
			{pagination.totalPages > 1 && (
				<div className="flex items-center justify-between px-4 py-3 border-t">
					<div className="flex items-center text-sm text-gray-500">
						Menampilkan {Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalItems)} hingga{" "}
						{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} dari{" "}
						{pagination.totalItems} konten
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(pagination.currentPage - 1)}
							disabled={pagination.currentPage === 1}>
							<ChevronLeft className="h-4 w-4" />
							Sebelumnya
						</Button>
						<div className="flex items-center gap-1">
							{Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
								.filter((page) => {
									const current = pagination.currentPage;
									return (
										page === 1 ||
										page === pagination.totalPages ||
										(page >= current - 1 && page <= current + 1)
									);
								})
								.map((page, index, array) => (
									<div key={page} className="flex items-center">
										{index > 0 && array[index - 1] !== page - 1 && (
											<span className="px-2 text-gray-500">...</span>
										)}
										<Button
											variant={pagination.currentPage === page ? "default" : "outline"}
											size="sm"
											onClick={() => handlePageChange(page)}
											className="min-w-[2rem]">
											{page}
										</Button>
									</div>
								))}
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(pagination.currentPage + 1)}
							disabled={pagination.currentPage === pagination.totalPages}>
							Selanjutnya
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}

			<DeleteContentDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	);
}
