"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getProductById, updateProduct } from "@/lib/admin-api";
import Link from "next/link";

// Form schema
const formSchema = z.object({
	namaProduk: z
		.string()
		.min(3, { message: "Nama produk harus minimal 3 karakter" }),
	deskripsi: z
		.string()
		.min(10, { message: "Deskripsi harus minimal 10 karakter" }),
	harga: z.coerce.number().min(0, { message: "Harga tidak boleh negatif" }),
	stok: z.coerce.number().min(0, { message: "Stok tidak boleh negatif" }),
	kategori: z.string(),
	isForSale: z.boolean().default(true),
	isForRent: z.boolean().default(false),
	image: z.any().optional(), // For file input
});

type FormValues = z.infer<typeof formSchema>;

export default function EditProductPage({
	params,
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentImage, setCurrentImage] = useState<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	// Initialize form
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			namaProduk: "",
			deskripsi: "",
			harga: 0,
			stok: 0,
			kategori: "Lainnya",
			isForSale: true,
			isForRent: false,
			image: undefined,
		},
	});

	// Fetch product data
	useEffect(() => {
		const fetchProduct = async () => {
			setIsLoading(true);
			setError(null);
			try {
				// Get product data from the API using admin-api function
				const product = await getProductById(params.id);
				console.log("Fetched product:", product);
				if (product) {
					// Set form values
					form.reset({
						namaProduk: product.namaProduk || "",
						deskripsi: product.deskripsi || "",
						harga: product.harga || 0,
						stok: product.stok || 0,
						kategori: product.kategori || "Lainnya",
						isForSale: product.isForSale !== false,
						isForRent: product.isForRent === true,
						image: undefined,
					});

					// Set current image
					if (product.gambar) {
						setCurrentImage(product.gambar);
					}
				} else {
					setError("Produk tidak ditemukan");
				}
			} catch (error) {
				console.error("Error fetching product:", error);
				setError("Gagal memuat data produk");
				toast({
					title: "Error",
					description: "Gagal memuat data produk",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchProduct();
	}, [params.id, form, toast]);

	// Handle image change and preview
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setValue("image", file);
			const fileUrl = URL.createObjectURL(file);
			setPreviewUrl(fileUrl);
		}
	};

	// Handle form submission
	// Handle form submission with improved error handling
	const onSubmit = async (values: FormValues) => {
		setIsSaving(true);
		setError(null);

		try {
			const formData = new FormData();
			formData.append("namaProduk", values.namaProduk);
			formData.append("deskripsi", values.deskripsi);
			formData.append("harga", values.harga.toString());
			formData.append("stok", values.stok.toString());
			formData.append("kategori", values.kategori);
			formData.append("isForSale", values.isForSale.toString());
			formData.append("isForRent", values.isForRent.toString());

			// Add image if selected
			if (values.image instanceof File) {
				formData.append("image", values.image);
			}

			console.log("Submitting form data:", Object.fromEntries(formData));
			console.log("Using product ID:", params.id);

			// Update product data using admin-api function
			try {
				const result = await updateProduct(params.id, formData);
				console.log("Update response:", result);

				if (result.success) {
					toast({
						title: "Berhasil",
						description: "Produk berhasil diperbarui",
					});

					// Redirect back to product list
					router.push("/admin/produk");
				} else {
					throw new Error(result.message || "Gagal memperbarui produk");
				}
			} catch (apiError: any) {
				console.error("API error:", apiError);
				const errorMessage = apiError.message || "Gagal memperbarui produk";
				setError(`Error API: ${errorMessage}`);
				toast({
					title: "Error",
					description: errorMessage,
					variant: "destructive",
				});
			}
		} catch (formError: any) {
			console.error("Form submission error:", formError);
			setError(`Error pada form: ${formError.message || "Terjadi kesalahan"}`);
			toast({
				title: "Error",
				description: "Terjadi kesalahan saat memproses form",
				variant: "destructive",
			});
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-primary-dark" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button variant="outline" size="icon" asChild>
						<Link href="/admin/produk">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<h2 className="text-2xl font-bold">Edit Produk</h2>
				</div>
			</div>

			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
					{error}
				</div>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Informasi Produk</CardTitle>
					<CardDescription>
						Edit informasi produk yang akan ditampilkan di website
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="namaProduk"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nama Produk</FormLabel>
										<FormControl>
											<Input placeholder="Masukkan nama produk" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="deskripsi"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Deskripsi</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Masukkan deskripsi produk"
												className="min-h-[150px]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="harga"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Harga (Rp)</FormLabel>
											<FormControl>
												<Input type="number" placeholder="0" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="stok"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Stok</FormLabel>
											<FormControl>
												<Input type="number" placeholder="0" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="kategori"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Kategori</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Pilih kategori produk" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Tenda Camping">
													Tenda Camping
												</SelectItem>
												<SelectItem value="Aksesori">Aksesori</SelectItem>
												<SelectItem value="Sleeping Bag">
													Sleeping Bag
												</SelectItem>
												<SelectItem value="Perlengkapan Outdoor & Survival">
													Perlengkapan Outdoor & Survival
												</SelectItem>
												<SelectItem value="Lampu">Lampu</SelectItem>
												<SelectItem value="Carrier & Ransel">
													Carrier & Ransel
												</SelectItem>
												<SelectItem value="Peralatan Memasak Outdoor">
													Peralatan Memasak Outdoor
												</SelectItem>
												<SelectItem value="Lainnya">Lainnya</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="image"
								render={({ field: { value, onChange, ...fieldProps } }) => (
									<FormItem>
										<FormLabel>Gambar</FormLabel>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<FormControl>
													<Input
														type="file"
														accept="image/*"
														onChange={(e) => {
															handleImageChange(e);
															// This ensures the form field value is updated
															onChange(e.target.files?.[0] || null);
														}}
														{...fieldProps}
													/>
												</FormControl>
												<FormDescription>
													Pilih gambar baru untuk mengganti gambar saat ini
												</FormDescription>
											</div>
											<div className="flex justify-center items-center">
												{previewUrl ? (
													<img
														src={previewUrl || "/placeholder.svg"}
														alt="Preview"
														className="max-h-[150px] object-contain border rounded"
													/>
												) : currentImage ? (
													<img
														src={currentImage || "/placeholder.svg"}
														alt="Current"
														className="max-h-[150px] object-contain border rounded"
													/>
												) : (
													<div className="h-[150px] w-full bg-gray-100 flex items-center justify-center text-gray-500 border rounded">
														Tidak ada gambar
													</div>
												)}
											</div>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Hapus bagian checkbox yang lama dan ganti dengan radio button group */}
							<div className="space-y-4">
								<FormLabel>Status Produk</FormLabel>
								<div className="space-y-3 border rounded-md p-4">
									<div className="flex items-center space-x-2">
										<input
											type="radio"
											id="editForSale"
											name="editProductStatus"
											value="sale"
											checked={
												form.watch("isForSale") && !form.watch("isForRent")
											}
											onChange={() => {
												form.setValue("isForSale", true);
												form.setValue("isForRent", false);
											}}
											className="w-4 h-4 text-blue-600"
										/>
										<FormLabel
											htmlFor="editForSale"
											className="cursor-pointer font-normal">
											Tersedia untuk Dijual
										</FormLabel>
									</div>

									<div className="flex items-center space-x-2">
										<input
											type="radio"
											id="editForRent"
											name="editProductStatus"
											value="rent"
											checked={
												form.watch("isForRent") && !form.watch("isForSale")
											}
											onChange={() => {
												form.setValue("isForSale", false);
												form.setValue("isForRent", true);
											}}
											className="w-4 h-4 text-blue-600"
										/>
										<FormLabel
											htmlFor="editForRent"
											className="cursor-pointer font-normal">
											Tersedia untuk Disewa
										</FormLabel>
									</div>
								</div>
								<FormDescription>
									Pilih salah satu status untuk produk ini
								</FormDescription>
							</div>

							<div className="flex justify-end">
								<Button type="submit" disabled={isSaving}>
									{isSaving ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Menyimpan...
										</>
									) : (
										<>
											<Save className="mr-2 h-4 w-4" />
											Simpan Perubahan
										</>
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
