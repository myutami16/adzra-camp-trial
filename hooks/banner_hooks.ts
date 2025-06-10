/**
 * React hooks for banner functionality
 */
import { useCallback, useMemo } from "react";
import {
	handleBannerClick,
	createBannerClickHandler,
	prepareBannerForClick,
	BannerClickData,
} from "@/lib/banner-actions";

/**
 * Hook for handling banner clicks with built-in optimization
 * @param banner The banner data
 * @param options Configuration options
 * @returns Memoized click handler and banner data
 */
export function useBannerClick(
	banner: any,
	options: {
		onClickCallback?: (banner: BannerClickData) => void;
		openInNewTab?: boolean;
		trackAnalytics?: boolean;
		preventDefault?: boolean;
	} = {}
) {
	// Prepare banner data for click handling
	const bannerData = useMemo(() => prepareBannerForClick(banner), [banner]);

	// Create memoized click handler
	const clickHandler = useCallback(
		createBannerClickHandler(bannerData, options),
		[bannerData, options]
	);

	// Determine if banner should be clickable
	const isClickable = useMemo(() => {
		return (
			bannerData.isActive &&
			bannerData.targetUrl &&
			bannerData.targetUrl.trim() !== ""
		);
	}, [bannerData.isActive, bannerData.targetUrl]);

	// Create manual click function for programmatic use
	const triggerClick = useCallback(() => {
		if (isClickable) {
			handleBannerClick(bannerData, options);
		}
	}, [bannerData, options, isClickable]);

	return {
		bannerData,
		clickHandler,
		isClickable,
		triggerClick,
	};
}

/**
 * Hook for managing multiple banners with click handling
 * @param banners Array of banner data
 * @param globalOptions Global options applied to all banners
 * @returns Processed banners with click handlers
 */
export function useBannerList(
	banners: any[],
	globalOptions: {
		onClickCallback?: (banner: BannerClickData) => void;
		openInNewTab?: boolean;
		trackAnalytics?: boolean;
		preventDefault?: boolean;
	} = {}
) {
	const processedBanners = useMemo(() => {
		return banners.map((banner) => {
			const bannerData = prepareBannerForClick(banner);
			const clickHandler = createBannerClickHandler(bannerData, globalOptions);
			const isClickable =
				bannerData.isActive &&
				bannerData.targetUrl &&
				bannerData.targetUrl.trim() !== "";

			return {
				...bannerData,
				clickHandler,
				isClickable,
				originalData: banner,
			};
		});
	}, [banners, globalOptions]);

	// Filter only active banners
	const activeBanners = useMemo(() => {
		return processedBanners.filter((banner) => banner.isActive);
	}, [processedBanners]);

	// Filter only clickable banners
	const clickableBanners = useMemo(() => {
		return processedBanners.filter((banner) => banner.isClickable);
	}, [processedBanners]);

	return {
		allBanners: processedBanners,
		activeBanners,
		clickableBanners,
	};
}

/**
 * Hook for banner analytics and tracking
 * @param banner The banner data
 * @returns Analytics functions
 */
export function useBannerAnalytics(banner: any) {
	const bannerData = useMemo(() => prepareBannerForClick(banner), [banner]);

	const trackImpression = useCallback(() => {
		try {
			console.log("Banner impression:", {
				bannerId: bannerData.id,
				location: bannerData.location,
				timestamp: new Date().toISOString(),
			});

			// Google Analytics
			if (typeof window !== "undefined" && (window as any).gtag) {
				(window as any).gtag("event", "banner_impression", {
					banner_id: bannerData.id,
					banner_location: bannerData.location,
				});
			}

			// Custom analytics
			if (typeof window !== "undefined" && (window as any).analytics) {
				(window as any).analytics.track("Banner Impression", {
					bannerId: bannerData.id,
					location: bannerData.location,
				});
			}
		} catch (error) {
			console.error("Error tracking banner impression:", error);
		}
	}, [bannerData]);

	const trackClick = useCallback(() => {
		try {
			console.log("Banner click tracked:", {
				bannerId: bannerData.id,
				location: bannerData.location,
				targetUrl: bannerData.targetUrl,
				timestamp: new Date().toISOString(),
			});

			// Google Analytics
			if (typeof window !== "undefined" && (window as any).gtag) {
				(window as any).gtag("event", "banner_click", {
					banner_id: bannerData.id,
					banner_location: bannerData.location,
					target_url: bannerData.targetUrl,
				});
			}

			// Custom analytics
			if (typeof window !== "undefined" && (window as any).analytics) {
				(window as any).analytics.track("Banner Clicked", {
					bannerId: bannerData.id,
					location: bannerData.location,
					targetUrl: bannerData.targetUrl,
				});
			}
		} catch (error) {
			console.error("Error tracking banner click:", error);
		}
	}, [bannerData]);

	return {
		trackImpression,
		trackClick,
	};
}
