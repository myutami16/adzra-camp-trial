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
	RefreshCw,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatRupiah, formatDate } from "@/lib/utils";
import DeleteProductDialog from "@/components/admin/delete-product-dialog";
import { fetchAdminProducts, deleteProduct } from "@/lib/admin-api";

interface Product {
	_id: string;
	id?: string; // Added as it might come from API
	namaProduk: string;
	deskripsi: string;
	harga: number;
	stok: number;
	isForRent: boolean;
	isForSale: boolean;
	kategori: string;
	gambar: string;
	cloudinary_id?: string;
	createdAt: string;
	slug: string;
}

interface Pagination {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
}

// Mock data for development mode
const MOCK_PRODUCTS: Product[] = [
	{
		_id: "682a9282400056a7c4ed8910",
		namaProduk: "TaffLED Lampu Tenda",
		deskripsi: "TaffLED Lampu Tenda",
		harga: 20000,
		stok: 1,
		isForRent: false, // Pastikan hanya satu yang true
		isForSale: true, // dan yang lain false
		kategori: "Lampu",
		gambar:
			"https://res.cloudinary.com/dpsslfumw/image/upload/v1747620482/camping-store/products/lfvamjo6uyjpqbyzxlbs.jpg",
		cloudinary_id: "camping-store/products/lfvamjo6uyjpqbyzxlbs",
		createdAt: "2025-05-19T02:08:02.902Z",
		slug: "taffled-lampu-tenda-482906",
	},
	{
		_id: "682a92b8400056a7c4ed8912",
		namaProduk: "Tenda Dome Kapasitas 4 Orang",
		deskripsi: "Tenda dome kapasitas 4 orang dengan lapisan waterproof",
		harga: 100000,
		stok: 5,
		isForRent: true, // Contoh produk rental
		isForSale: false, // Pastikan yang lain false
		kategori: "Tenda",
		gambar:
			"https://res.cloudinary.com/dpsslfumw/image/upload/v1747620482/camping-store/products/abcdef123456.jpg",
		cloudinary_id: "camping-store/products/abcdef123456",
		createdAt: "2025-05-19T02:10:02.902Z",
		slug: "tenda-dome-kapasitas-4-orang-123456",
	},
];

const ITEMS_PER_PAGE = 10; // Fixed constant for items per page

