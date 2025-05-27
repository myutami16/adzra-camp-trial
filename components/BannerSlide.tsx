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

export default function BannerSlide() {
	const [banners, setBanners] = useState<PublicBanner[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadBanners = async () => {
			try {
				setLoading(true);
				const bannerData = await fetchPublicBanners("homepage", 5);
				setBanners(bannerData);
			} catch (error) {
				console.error("Error loading homepage banners:", error);
			} finally {
				setLoading(false);
			}
		};

		loadBanners();
	}, []);

	// Fallback banners if no banners are available from API
	const fallbackBanners = [
		{
			_id: "fallback-1",
			image: "/Banner/banner1.jpg",
			location: "homepage" as const,
			isActive: true,
		},
		{
			_id: "fallback-2",
			image: "/Banner/banner2.webp",
			location: "homepage" as const,
			isActive: true,
		},
	];

	// Use API banners if available, otherwise use fallback
	const displayBanners = banners.length > 0 ? banners : fallbackBanners;

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
		<div className="w-full max-w-6xl mx-auto px-4 mb-8">
			<Carousel className="w-full">
				<CarouselContent>
					{displayBanners.map((banner, index) => (
						<CarouselItem key={banner._id}>
							<Card className="border-0 shadow-lg overflow-hidden">
								<div className="aspect-video relative">
									<Image
										src={banner.image || "/placeholder.svg"}
										alt={`Homepage Banner ${index + 1}`}
										fill
										className="object-cover"
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
										priority={index === 0} // Prioritize first banner for LCP
									/>
								</div>
							</Card>
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
}
