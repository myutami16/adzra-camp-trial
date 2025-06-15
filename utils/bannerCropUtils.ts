import { Area } from "react-easy-crop";

/**
 * Creates a cropped image from the original image source and crop area
 * Optimized for banner images with JPEG compression
 */
export function getCroppedImg(
	imageSrc: string,
	crop: Area,
	quality: number = 0.85
): Promise<Blob> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.setAttribute("crossOrigin", "anonymous");

		image.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			if (!ctx) {
				return reject(new Error("Could not get canvas context"));
			}

			// Set canvas dimensions to crop area
			canvas.width = crop.width;
			canvas.height = crop.height;

			// Enable image smoothing for better quality
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = "high";

			// Draw the cropped image
			ctx.drawImage(
				image,
				crop.x,
				crop.y,
				crop.width,
				crop.height,
				0,
				0,
				crop.width,
				crop.height
			);

			// Convert to blob with specified quality
			canvas.toBlob(
				(blob) => {
					if (!blob) {
						return reject(new Error("Canvas is empty"));
					}
					resolve(blob);
				},
				"image/jpeg",
				quality
			);
		};

		image.onerror = () => {
			reject(new Error("Failed to load image"));
		};

		image.src = imageSrc;
	});
}

/**
 * Validates if the crop area meets banner requirements
 */
export function validateBannerCrop(crop: Area): {
	isValid: boolean;
	errors: string[];
} {
	const errors: string[] = [];
	const ASPECT_RATIO = 16 / 9;
	const ASPECT_TOLERANCE = 0.01;

	// Check aspect ratio
	const currentAspectRatio = crop.width / crop.height;
	if (Math.abs(currentAspectRatio - ASPECT_RATIO) > ASPECT_TOLERANCE) {
		errors.push(
			`Rasio aspek harus 16:9 (saat ini: ${currentAspectRatio.toFixed(2)}:1)`
		);
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

/**
 * Creates a preview URL from a blob
 */
export function createPreviewUrl(blob: Blob): string {
	return URL.createObjectURL(blob);
}

/**
 * Revokes a preview URL to free memory
 */
export function revokePreviewUrl(url: string): void {
	URL.revokeObjectURL(url);
}

/**
 * Converts a File to a data URL for cropping
 */
export function fileToDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (event) => {
			if (event.target?.result) {
				resolve(event.target.result as string);
			} else {
				reject(new Error("Failed to read file"));
			}
		};

		reader.onerror = () => {
			reject(new Error("Error reading file"));
		};

		reader.readAsDataURL(file);
	});
}
