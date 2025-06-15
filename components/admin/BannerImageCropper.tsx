"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { X, RotateCcw } from "lucide-react";
import { getCroppedImg } from "@/utils/bannerCropUtils";
import { toast } from "sonner";

interface BannerImageCropperProps {
	image: string;
	onCropComplete: (croppedFile: File) => void;
	onCancel: () => void;
	originalFileName?: string;
}

export default function BannerImageCropper({
	image,
	onCropComplete,
	onCancel,
	originalFileName = "cropped-banner.jpg",
}: BannerImageCropperProps) {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	// Banner aspect ratio 2.4:1 (1440x600)
	const BANNER_ASPECT_RATIO = 2.4;

	const onCropCompleteInternal = useCallback(
		(_: any, croppedAreaPixels: any) => {
			console.log("Crop completed:", croppedAreaPixels);
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[]
	);

	const handleCropSave = async () => {
		console.log("HandleCropSave called");
		console.log("CroppedAreaPixels:", croppedAreaPixels);

		if (!croppedAreaPixels) {
			toast.error("Silakan pilih area crop terlebih dahulu");
			return;
		}

		try {
			setLoading(true);
			console.log("Starting crop process...");

			// Get cropped image blob
			const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
			console.log("Cropped blob created:", croppedBlob);

			// Convert blob to file
			const croppedFile = new File([croppedBlob], originalFileName, {
				type: "image/jpeg",
				lastModified: Date.now(),
			});
			console.log("Cropped file created:", {
				name: croppedFile.name,
				size: croppedFile.size,
				type: croppedFile.type,
			});

			// Validate file size (500KB limit)
			if (croppedFile.size > 500 * 1024) {
				toast.error("Hasil crop terlalu besar. Maksimal 500KB");
				return;
			}

			console.log("Calling onCropComplete with file...");
			onCropComplete(croppedFile);
		} catch (error) {
			console.error("Error cropping image:", error);
			toast.error("Gagal memproses crop gambar");
		} finally {
			setLoading(false);
		}
	};

	const resetCrop = () => {
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setCroppedAreaPixels(null);
	};

	return (
		<Card className="w-full max-w-4xl mx-auto">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
				<div>
					<CardTitle className="text-lg">Crop Banner Image</CardTitle>
					<p className="text-sm text-gray-600 mt-1">
						Pilih area gambar dengan rasio 2.4:1 (1440x600px)
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={onCancel}
					className="shrink-0">
					<X className="h-4 w-4 mr-1" />
					Tutup
				</Button>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* Crop Area */}
				<div className="relative">
					<div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
						<Cropper
							image={image}
							crop={crop}
							zoom={zoom}
							aspect={BANNER_ASPECT_RATIO}
							onCropChange={setCrop}
							onZoomChange={setZoom}
							onCropComplete={onCropCompleteInternal}
							showGrid={true}
							cropShape="rect"
							objectFit="contain"
						/>
					</div>

					{/* Crop Info Overlay */}
					{croppedAreaPixels && (
						<div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
							{Math.round(croppedAreaPixels.width)} ×{" "}
							{Math.round(croppedAreaPixels.height)}px
						</div>
					)}
				</div>

				{/* Zoom Control */}
				<div className="space-y-2">
					<label className="text-sm font-medium">Zoom</label>
					<div className="px-2">
						<Slider
							value={[zoom]}
							onValueChange={(value) => setZoom(value[0])}
							min={1}
							max={3}
							step={0.1}
							className="w-full"
						/>
					</div>
					<div className="flex justify-between text-xs text-gray-500">
						<span>1x</span>
						<span>3x</span>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center justify-between gap-4 pt-4 border-t">
					<Button
						variant="outline"
						onClick={resetCrop}
						className="flex items-center gap-2">
						<RotateCcw className="h-4 w-4" />
						Reset
					</Button>

					<div className="flex gap-2">
						<Button variant="outline" onClick={onCancel} disabled={loading}>
							Batal
						</Button>
						<Button
							onClick={handleCropSave}
							disabled={loading || !croppedAreaPixels}
							className="bg-green-600 hover:bg-green-700">
							{loading ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									Memproses...
								</>
							) : (
								"Gunakan Hasil Crop"
							)}
						</Button>
					</div>
				</div>

				{/* Guidelines */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<div className="flex items-start gap-2">
						<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
						<div className="space-y-1 text-sm">
							<p className="font-medium text-blue-900">Panduan Crop:</p>
							<ul className="text-blue-700 space-y-1">
								<li>• Drag untuk memindahkan area crop</li>
								<li>• Gunakan slider untuk zoom in/out</li>
								<li>• Rasio aspek otomatis terkunci pada 2.4:1 (1440x600px)</li>
							</ul>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
