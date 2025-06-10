/**
 * Banner action utilities for handling banner clicks and redirects
 */

export interface BannerClickData {
	id: string | number;
	image: string;
	location: "homepage" | "productpage";
	targetUrl?: string;
	isActive: boolean;
}

/**
 * Validates if a URL is safe for redirection
 * @param url The URL to validate
 * @returns boolean indicating if the URL is safe
 */
export function isValidRedirectUrl(url: string): boolean {
	if (!url || url.trim() === "") {
		return false;
	}

	try {
		const trimmedUrl = url.trim();
		
		// Check for absolute URLs (http/https)
		if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
			new URL(trimmedUrl); // This will throw if invalid
			return true;
		}
		
		// Check for relative URLs (starting with /)
		if (trimmedUrl.startsWith("/")) {
			return true;
		}
		
		// Check for relative URLs without leading slash
		if (!trimmedUrl.includes("://") && !trimmedUrl.startsWith("javascript:") && !trimmedUrl.startsWith("data:")) {
			return true;
		}
		
		return false;
	} catch (error) {
		console.error("Invalid URL:", url, error);
		return false;
	}
}

/**
 * Handles banner click event with optional redirect
 * @param banner The banner data containing targetUrl
 * @param options Options for handling the click
 */
export function handleBannerClick(
	banner: BannerClickData,
	options: {
		onClickCallback?: (banner: BannerClickData) => void;
		openInNewTab?: boolean;
		trackAnalytics?: boolean;
	} = {}
): void {
	const { onClickCallback, openInNewTab = false, trackAnalytics = true } = options;

	// Call custom callback if provided
	if (onClickCallback) {
		onClickCallback(banner);
	}

	// Track analytics if enabled
	if (trackAnalytics) {
		trackBannerClick(banner);
	}

	// Handle redirect if targetUrl is available and valid
	if (banner.targetUrl && isValidRedirectUrl(banner.targetUrl)) {
		performRedirect(banner.targetUrl, openInNewTab);
	} else {
		console.log("Banner clicked but no valid targetUrl provided:", banner.id);
	}
}

/**
 * Performs the actual redirect
 * @param url The URL to redirect to
 * @param openInNewTab Whether to open in new tab
 */
function performRedirect(url: string, openInNewTab: boolean = false): void {
	try {
		const trimmedUrl = url.trim();
		
		if (openInNewTab) {
			window.open(trimmedUrl, "_blank", "noopener,noreferrer");
		} else {
			// For internal/relative URLs, use Next.js router if available
			if (trimmedUrl.startsWith("/") && typeof window !== "undefined") {
				// Check if Next.js router is available
				if (window.next && window.next.router) {
					window.next.router.push(trimmedUrl);
					return;
				}
			}
			
			// Fallback to regular navigation
			window.location.href = trimmedUrl;
		}
	} catch (error) {
		console.error("Error performing redirect:", error);
	}
}

/**
 * Tracks banner click for analytics
 * @param banner The banner that was clicked
 */
function trackBannerClick(banner: BannerClickData): void {
	try {
		// You can integrate with your analytics service here
		console.log("Banner clicked:", {
			bannerId: banner.id,
			location: banner.location,
			targetUrl: banner.targetUrl,
			timestamp: new Date().toISOString(),
		});

		// Example: Google Analytics tracking
		if (typeof window !== "undefined" && (window as any).gtag) {
			(window as any).gtag("event", "banner_click", {
				banner_id: banner.id,
				banner_location: banner.location,
				target_url: banner.targetUrl,
			});
		}

		// Example: Custom analytics service
		if (typeof window !== "undefined" && (window as any).analytics) {
			(window as any).analytics.track("Banner Clicked", {
				bannerId: banner.id,
				location: banner.location,
				targetUrl: banner.targetUrl,
			});
		}
	} catch (error) {
		console.error("Error tracking banner click:", error);
	}
}

/**
 * Creates a click handler for banner elements
 * @param banner The banner data
 * @param options Click handling options
 * @returns Click event handler function
 */
export function createBannerClickHandler(
	banner: BannerClickData,
	options: {
		onClickCallback?: (banner: BannerClickData) => void;
		openInNewTab?: boolean;
		trackAnalytics?: boolean;
		preventDefault?: boolean;
	} = {}
) {
	return (event: React.MouseEvent<HTMLElement> | MouseEvent) => {
		const { preventDefault = true } = options;
		
		// Prevent default behavior if requested
		if (preventDefault) {
			event.preventDefault();
		}

		// Only handle click if banner is active
		if (!banner.isActive) {
			console.log("Banner is not active, ignoring click:", banner.id);
			return;
		}

		handleBannerClick(banner, options);
	};
}

/**
 * Utility to prepare banner data for click handling
 * @param rawBanner Raw banner data from API
 * @returns Formatted banner data for click handling
 */
export function prepareBannerForClick(rawBanner: any): BannerClickData {
	return {
		id: rawBanner._id || rawBanner.id || "",
		image: rawBanner.image || "",
		location: rawBanner.location || "homepage",
		targetUrl: rawBanner.targetUrl || "",
		isActive: rawBanner.isActive !== undefined ? rawBanner.isActive : true,
	};
}