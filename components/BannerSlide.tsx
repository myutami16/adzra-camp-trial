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
import { getHomepageBanners, type Banner } from "@/lib/api";

const BannerSlider = () => {
	const [banners, setBanners] = useState([
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
				console.log("Loading homepage banners...");
				const bannerData = await getHomepageBanners(5);
				console.log("Homepage banner data received:", bannerData);

				if (bannerData && bannerData.length > 0) {
					// Transform API data to match existing structure
					const transformedBanners = bannerData.map(
						(banner: Banner, index: number) => ({
							id: banner.id || index + 1,
							name: `Banner ${index + 1}`,
							image: banner.image,
							href: "#",
						})
					);
					console.log("Transformed banners:", transformedBanners);
					setBanners(transformedBanners);
				} else {
					console.log("No banner data received, keeping default banners");
				}
			} catch (error) {
				console.error("Error loading homepage banners:", error);
				// Keep default banners if API fails
			} finally {
				setLoading(false);
			}
		};

		loadBanners();
	}, []);

	// Use API banners if available, otherwise use fallback
	const displayBanners = banners;

	if (loading) {
		return (
			<div className="w-full max-w-6xl mx-auto px-4 mb-8">
				<div className="aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
			</div>
		);
	}

	if (displayBanners.length === 0) {
		return null; // Don't show anything if no banners available
	}

	return (
		<div className="w-full aspect-[16/9] mb-8">
			<Carousel className="w-full h-full">
				<CarouselContent className="h-full">
					{displayBanners.map((banner, index) => (
						<CarouselItem key={banner.id} className="h-full">
							<div className="relative w-full h-full">
								<Image
									src={banner.image || "/placeholder.svg"}
									alt={`Homepage Banner ${index + 1}`}
									fill
									className="object-cover"
									sizes="100vw"
									priority={index === 0}
									onError={(e) => {
										console.error(`Failed to load image: ${banner.image}`);
										// Fallback to placeholder on error
										e.currentTarget.src = "/placeholder.svg";
									}}
									onLoad={() => {
										console.log(`Image loaded successfully: ${banner.image}`);
									}}
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				{displayBanners.length > 1 && (
					<>
						<CarouselPrevious className="left-4" />
						<CarouselNext className="right-4" />
					</>
				)}
			</Carousel>
		</div>
	);
};

export default BannerSlider;
