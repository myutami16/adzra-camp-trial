"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { getProductPageBanners, type Banner } from "@/lib/api";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const ProductBanner = () => {
	const [ProductBanners, setProductBanners] = useState([
		{
			id: 1,
			name: "Promo Ramadhan",
			image: "/Banner/banner1.jpg",
			href: "/promo/ramadhan",
		},
		{
			id: 2,
			name: "Diskon Spesial",
			image: "/Banner/banner2.webp",
			href: "/promo/diskon",
		},
	]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadBanners = async () => {
			try {
				setLoading(true);
				setError(null);
				console.log("Loading product page banners...");
				const bannerData = await getProductPageBanners(5);
				console.log("Product page banner data received:", bannerData);

				if (bannerData && bannerData.length > 0) {
					// Transform API data to match existing structure
					const transformedBanners = bannerData.map(
						(banner: Banner, index: number) => ({
							id: banner.id || index + 1,
							name: `Product Banner ${index + 1}`,
							image: banner.image,
							href: "#", // Default href since API doesn't provide this
						})
					);
					console.log("Transformed product banners:", transformedBanners);
					setProductBanners(transformedBanners);
				} else {
					console.log(
						"No product banner data received, keeping default banners"
					);
				}
			} catch (error) {
				console.error("Error loading product page banners:", error);
				setError("Failed to load banners");
				// Keep default banners if API fails
			} finally {
				setLoading(false);
			}
		};

		loadBanners();
	}, []);

	if (loading) {
		return (
			<div className="w-full mb-8">
				<div className="w-full h-[600px] bg-gray-200 animate-pulse flex items-center justify-center">
					<span className="text-gray-500">Loading banners...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full mb-8">
				<div className="w-full h-[600px] bg-red-100 flex items-center justify-center">
					<span className="text-red-500">Error: {error}</span>
				</div>
			</div>
		);
	}

	if (ProductBanners.length === 0) {
		return (
			<div className="w-full mb-8">
				<div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
					<span className="text-gray-500">No banners available</span>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full mb-8">
			<div className="w-full h-[600px] relative overflow-hidden">
				<Carousel
					className="w-full h-full"
					plugins={[
						Autoplay({
							delay: 10000,
						}),
					]}
					opts={{
						align: "start",
						loop: true,
					}}>
					<CarouselContent className="h-full -ml-0">
						{ProductBanners.map((banner, index) => (
							<CarouselItem key={banner.id} className="h-full pl-0">
								<Card className="h-full overflow-hidden border-0 rounded-none">
									<div className="relative w-full h-full">
										{/* Debug info overlay - remove in production */}
										<div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs p-2 rounded z-10">
											Banner {index + 1}: {banner.name}
											<br />
											Image: {banner.image ? "✓" : "✗"}
										</div>

										<Image
											src={banner.image || "/placeholder.svg"}
											alt={`Product Page Banner ${index + 1}`}
											width={1440}
											height={600}
											className="w-full h-full object-cover object-center"
											sizes="100vw"
											priority={index === 0}
											quality={90}
											onError={(e) => {
												console.error(`Failed to load image: ${banner.image}`);
												const target = e.currentTarget as HTMLImageElement;
												target.src = "/placeholder.svg";
											}}
											onLoad={() => {
												console.log(
													`Image loaded successfully: ${banner.image}`
												);
											}}
											onLoadStart={() => {
												console.log(`Starting to load image: ${banner.image}`);
											}}
										/>

										{/* Fallback for failed images */}
										<div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center opacity-0 hover:opacity-20 transition-opacity">
											<span className="text-white text-xl font-semibold">
												{banner.name}
											</span>
										</div>
									</div>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
					{ProductBanners.length > 1 && (
						<>
							<CarouselPrevious className="left-4 bg-white/80 hover:bg-white" />
							<CarouselNext className="right-4 bg-white/80 hover:bg-white" />
						</>
					)}
				</Carousel>
			</div>
		</div>
	);
};

export default ProductBanner;
