import { getToken } from "./auth";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	"https://camp-store.vercel.app/api";

export const fetcher = async (url: string) => {
	const token = getToken();
	const fullUrl = url.startsWith("/api/")
		? `${API_BASE_URL}${url.replace("/api", "")}`
		: url;

	const headers: HeadersInit = {};
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	} else if (process.env.NODE_ENV === "development") {
		// Use mock token in development
		headers["Authorization"] = `Bearer mock-dev-token`;
	}

	const response = await fetch(fullUrl, {
		headers,
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch: ${response.status}`);
	}

	const result = await response.json();

	if (!result.success) {
		throw new Error(result.message || "API request failed");
	}

	// Handle the specific API response structure for admin stats
	if (url.includes("/admin/stats") && result.data) {
		return {
			productCount: result.data.totalProducts || 0,
			contentCount: result.data.totalContents || 0,
			userCount: result.data.totalAdmins || 0,
		};
	}

	return result.data;
};
