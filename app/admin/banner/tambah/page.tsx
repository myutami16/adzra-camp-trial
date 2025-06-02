"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Upload, X } from "lucide-react";
import { createBanner } from "@/lib/admin-api";
import { toast } from "sonner";

export default function TambahBannerPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		location: "",
		isActive: true,
		image: null as File | null,
	});

	// Handle file input change
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
			toast.error("Format file harus JPG atau PNG");
			return;
		}

		// Validate file size (500KB = 500 * 1024 bytes)
		if (file.size > 500 * 1024) {
			toast.error("Ukuran file maksimal 500KB");
			return;
		}

		setFormData((prev) => ({ ...prev, image: file }));

		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			setImagePreview(e.target?.result as string);
		};
		reader.readAsDataURL(file);
	};

	// Remove selected image
	const removeImage = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setFormData((prev) => ({ ...prev, image: null }));
		setImagePreview(null);
		// Reset the file input
		const fileInput = document.getElementById("image") as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Reset any previous error states
		const errors: string[] = [];

		// Validasi gambar banner (wajib)
		if (!formData.image) {
			errors.push("Gambar banner wajib diisi");
			toast.error("Silakan pilih gambar banner");
		}

		// Validasi lokasi banner (wajib)
		if (!formData.location) {
			errors.push("Lokasi banner wajib dipilih");
			toast.error("Silakan pilih lokasi banner");
		}

		// Jika ada error validasi, hentikan proses
		if (errors.length > 0) {
			console.log("Validation errors:", errors);
			// Focus ke field pertama yang error
			if (!formData.image) {
				document.getElementById("image")?.focus();
			} else if (!formData.location) {
				document.getElementById("location")?.focus();
			}
			return;
		}

		try {
			setLoading(true);
			console.log("Starting banner creation process...");

			// Create FormData for API submission
			const submitData = new FormData();
			submitData.append("image", formData.image);
			submitData.append("location", formData.location);
			submitData.append("isActive", formData.isActive.toString());

			console.log("Submitting banner data:", {
				location: formData.location,
				isActive: formData.isActive,
				imageSize: formData.image.size,
				imageType: formData.image.type,
			});

			// Call API to create banner
			const result = await createBanner(submitData);
			console.log("Banner creation result:", result);

			// Show success message
			toast.success("Banner berhasil dibuat!");

			// Redirect to banner list
			router.push("/admin/banner");
		} catch (error) {
			console.error("Error creating banner:", error);

			// Show detailed error message
			const errorMessage =
				error instanceof Error ? error.message : "Gagal membuat banner";
			toast.error(`Error: ${errorMessage}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Link href="/admin/banner">
					<Button variant="outline" size="sm">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Kembali
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold">Tambah Banner</h1>
					<p className="text-gray-600">
						Buat banner baru untuk homepage atau halaman produk
					</p>
				</div>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="max-w-2xl">
				<Card>
					<CardHeader>
						<CardTitle>Informasi Banner</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Image Upload */}
						<div className="space-y-2">
							<Label htmlFor="image" className="text-sm font-medium">
								Gambar Banner <span className="text-red-500">*</span>
							</Label>
							{/* Fixed upload area with proper event handling */}
							<div
								className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
									!formData.image
										? "border-red-300 bg-red-50"
										: "border-gray-300"
								}`}>
								{imagePreview ? (
									<div className="relative">
										<div className="aspect-video relative rounded-lg overflow-hidden">
											<Image
												src={imagePreview || "/placeholder.svg"}
												alt="Preview banner"
												fill
												className="object-cover"
											/>
										</div>
										<Button
											type="button"
											variant="destructive"
											size="sm"
											className="absolute top-2 right-2 z-10"
											onClick={removeImage}>
											<X className="h-4 w-4" />
										</Button>
									</div>
								) : (
									<div className="text-center">
										<Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
										<div className="space-y-2">
											<p className="text-sm text-gray-600">
												Klik untuk upload atau drag & drop
											</p>
											<p className="text-xs text-gray-500">
												Format: JPG, PNG • Maksimal: 500KB
											</p>
											{!formData.image && (
												<p className="text-xs text-red-500">
													* Gambar banner wajib diisi
												</p>
											)}
										</div>
									</div>
								)}
								{/* File input positioned to only cover upload area when no image is selected */}
								{!imagePreview && (
									<Input
										id="image"
										type="file"
										accept="image/jpeg,image/jpg,image/png"
										onChange={handleImageChange}
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
										required
									/>
								)}
							</div>
						</div>

						{/* Location Selection */}
						<div className="space-y-2">
							<Label htmlFor="location" className="text-sm font-medium">
								Lokasi Banner <span className="text-red-500">*</span>
							</Label>
							<Select
								value={formData.location}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, location: value }))
								}
								required>
								<SelectTrigger
									id="location"
									className={!formData.location ? "border-red-300" : ""}>
									<SelectValue placeholder="Pilih lokasi banner" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="homepage">Homepage</SelectItem>
									<SelectItem value="productpage">Halaman Produk</SelectItem>
								</SelectContent>
							</Select>
							{!formData.location && (
								<p className="text-xs text-red-500">
									* Lokasi banner wajib dipilih
								</p>
							)}
							<p className="text-xs text-gray-500">
								Maksimal 5 banner per lokasi
							</p>
						</div>

						{/* Active Status */}
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor="isActive">Status Banner</Label>
								<p className="text-sm text-gray-500">
									Banner aktif akan ditampilkan di website
								</p>
							</div>
							<Switch
								id="isActive"
								checked={formData.isActive}
								onCheckedChange={(checked) =>
									setFormData((prev) => ({ ...prev, isActive: checked }))
								}
							/>
						</div>

						{/* Submit Buttons */}
						<div className="flex gap-4 pt-4">
							<Button type="submit" disabled={loading}>
								{loading ? "Menyimpan..." : "Simpan Banner"}
							</Button>
							<Link href="/admin/banner">
								<Button type="button" variant="outline" disabled={loading}>
									Batal
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</form>

			{/* Information Card */}
			<Card className="max-w-2xl">
				<CardHeader>
					<CardTitle className="text-lg">Informasi Penting</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex items-start gap-2">
						<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
						<p className="text-sm text-gray-600">
							Maksimal 5 banner per lokasi (Homepage atau Halaman Produk)
						</p>
					</div>
					<div className="flex items-start gap-2">
						<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
						<p className="text-sm text-gray-600">
							Ukuran file gambar maksimal 500KB dengan format JPG atau PNG
						</p>
					</div>
					<div className="flex items-start gap-2">
						<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
						<p className="text-sm text-gray-600">
							Banner yang aktif akan langsung ditampilkan di website
						</p>
					</div>
					<div className="flex items-start gap-2">
						<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
						<p className="text-sm text-gray-600">
							Gunakan gambar dengan rasio aspek 16:9 untuk hasil terbaik
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
