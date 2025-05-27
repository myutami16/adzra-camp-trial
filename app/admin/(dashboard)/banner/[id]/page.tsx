"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
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
import { getBannerById, updateBanner } from "@/lib/admin-api";
import { toast } from "sonner";

// Interface untuk banner data
interface Banner {
	id: string;
	image: string;
	location: "homepage" | "productpage";
	isActive: boolean;
	createdAt: string;
}

export default function EditBannerPage() {
	const router = useRouter();
	const params = useParams();
	const bannerId = params.id as string;

	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [banner, setBanner] = useState<Banner | null>(null);
	const [formData, setFormData] = useState({
		location: "",
		isActive: true,
		image: null as File | null,
	});

	// Fetch banner data on component mount
	useEffect(() => {
		const fetchBanner = async () => {
			try {
				setInitialLoading(true);
				console.log(`Fetching banner with ID: ${bannerId}`);

				const bannerData = await getBannerById(bannerId);
				console.log("Banner data received:", bannerData);

				setBanner(bannerData);
				setFormData({
					location: bannerData.location,
					isActive: bannerData.isActive,
					image: null, // Keep null since we're not changing the image initially
				});
				setImagePreview(bannerData.image); // Show current image as preview
			} catch (error) {
				console.error("Error fetching banner:", error);
				toast.error("Gagal memuat data banner");
				router.push("/admin/banner");
			} finally {
				setInitialLoading(false);
			}
		};

		if (bannerId) {
			fetchBanner();
		}
	}, [bannerId, router]);

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

	// Remove selected image (revert to original)
	const removeImage = () => {
		setFormData((prev) => ({ ...prev, image: null }));
		setImagePreview(banner?.image || null);
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.location) {
			toast.error("Silakan pilih lokasi banner");
			return;
		}

		try {
			setLoading(true);

			// Create FormData for API submission
			const submitData = new FormData();

			// Only append image if a new one was selected
			if (formData.image) {
				submitData.append("image", formData.image);
			}

			submitData.append("location", formData.location);
			submitData.append("isActive", formData.isActive.toString());

			console.log("Updating banner data:", {
				bannerId,
				location: formData.location,
				isActive: formData.isActive,
				hasNewImage: !!formData.image,
				imageSize: formData.image?.size,
				imageType: formData.image?.type,
			});

			await updateBanner(bannerId, submitData);

			toast.success("Banner berhasil diperbarui");
			router.push("/admin/banner");
		} catch (error) {
			console.error("Error updating banner:", error);
			toast.error(
				error instanceof Error ? error.message : "Gagal memperbarui banner"
			);
		} finally {
			setLoading(false);
		}
	};

	// Get location display name
	const getLocationDisplayName = (location: string) => {
		return location === "homepage" ? "Homepage" : "Halaman Produk";
	};

	if (initialLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
					<div>
						<div className="w-40 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
						<div className="w-60 h-4 bg-gray-200 rounded animate-pulse"></div>
					</div>
				</div>
				<div className="max-w-2xl">
					<Card>
						<CardHeader>
							<div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="aspect-video bg-gray-200 rounded animate-pulse"></div>
							<div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
							<div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (!banner) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Link href="/admin/banner">
						<Button variant="outline" size="sm">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Kembali
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold">Banner Tidak Ditemukan</h1>
						<p className="text-gray-600">
							Banner yang Anda cari tidak dapat ditemukan
						</p>
					</div>
				</div>
			</div>
		);
	}

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
					<h1 className="text-3xl font-bold">Edit Banner</h1>
					<p className="text-gray-600">
						Edit banner untuk {getLocationDisplayName(banner.location)}
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
						{/* Current Image Display */}
						<div className="space-y-2">
							<Label>Gambar Banner Saat Ini</Label>
							<div className="aspect-video relative rounded-lg overflow-hidden border">
								<Image
									src={imagePreview || banner.image}
									alt={`Banner ${getLocationDisplayName(banner.location)}`}
									fill
									className="object-cover"
								/>
							</div>
						</div>

						{/* Image Upload */}
						<div className="space-y-2">
							<Label htmlFor="image">Ganti Gambar Banner (Opsional)</Label>
							<div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
								{formData.image ? (
									<div className="relative">
										<div className="aspect-video relative rounded-lg overflow-hidden">
											<Image
												src={imagePreview! || "/placeholder.svg"}
												alt="Preview banner baru"
												fill
												className="object-cover"
											/>
										</div>
										<Button
											type="button"
											variant="destructive"
											size="sm"
											className="absolute top-2 right-2"
											onClick={removeImage}>
											<X className="h-4 w-4" />
										</Button>
									</div>
								) : (
									<div className="text-center">
										<Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
										<div className="space-y-2">
											<p className="text-sm text-gray-600">
												Klik untuk upload gambar baru atau drag & drop
											</p>
											<p className="text-xs text-gray-500">
												Format: JPG, PNG • Maksimal: 500KB
											</p>
											<p className="text-xs text-gray-400">
												Kosongkan jika tidak ingin mengubah gambar
											</p>
										</div>
									</div>
								)}
								<Input
									id="image"
									type="file"
									accept="image/jpeg,image/jpg,image/png"
									onChange={handleImageChange}
									className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
								/>
							</div>
						</div>

						{/* Location Selection */}
						<div className="space-y-2">
							<Label htmlFor="location">Lokasi Banner *</Label>
							<Select
								value={formData.location}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, location: value }))
								}>
								<SelectTrigger>
									<SelectValue placeholder="Pilih lokasi banner" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="homepage">Homepage</SelectItem>
									<SelectItem value="productpage">Halaman Produk</SelectItem>
								</SelectContent>
							</Select>
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
								{loading ? "Menyimpan..." : "Simpan Perubahan"}
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
							Jika tidak mengganti gambar, gambar lama akan tetap digunakan
						</p>
					</div>
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
							Perubahan status aktif/nonaktif akan langsung berlaku di website
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
