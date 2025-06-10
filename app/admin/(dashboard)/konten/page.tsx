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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchAdminContent, deleteContent } from "@/lib/admin-api";
import { formatDate } from "@/lib/utils";
import DeleteContentDialog from "@/components/admin/delete-content-dialog";
import { fetchAdminProducts, deleteProduct } from "@/lib/admin-api";

interface Content {
	id: string | number;
	title: string;
	slug: string;
	contentType: string;
	createdAt: string;
	isActive?: boolean;
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

export default function AdminContentPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [content, setContent] = useState<Content[]>([]);
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
	}, []);

	const fetchContentData = async () => {
		setIsLoading(true);
		setError(null);
		setUseMockData(false);

		try {
			console.log("Fetching content for admin panel...");
			const data = await fetchAdminContent();
			console.log("Admin content data:", data);

			if (Array.isArray(data.content) && data.content.length > 0) {
				setContent(data.content);
			} else {
				console.warn("Unexpected content data format or empty content:", data);

				// In development mode, use mock data
				if (process.env.NODE_ENV === "development") {
					console.log("Using mock data in development mode");
					setContent(MOCK_CONTENT);
					setUseMockData(true);
					setError(
						"Menggunakan data contoh karena API tidak tersedia. Ini hanya untuk mode pengembangan."
					);
				} else {
					setContent([]);
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
				setContent(MOCK_CONTENT);
				setUseMockData(true);
				setError(
					"Gagal memuat data konten. Menggunakan data contoh untuk mode pengembangan."
				);
			} else {
				setContent([]);
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
		if (!productToDelete) return;

		try {
			if (useMockData) {
				// Simulate deletion in mock data
				console.log("Simulating deletion in mock data mode");
				setProducts(
					products.filter((product) => product._id !== productToDelete)
				);
				toast({
					title: "Berhasil (Simulasi)",
					description: "Produk telah dihapus (simulasi)",
				});
			} else {
				// Real deletion
				await deleteProduct(productToDelete);
				setProducts(
					products.filter((product) => product._id !== productToDelete)
				);
				toast({
					title: "Berhasil",
					description: "Produk telah dihapus",
				});
			}
		} catch (error) {
			console.error("Error deleting product:", error);
			toast({
				title: "Error",
				description: "Gagal menghapus produk",
				variant: "destructive",
			});
		} finally {
			setDeleteDialogOpen(false);
			setProductToDelete(null);
		}
	};

	const filteredContent = content.filter(
		(item) =>
			item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.contentType?.toLowerCase().includes(searchQuery.toLowerCase())
	);

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
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			<div className="border rounded-lg">
				{isLoading ? (
					<div className="flex justify-center items-center p-8">
						<Loader2 className="h-8 w-8 animate-spin text-primary-dark" />
					</div>
				) : filteredContent.length === 0 ? (
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
							{filteredContent.map((item) => (
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

			<DeleteContentDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	);
}
