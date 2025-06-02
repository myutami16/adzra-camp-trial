/**
 * Normalizes banner data from various API response formats
 * @param data The raw API response data
 * @returns Normalized banner data
 */
export function normalizeBannerData(data: any) {
	if (!data) return null;

	return {
		id: data._id || data.id || "",
		image: data.image || "",
		cloudinary_id: data.cloudinary_id || "",
		location: data.location || "homepage",
		isActive: data.isActive !== undefined ? data.isActive : true,
		createdAt: data.createdAt || new Date().toISOString(),
	};
}

/**
 * Normalizes banner list data from various API response formats
 * @param response The raw API response
 * @returns Normalized banner list with pagination and stats
 */
export function normalizeBannerListResponse(response: any) {
	if (!response) return { banners: [], pagination: {}, locationStats: {} };

	let banners = [];

	// Handle different response structures
	if (response.success && Array.isArray(response.data)) {
		banners = response.data.map(normalizeBannerData);
	} else if (response.data && Array.isArray(response.data.banners)) {
		banners = response.data.banners.map(normalizeBannerData);
	} else if (Array.isArray(response)) {
		banners = response.map(normalizeBannerData);
	}

	// Calculate location stats if not provided
	const locationStats =
		response.locationStats || calculateLocationStats(banners);

	return {
		banners,
		pagination: {
			currentPage: response.currentPage || 1,
			totalPages: response.totalPages || 1,
			totalItems: response.totalCount || response.count || banners.length,
			itemsPerPage: banners.length,
		},
		locationStats,
	};
}

/**
 * Calculates location statistics from banner list
 * @param banners List of banners
 * @returns Location statistics
 */
function calculateLocationStats(banners: any[]) {
	const stats: any = {
		homepage: { total: 0, active: 0 },
		productpage: { total: 0, active: 0 },
	};

	banners.forEach((banner) => {
		const location = banner.location || "homepage";
		if (stats[location]) {
			stats[location].total++;
			if (banner.isActive) {
				stats[location].active++;
			}
		}
	});

	return stats;
}
