"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createProduct } from "@/lib/admin-api";
import { getToken } from "@/lib/auth";

// Product categories
const PRODUCT_CATEGORIES = [
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

export default function AddProductPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		namaProduk: "",
		deskripsi: "",
		harga: "",
		stok: "",
		kategori: PRODUCT_CATEGORIES[0],
		isForSale: true,
		isForRent: false,
	});
	const [image, setImage] = useState<File | null>(null);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData({ ...formData, [name]: value });
	};

	const handleSwitchChange = (name: string, checked: boolean) => {
		if (name === "isForSale" && checked) {
			setFormData({ ...formData, isForSale: true, isForRent: false });
		} else if (name === "isForRent" && checked) {
			setFormData({ ...formData, isForSale: false, isForRent: true });
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Check if token exists before submitting
			const token = getToken();
			if (!token) {
				toast({
					title: "Autentikasi Diperlukan",
					description:
						"Silakan login terlebih dahulu sebelum menambahkan produk",
					variant: "destructive",
				});
				router.push("/admin/login");
				return;
			}

			// Validate form data
			if (
				!formData.namaProduk ||
				!formData.deskripsi ||
				!formData.harga ||
				!formData.stok ||
				!image
			) {
				toast({
					title: "Data Tidak Lengkap",
					description: "Harap isi semua field yang diperlukan",
					variant: "destructive",
				});
				return;
			}

			// Create FormData object for multipart/form-data
			const productFormData = new FormData();
			productFormData.append("namaProduk", formData.namaProduk);
			productFormData.append("deskripsi", formData.deskripsi);
			productFormData.append("harga", formData.harga);
			productFormData.append("stok", formData.stok);
			productFormData.append("kategori", formData.kategori);
			productFormData.append("isForSale", formData.isForSale.toString());
			productFormData.append("isForRent", formData.isForRent.toString());

			if (image) {
				productFormData.append("gambar", image);
			}

			await createProduct(productFormData);

			toast({
				title: "Berhasil",
				description: "Produk berhasil ditambahkan",
			});

			router.push("/admin/produk");
		} catch (error: any) {
			console.error("Error creating product:", error);

			let errorMessage = "Gagal menambahkan produk";
			if (error.message.includes("Failed to fetch")) {
				errorMessage =
					"Gagal terhubung ke server. Periksa koneksi internet Anda.";
			} else if (error.message.includes("Authentication")) {
				errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
				router.push("/admin/login");
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			}

			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center">
				<Button variant="ghost" onClick={() => router.back()} className="mr-4">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Kembali
				</Button>
				<div>
					<h2 className="text-2xl font-bold">Tambah Produk</h2>
					<p className="text-gray-500">Tambahkan produk baru ke website</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-8">
				<Card>
					<CardContent className="pt-6">
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="namaProduk">Nama Produk</Label>
									<Input
										id="namaProduk"
										name="namaProduk"
										value={formData.namaProduk}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="kategori">Kategori</Label>
									<Select
										value={formData.kategori}
										onValueChange={(value) =>
											handleSelectChange("kategori", value)
										}>
										<SelectTrigger id="kategori">
											<SelectValue placeholder="Pilih kategori" />
										</SelectTrigger>
										<SelectContent>
											{PRODUCT_CATEGORIES.map((category) => (
												<SelectItem key={category} value={category}>
													{category}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="deskripsi">Deskripsi</Label>
								<Textarea
									id="deskripsi"
									name="deskripsi"
									value={formData.deskripsi}
									onChange={handleChange}
									rows={5}
									required
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="harga">Harga (Rp)</Label>
									<Input
										id="harga"
										name="harga"
										type="number"
										value={formData.harga}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="stok">Stok</Label>
									<Input
										id="stok"
										name="stok"
										type="number"
										value={formData.stok}
										onChange={handleChange}
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="gambar">Gambar Produk</Label>
								<Input
									id="gambar"
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									required
								/>
							</div>

							<div className="space-y-4">
								<Label>Status Produk</Label>
								<div className="space-y-3">
									<div className="flex items-center space-x-2">
										<input
											type="radio"
											id="forSale"
											name="productStatus"
											value="sale"
											checked={formData.isForSale && !formData.isForRent}
											onChange={() =>
												handleSwitchChange("isForSale", true) &&
												handleSwitchChange("isForRent", false)
											}
											className="w-4 h-4 text-blue-600"
										/>
										<Label htmlFor="forSale" className="cursor-pointer">
											Tersedia untuk Dijual
										</Label>
									</div>

									<div className="flex items-center space-x-2">
										<input
											type="radio"
											id="forRent"
											name="productStatus"
											value="rent"
											checked={formData.isForRent && !formData.isForSale}
											onChange={() =>
												handleSwitchChange("isForRent", true) &&
												handleSwitchChange("isForSale", false)
											}
											className="w-4 h-4 text-blue-600"
										/>
										<Label htmlFor="forRent" className="cursor-pointer">
											Tersedia untuk Disewa
										</Label>
									</div>
								</div>
								<p className="text-sm text-gray-500">
									Pilih salah satu status untuk produk ini
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.back()}
						className="mr-2">
						Batal
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Menyimpan...
							</>
						) : (
							"Simpan Produk"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
