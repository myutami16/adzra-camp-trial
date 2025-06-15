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
import { ArrowLeft, Upload, X, Crop } from "lucide-react";
import { createBanner } from "@/lib/admin-api";
import { toast } from "sonner";
import BannerImageCropper from "@/components/admin/BannerImageCropper";
import { fileToDataUrl } from "@/utils/bannerCropUtils";
import ErrorDialog from "@/components/admin/ErrorDialog";

export default function TambahBannerPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [showCropper, setShowCropper] = useState(false);
	const [originalFile, setOriginalFile] = useState<File | null>(null);
	const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		location: "",
		isActive: true,
		targetUrl: "", // Added targetUrl field
		image: null as File | null,
	});

	// Error Dialog state
	const [errorDialog, setErrorDialog] = useState({
		isOpen: false,
		title: "",
		message: "",
		type: "error" as "error" | "warning" | "info",
	});

	// Function to show error dialog
	const showErrorDialog = (
		message: string,
		title?: string,
		type: "error" | "warning" | "info" = "error"
	) => {
		setErrorDialog({
			isOpen: true,
			title: title || "",
			message,
			type,
		});
	};

	// Function to close error dialog
	const closeErrorDialog = () => {
		setErrorDialog({
			isOpen: false,
			title: "",
			message: "",
			type: "error",
		});
	};

	// Handle file input change
	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		console.log("File selected:", file);

		// Validate file type
		if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
			toast.error("Format file harus JPG atau PNG");
			return;
		}

		// Validate file size (5MB for original, we'll compress after crop)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Ukuran file maksimal 5MB");
			return;
		}

		try {
			// Store original file and create data URL for cropping
			setOriginalFile(file);
			const dataUrl = await fileToDataUrl(file);
			console.log("Data URL created for cropping");
			setCropImageUrl(dataUrl);
			setShowCropper(true);

			// Clear any existing preview since we're going to crop
			setImagePreview(null);
			setFormData((prev) => ({ ...prev, image: null }));
		} catch (error) {
			console.error("Error preparing image for crop:", error);
			toast.error("Gagal memproses gambar");
		}
	};

	// Handle crop completion
	const handleCropComplete = (croppedFile: File) => {
		console.log("Crop completed, received file:", croppedFile);
		console.log("File details:", {
			name: croppedFile.name,
			size: croppedFile.size,
			type: croppedFile.type,
		});

		// Check if cropped file size exceeds 500KB
		if (croppedFile.size > 500 * 1024) {
			showErrorDialog("Ukuran gambar melebihi 500 KB.", "Error Upload");
			return;
		}

		// Update form data with cropped file
		setFormData((prev) => ({ ...prev, image: croppedFile }));

		// Create preview from cropped file
		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			console.log("Preview created from cropped file");
			setImagePreview(result);
		};
		reader.onerror = (error) => {
			console.error("Error creating preview:", error);
			toast.error("Gagal membuat preview gambar");
		};
		reader.readAsDataURL(croppedFile);

		// Hide cropper
		setShowCropper(false);
		setCropImageUrl(null);

		toast.success("Gambar berhasil di-crop dan siap digunakan!");
	};

	// Handle crop cancel
	const handleCropCancel = () => {
		console.log("Crop cancelled");
		setShowCropper(false);
		setCropImageUrl(null);
		setOriginalFile(null);

		// Reset file input
		const fileInput = document.getElementById("image") as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	};

	// Open cropper for existing image
	const handleEditCrop = async () => {
		if (!formData.image) return;

		try {
			const dataUrl = await fileToDataUrl(formData.image);
			setCropImageUrl(dataUrl);
			setShowCropper(true);
		} catch (error) {
			console.error("Error preparing image for re-crop:", error);
			toast.error("Gagal membuka editor crop");
		}
	};

	// Remove selected image
	const removeImage = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		console.log("Removing image");

		setFormData((prev) => ({ ...prev, image: null }));
		setImagePreview(null);
		setOriginalFile(null);

		// Reset the file input
		const fileInput = document.getElementById("image") as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}

		toast.success("Gambar dihapus");
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Reset any previous error states
		const errors: string[] = [];

		// Validate image size before submission
		if (formData.image && formData.image.size > 500 * 1024) {
			showErrorDialog("Ukuran gambar melebihi 500 KB.", "Error Upload");
			return;
		}

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
			if (formData.image) {
				submitData.append("image", formData.image);
			}
			submitData.append("location", formData.location);
			submitData.append("isActive", formData.isActive.toString());

			// Add targetUrl if provided
			if (formData.targetUrl.trim()) {
				submitData.append("targetUrl", formData.targetUrl.trim());
			}

			console.log("Submitting banner data:", {
				location: formData.location,
				isActive: formData.isActive,
				targetUrl: formData.targetUrl.trim(),
				imageSize: formData.image?.size,
				imageType: formData.image?.type,
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

			// Handle specific error cases
			if (error instanceof Error) {
				const errorMessage = error.message.toLowerCase();

				// Check if error is related to quota limit
				if (
					errorMessage.includes("quota") ||
					errorMessage.includes("limit") ||
					errorMessage.includes("maksimal") ||
					errorMessage.includes("maximum")
				) {
					showErrorDialog(
						"Kuota upload banner telah terpenuhi.",
						"Error Kuota"
					);
				} else {
					// Show general error in dialog
					showErrorDialog(error.message, "Error");
				}
			} else {
				// Show general error message for unknown errors
				showErrorDialog("Gagal membuat banner. Silakan coba lagi.", "Error");
			}
		} finally {
			setLoading(false);
		}
	};

	// Show cropper if active
	if (showCropper && cropImageUrl) {
		return (
			<div className="space-y-6">
				<BannerImageCropper
					image={cropImageUrl}
					onCropComplete={handleCropComplete}
					onCancel={handleCropCancel}
					originalFileName={originalFile?.name || "banner.jpg"}
				/>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Error Dialog */}
			<ErrorDialog
				isOpen={errorDialog.isOpen}
				onClose={closeErrorDialog}
				title={errorDialog.title}
				message={errorDialog.message}
				type={errorDialog.type}
			/>

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
							{/* Upload area with proper event handling */}
							<div
								className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
									!formData.image
										? "border-red-300 bg-red-50"
										: "border-gray-300"
								}`}>
								{imagePreview ? (
									<div className="relative">
										<div className="aspect-[2.4] relative rounded-lg overflow-hidden">
											<Image
												src={imagePreview}
												alt="Preview banner"
												fill
												className="object-cover"
											/>
										</div>
										<div className="absolute top-2 right-2 flex gap-2 z-10">
											<Button
												type="button"
												variant="secondary"
												size="sm"
												onClick={handleEditCrop}
												className="bg-white/90 hover:bg-white">
												<Crop className="h-4 w-4" />
											</Button>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												onClick={removeImage}
												className="bg-red-500/90 hover:bg-red-500">
												<X className="h-4 w-4" />
											</Button>
										</div>
										{/* Image info overlay */}
										<div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
											{formData.image && (
												<>
													{Math.round(formData.image.size / 1024)}KB
													<span className="mx-1">•</span>
													2.4:1 Ratio
												</>
											)}
										</div>
									</div>
								) : (
									<div className="text-center">
										<Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
										<div className="space-y-2">
											<p className="text-sm text-gray-600">
												Klik untuk upload atau drag & drop
											</p>
											<p className="text-xs text-gray-500">
												Format: JPG, PNG • Maksimal: 5MB untuk crop
											</p>
											<p className="text-xs text-blue-600 font-medium">
												Akan otomatis crop ke rasio 2.4:1 (1440x600px minimum)
											</p>
											{!formData.image && (
												<p className="text-xs text-red-500">
													* Gambar banner wajib diisi
												</p>
											)}
										</div>
									</div>
								)}
								{/* File input positioned to cover upload area when no image is selected */}
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

						{/* Target URL */}
						<div className="space-y-2">
							<Label htmlFor="targetUrl" className="text-sm font-medium">
								Link Tujuan (Opsional)
							</Label>
							<Input
								id="targetUrl"
								type="text"
								value={formData.targetUrl}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										targetUrl: e.target.value,
									}))
								}
								placeholder="https://example.com atau /halaman-internal"
								className="w-full"
							/>
							<p className="text-xs text-gray-500">
								URL lengkap (https://...) atau path internal (/halaman).
								Kosongkan jika banner tidak perlu diklik.
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
								{loading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Menyimpan...
									</>
								) : (
									"Simpan Banner"
								)}
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
							Semua gambar akan otomatis di-crop ke rasio 2.4:1 dengan minimum
							1440x600 piksel
						</p>
					</div>
					<div className="flex items-start gap-2">
						<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
						<p className="text-sm text-gray-600">
							Upload gambar maksimal 5MB, hasil crop akan dikompres otomatis ke
							maksimal 500KB
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
							Banner yang aktif akan langsung ditampilkan di website
						</p>
					</div>
					<div className="flex items-start gap-2">
						<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
						<p className="text-sm text-gray-600">
							Anda dapat mengedit area crop setelah upload dengan klik tombol
							crop
						</p>
					</div>
					<div className="flex items-start gap-2">
						<div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
						<p className="text-sm text-gray-600">
							<strong>Link Tujuan:</strong> Jika diisi, banner akan dapat diklik
							dan mengarahkan ke URL yang ditentukan. Biarkan kosong jika banner
							hanya untuk tampilan.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
