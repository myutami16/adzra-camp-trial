"use client";

import { useState, useEffect } from "react";
import {
	Carousel,
	CarouselContent,
	CarouselNext,
	CarouselPrevious,
	CarouselApi,
} from "@/components/ui/carousel";
import { useBanners } from "@/hooks/useBanners";
import BannerItem from "./BannerItem"; // Import komponen BannerItem yang sama

const ProductBanner = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);

	// SWR implementation
	const { banners, isLoading, error } = useBanners({
		location: "productpage",
		limit: 5,
	});

	// Default banners fallback
	const defaultBanners = [
		{
			id: 1,
			name: "Promo Ramadhan",
			image: "/Banner/banner1.jpg",
			href: "/promo/ramadhan",
			targetUrl: "/promo/ramadhan",
		},
		{
			id: 2,
			name: "Diskon Spesial",
			image: "/Banner/banner2.webp",
			href: "/promo/diskon",
			targetUrl: "/promo/diskon",
		},
	];

	// Transform banners for display
	const displayBanners =
		banners.length > 0
			? banners.map((banner, index) => ({
					id: banner.id,
					name: `Product Banner ${index + 1}`,
					image: banner.image,
					href: banner.targetUrl || "#",
					targetUrl: banner.targetUrl || "",
					location: "productpage",
					isActive: banner.isActive,
			  }))
			: defaultBanners;

	useEffect(() => {
		if (!api) {
			return;
		}

		setCurrent(api.selectedScrollSnap());

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});

		// Auto-slide functionality - 5 seconds untuk product page
		const autoSlide = setInterval(() => {
			if (api.canScrollNext()) {
				api.scrollNext();
			} else {
				api.scrollTo(0);
			}
		}, 5000); // 5 seconds

		return () => clearInterval(autoSlide);
	}, [api]);

	if (isLoading) {
		return (
			<div className="w-full mb-8">
				{/* Updated: Fixed aspect ratio container for 2.4:1 (1440x600) */}
				<div className="w-full aspect-[2.4/1] bg-gray-200 animate-pulse flex items-center justify-center">
					<span className="text-gray-500">Loading banners...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full mb-8">
				{/* Updated: Fixed aspect ratio container for 2.4:1 (1440x600) */}
				<div className="w-full aspect-[2.4/1] bg-red-100 flex items-center justify-center">
					<span className="text-red-500">Error: {error.message}</span>
				</div>
			</div>
		);
	}

	if (displayBanners.length === 0) {
		return (
			<div className="w-full mb-8">
				{/* Updated: Fixed aspect ratio container for 2.4:1 (1440x600) */}
				<div className="w-full aspect-[2.4/1] bg-gray-100 flex items-center justify-center">
					<span className="text-gray-500">No banners available</span>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full mb-8">
			{/* Updated: Container with proper aspect ratio for 2.4:1 banners */}
			<div className="w-full aspect-[2.4/1] relative overflow-hidden">
				<Carousel
					setApi={setApi}
					className="w-full h-full"
					opts={{
						align: "start",
						loop: true,
					}}>
					<CarouselContent className="h-full -ml-0">
						{/* SOLUSI: Hook dipanggil di dalam BannerItem, bukan di map */}
						{displayBanners.map((banner, index) => (
							<BannerItem
								key={banner.id}
								banner={banner}
								index={index}
								altPrefix="Product Page Banner"
								gradientColors="from-blue-500 to-purple-600"
							/>
						))}
					</CarouselContent>
					{displayBanners.length > 1 && (
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
