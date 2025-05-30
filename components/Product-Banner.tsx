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
import { fetchPublicBanners, type PublicBanner } from "@/lib/banner-api";

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

	useEffect(() => {
		const loadBanners = async () => {
			try {
				setLoading(true);
				const bannerData = await fetchPublicBanners("productpage", 5);
				if (bannerData.length > 0) {
					// Transform API data to match existing structure
					const transformedBanners = bannerData.map(
						(banner: PublicBanner, index: number) => ({
							id: index + 1,
							name: `Product Banner ${index + 1}`,
							image: banner.image,
							href: "#", // Default href since API doesn't provide this
						})
					);
					setProductBanners(transformedBanners);
				}
			} catch (error) {
				console.error("Error loading product page banners:", error);
				// Keep default banners if API fails
			} finally {
				setLoading(false);
			}
		};

		loadBanners();
	}, []);

	if (loading) {
		return (
			<div className="w-full max-w-6xl mx-auto px-4 mb-8">
				<div className="aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
			</div>
		);
	}

	if (ProductBanners.length === 0) {
		return null; // Don't show anything if no banners available
	}

	return (
		<div className="w-full aspect-[16/9] mb-8">
			<Carousel className="w-full h-full">
				<CarouselContent className="h-full">
					{ProductBanners.map((banner, index) => (
						<CarouselItem key={banner.id} className="h-full">
							<div className="relative w-full h-full">
								<Image
									src={banner.image || "/placeholder.svg"}
									alt={`Product Page Banner ${index + 1}`}
									fill
									className="object-cover"
									sizes="100vw"
									priority={index === 0}
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				{ProductBanners.length > 1 && (
					<>
						<CarouselPrevious className="left-4" />
						<CarouselNext className="right-4" />
					</>
				)}
			</Carousel>
		</div>
	);
};

export default ProductBanner;
