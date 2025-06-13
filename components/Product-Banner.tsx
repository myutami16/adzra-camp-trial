"use client";

import { useState, useEffect } from "react";
import {
	Carousel,
	CarouselContent,
	CarouselNext,
	CarouselPrevious,
	CarouselApi,
} from "@/components/ui/carousel";
import { getProductPageBanners, type Banner } from "@/lib/api";
import BannerItem from "./BannerItem"; // Import komponen BannerItem yang sama

const ProductBanner = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);

	const [ProductBanners, setProductBanners] = useState([
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
							href: banner.targetUrl || "#",
							targetUrl: banner.targetUrl || "", // Add targetUrl from API
							location: "productpage", // Add location for banner actions
							isActive: banner.isActive !== undefined ? banner.isActive : true,
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

	useEffect(() => {
		if (!api) {
			return;
		}

		setCurrent(api.selectedScrollSnap());

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});

		// Auto-slide functionality - 10 seconds untuk product page
		const autoSlide = setInterval(() => {
			if (api.canScrollNext()) {
				api.scrollNext();
			} else {
				api.scrollTo(0);
			}
		}, 5000); // 10 seconds

		return () => clearInterval(autoSlide);
	}, [api]);

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
					setApi={setApi}
					className="w-full h-full"
					opts={{
						align: "start",
						loop: true,
					}}>
					<CarouselContent className="h-full -ml-0">
						{/* SOLUSI: Hook dipanggil di dalam BannerItem, bukan di map */}
						{ProductBanners.map((banner, index) => (
							<BannerItem
								key={banner.id}
								banner={banner}
								index={index}
								altPrefix="Product Page Banner"
								gradientColors="from-blue-500 to-purple-600"
							/>
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