export default function AdminProductsPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [products, setProducts] = useState<Product[]>([]);
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
	const [productToDelete, setProductToDelete] = useState<string | null>(null);
	const [useMockData, setUseMockData] = useState(false);

	useEffect(() => {
		fetchProductData();
	}, [pagination.currentPage, searchQuery]); // Added searchQuery to dependencies

	const fetchProductData = async (page = pagination.currentPage) => {
		setIsLoading(true);
		setError(null);
		setUseMockData(false);

		try {
			console.log(`Fetching products for admin panel, page: ${page}...`);
			const params = {
				page: page.toString(),
				limit: ITEMS_PER_PAGE.toString(), // Use fixed constant
				...(searchQuery && { search: searchQuery }), // Add search parameter if query exists
			};
			const result = await fetchAdminProducts(params);
			console.log("Admin products data:", result);

			// Check if the data is correctly structured
			if (result && Array.isArray(result.products)) {
				// Map the products to ensure consistent format
				const formattedProducts = result.products.map((product) => ({
					_id: product._id || product.id,
					id: product.id,
					namaProduk: product.namaProduk,
					deskripsi: product.deskripsi || "",
					harga: product.harga,
					stok: product.stok,
					isForRent: product.isForRent || false,
					isForSale: product.isForSale || false,
					kategori: product.kategori || "",
					gambar: product.gambar || "",
					createdAt: product.createdAt || new Date().toISOString(),
					slug: product.slug || "",
				}));

				setProducts(formattedProducts);
				
				// Update pagination with fixed itemsPerPage
				if (result.pagination) {
					setPagination({
						...result.pagination,
						itemsPerPage: ITEMS_PER_PAGE, // Always use fixed constant
					});
				}
			} else {
				console.warn("Unexpected products data format:", result);

				// In development mode, use mock data
				if (process.env.NODE_ENV === "development") {
					console.log("Using mock data in development mode");
					
					// Filter mock data based on search query
					const filteredMockProducts = searchQuery
						? MOCK_PRODUCTS.filter(product =>
								product.namaProduk.toLowerCase().includes(searchQuery.toLowerCase()) ||
								product.kategori.toLowerCase().includes(searchQuery.toLowerCase())
						  )
						: MOCK_PRODUCTS;
					
					setProducts(filteredMockProducts);
					setPagination({
						currentPage: 1,
						totalPages: 1,
						totalItems: filteredMockProducts.length,
						itemsPerPage: ITEMS_PER_PAGE,
					});
					setUseMockData(true);
					setError(
						"Menggunakan data contoh karena API tidak tersedia. Ini hanya untuk mode pengembangan."
					);
				} else {
					setProducts([]);
					setPagination({
						currentPage: 1,
						totalPages: 1,
						totalItems: 0,
						itemsPerPage: ITEMS_PER_PAGE,
					});
					setError("Data produk tidak dalam format yang diharapkan");
				}
			}
		} catch (error) {
			console.error("Error fetching products:", error);

			// In development mode, use mock data
			if (process.env.NODE_ENV === "development") {
				console.log("Using mock data in development mode due to error");
				
				// Filter mock data based on search query
				const filteredMockProducts = searchQuery
					? MOCK_PRODUCTS.filter(product =>
							product.namaProduk.toLowerCase().includes(searchQuery.toLowerCase()) ||
							product.kategori.toLowerCase().includes(searchQuery.toLowerCase())
					  )
					: MOCK_PRODUCTS;
				
				setProducts(filteredMockProducts);
				setPagination({
					currentPage: 1,
					totalPages: 1,
					totalItems: filteredMockProducts.length,
					itemsPerPage: ITEMS_PER_PAGE,
				});
				setUseMockData(true);
				setError(
					"Gagal memuat data produk. Menggunakan data contoh untuk mode pengembangan."
				);
			} else {
				setProducts([]);
				setPagination({
					currentPage: 1,
					totalPages: 1,
					totalItems: 0,
					itemsPerPage: ITEMS_PER_PAGE,
				});
				setError("Gagal memuat data produk. Silakan coba lagi.");
				toast({
					title: "Error",
					description: "Gagal memuat data produk",
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
			await fetchProductData();
			toast({
				title: "Berhasil",
				description: "Data produk berhasil diperbarui",
			});
		} catch (error) {
			console.error("Error refreshing products:", error);
			toast({
				title: "Error",
				description: "Gagal memperbarui data produk",
				variant: "destructive",
			});
		} finally {
			setIsRefreshing(false);
		}
	};

	const handleDeleteClick = (id: string) => {
		console.log(`Delete clicked for product ID: ${id}`);
		setProductToDelete(id);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!productToDelete) return;

		console.log(`Confirming deletion of product ID: ${productToDelete}`);

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
				console.log(`Calling deleteProduct API for ID: ${productToDelete}`);
				await deleteProduct(productToDelete);
				console.log(`Product with ID ${productToDelete} successfully deleted`);

				// Update the UI by removing the deleted product
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
					<h2 className="text-2xl font-bold">Manajemen Produk</h2>
					<p className="text-gray-500">
						Kelola produk yang ditampilkan di website
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
						<Link href="/admin/produk/tambah">
							<Plus className="h-4 w-4 mr-2" />
							Tambah Produk
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
						placeholder="Cari produk..."
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
				) : products.length === 0 ? (
					<div className="text-center p-8 text-gray-500">
						{searchQuery
							? "Tidak ada produk yang sesuai dengan pencarian"
							: "Belum ada produk"}
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Nama Produk</TableHead>
								<TableHead>Kategori</TableHead>
								<TableHead>Harga</TableHead>
								<TableHead>Stok</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{products.map((product) => (
								<TableRow key={product._id}>
									<TableCell className="font-medium">
										{product.namaProduk}
									</TableCell>
									<TableCell>{product.kategori}</TableCell>
									<TableCell>{formatRupiah(product.harga)}</TableCell>
									<TableCell>{product.stok}</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											{product.isForRent && (
												<Badge
													variant="outline"
													className="bg-blue-50 text-blue-700 border-blue-200">
													Disewakan
												</Badge>
											)}
											{product.isForSale && (
												<Badge
													variant="outline"
													className="bg-green-50 text-green-700 border-green-200">
													Dijual
												</Badge>
											)}
										</div>
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
												<DropdownMenuItem
													onClick={() =>
														router.push(`/admin/produk/edit/${product._id}`)
													}>
													<Pencil className="h-4 w-4 mr-2" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-red-600"
													onClick={() => handleDeleteClick(product._id)}>
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
						{pagination.totalItems} produk
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

			<DeleteProductDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	);
}
