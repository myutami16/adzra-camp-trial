// Public API functions for fetching banners (no authentication required)

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	"https://adzra-camp-store.vercel.app/api";

export interface PublicBanner {
	_id: string;
	image: string;
	location: "homepage" | "productpage";
	isActive: boolean;
}

// Fetch banners for public display
export const fetchPublicBanners = async (
	location: "homepage" | "productpage",
	limit = 5
) => {
	try {
		console.log(`Fetching public banners for location: ${location}`);

		const response = await fetch(
			`${API_BASE_URL}/banner?location=${location}&limit=${limit}`,
			{
				next: { revalidate: 300 }, // Revalidate every 5 minutes
				cache: "force-cache",
			}
		);

		if (!response.ok) {
			console.error(`Failed to fetch banners: ${response.status}`);
			return [];
		}

		const result = await response.json();
		console.log(`Public banners response for ${location}:`, result);

		if (result.success && Array.isArray(result.data)) {
			return result.data.map((banner: any) => ({
				_id: banner._id,
				image: banner.image,
				location: banner.location,
				isActive: banner.isActive,
			}));
		}

		return [];
	} catch (error) {
		console.error(`Error fetching public banners for ${location}:`, error);
		return [];
	}
};

// Fetch banner locations with counts
export const fetchBannerLocations = async () => {
	try {
		console.log("Fetching banner locations");

		const response = await fetch(`${API_BASE_URL}/banner?path=locations`, {
			next: { revalidate: 600 }, // Revalidate every 10 minutes
			cache: "force-cache",
		});

		if (!response.ok) {
			console.error(`Failed to fetch banner locations: ${response.status}`);
			return [];
		}

		const result = await response.json();
		console.log("Banner locations response:", result);

		if (result.success && Array.isArray(result.data)) {
			return result.data;
		}

		return [];
	} catch (error) {
		console.error("Error fetching banner locations:", error);
		return [];
	}
};
