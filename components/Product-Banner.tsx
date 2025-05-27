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

export default function ProductBanner() {
	const [banners, setBanners] = useState<PublicBanner[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadBanners = async () => {
			try {
				setLoading(true);
				const bannerData = await fetchPublicBanners("productpage", 5);
				setBanners(bannerData);
			} catch (error) {
				console.error("Error loading product page banners:", error);
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

	if (banners.length === 0) {
		return null; // Don't show anything if no banners available
	}

	return (
		<div className="w-full max-w-6xl mx-auto px-4 mb-8">
			<Carousel className="w-full">
				<CarouselContent>
					{banners.map((banner, index) => (
						<CarouselItem key={banner._id}>
							<Card className="border-0 shadow-lg overflow-hidden">
								<div className="aspect-video relative">
									<Image
										src={banner.image || "/placeholder.svg"}
										alt={`Product Page Banner ${index + 1}`}
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
				{banners.length > 1 && (
					<>
						<CarouselPrevious className="left-4" />
						<CarouselNext className="right-4" />
					</>
				)}
			</Carousel>
		</div>
	);
}
