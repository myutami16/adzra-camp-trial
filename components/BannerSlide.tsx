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

	useEffect(() => {
		const loadBanners = async () => {
			try {
				const bannerData = await getHomepageBanners(5);
				if (bannerData.length > 0) {
					// Transform API data to match existing structure
					const transformedBanners = bannerData.map(
						(banner: Banner, index: number) => ({
							id: index + 1,
							name: `Banner ${index + 1}`,
							image: banner.image,
							href: "#",
						})
					);
					setBanners(transformedBanners);
				}
			} catch (error) {
				console.error("Error loading homepage banners:", error);
				// Keep default banners if API fails
			}
		};

		loadBanners();
	}, []);

	const [loading, setLoading] = useState(false);

	// const fallbackBanners = [
	//   {
	//     _id: "fallback-1",
	//     image: "/Banner/banner1.jpg",
	//     location: "homepage" as const,
	//     isActive: true,
	//   },
	//   {
	//     _id: "fallback-2",
	//     image: "/Banner/banner2.webp",
	//     location: "homepage" as const,
	//     isActive: true,
	//   },
	// ]

	// Use API banners if available, otherwise use fallback
	const displayBanners = banners; //banners.length > 0 ? banners : fallbackBanners

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
