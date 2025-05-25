// Add the import at the top of the file
import { getToken } from "./auth";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	"https://adzra-camp-store.vercel.app/api";

// Types
export interface Product {
	id: number;
	namaProduk: string;
	slug: string;
	deskripsi?: string;
	harga: number;
	stok?: number;
	isForRent?: boolean;
	isForSale?: boolean;
	kategori?: string;
	gambar?: string;
	specifications?: any;
	createdAt?: string;
}

export interface ProductsResponse {
	status: string;
	data: {
		products: Product[];
		pagination: {
			currentPage: number;
			totalPages: number;
			totalItems: number;
			itemsPerPage: number;
		};
	};
}

export interface ContentItem {
	id: number;
	title: string;
	slug: string;
	body?: string;
	thumbnailUrl?: string;
	contentType?: string;
	tags?: string[];
	createdAt: string;
}

export interface ContentResponse {
	status: string;
	data: {
		content: ContentItem[];
		pagination: {
			currentPage: number;
			totalPages: number;
			totalItems: number;
			itemsPerPage: number;
		};
	};
}

// Fetch functions
export async function fetchProducts(
	params: {
		page?: number;
		limit?: number;
		sort?: string;
		kategori?: string;
		search?: string;
		q?: string;
		id?: number;
		slug?: string;
		path?: string;
		isForSale?: string;
		isForRent?: string;
	} = {}
): Promise<{ data: { products: Product[]; pagination: any } }> {
	try {
		const queryParams = new URLSearchParams();

		if (params.page) queryParams.append("page", params.page.toString());
		if (params.limit) queryParams.append("limit", params.limit.toString());
		if (params.sort) queryParams.append("sort", params.sort);
		if (params.kategori) queryParams.append("kategori", params.kategori);
		const searchQuery = params.search || params.q;
		if (params.q) {
		if (searchQuery) {
			queryParams.append("search", searchQuery);
		}
		if (params.id) queryParams.append("id", params.id.toString());
		if (params.slug) queryParams.append("slug", params.slug);
		if (params.path) queryParams.append("path", params.path);
		if (params.isForSale) queryParams.append("isForSale", params.isForSale);
		if (params.isForRent) queryParams.append("isForRent", params.isForRent);

		const url = `${API_BASE_URL}/products${
			queryParams.toString() ? `?${queryParams.toString()}` : ""
		}`;
		console.log("Fetching products from:", url);

		const response = await fetch(url, {
			next: { revalidate: 0 },
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch products: ${response.status}`);
		}

		const result = await response.json();
		console.log("Products API response:", result);

		// Handle the specific API response structure
		if (result.success && result.data) {
			// Handle both array and object data structures
			if (Array.isArray(result.data)) {
				return {
					data: {
						products: result.data,
						pagination: {
							currentPage: result.currentPage || 1,
							totalPages: result.totalPages || 1,
							totalItems: result.totalCount || result.data.length,
							itemsPerPage: result.data.length,
						},
					},
				};
			} else if (result.data.products) {
				return {
					data: {
						products: result.data.products,
						pagination: result.data.pagination || {
							currentPage: 1,
							totalPages: 1,
							totalItems: result.data.products.length,
							itemsPerPage: result.data.products.length,
						},
					},
				};
			}
		}
		
		// Handle direct array response (like your Hydropack API response)
		if (Array.isArray(result.data)) {
			return {
				data: {
					products: result.data,
					pagination: {
						currentPage: result.currentPage || 1,
						totalPages: result.totalPages || 1,
						totalItems: result.totalCount || result.count || result.data.length,
						itemsPerPage: result.data.length,
					},
				},
			};
		}

		console.warn("Unexpected API response structure:", result);
		return {
			data: {
				products: [],
				pagination: {
					currentPage: 1,
					totalPages: 0,
					totalItems: 0,
					itemsPerPage: 10,
				},
			},
		};
	} catch (error) {
		console.error("Error fetching products:", error);
		return {
			data: {
				products: [],
				pagination: {
					currentPage: 1,
					totalPages: 0,
					totalItems: 0,
					itemsPerPage: 10,
				},
			},
		};
	}
}

// Update the fetchContent function with better error handling
export async function fetchContent(
	params: {
		page?: number;
		limit?: number;
		type?: string;
		slug?: string;
		path?: string;
	} = {}
): Promise<{ data: { content: ContentItem[]; pagination: any } }> {
	try {
		const queryParams = new URLSearchParams();

		if (params.page) queryParams.append("page", params.page.toString());
		if (params.limit) queryParams.append("limit", params.limit.toString());
		if (params.type) queryParams.append("type", params.type);
		if (params.slug) queryParams.append("slug", params.slug);
		if (params.path) queryParams.append("path", params.path);

		const url = `${API_BASE_URL}/content${
			queryParams.toString() ? `?${queryParams.toString()}` : ""
		}`;
		console.log("Fetching content from:", url);

		// Add timeout to the fetch request
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

		try {
			const response = await fetch(url, {
				next: { revalidate: 0 }, // Disable caching to always get fresh data
				cache: "no-store",
				signal: controller.signal,
			});

			clearTimeout(timeoutId); // Clear the timeout if fetch completes

			if (!response.ok) {
				console.error(`Failed to fetch content: ${response.status}`);
				throw new Error(`Failed to fetch content: ${response.status}`);
			}

			const result = await response.json();
			console.log("Content API response:", result);

			// Handle different API response structures
			if (result.data && result.data.content) {
				// Standard structure with data.content
				return result;
			} else if (result.content) {
				// Alternative structure with content at root
				return {
					data: {
						content: result.content,
						pagination: result.pagination || {},
					},
				};
			} else if (Array.isArray(result)) {
				// Handle case where API returns an array directly
				return {
					data: {
						content: result,
						pagination: {
							currentPage: 1,
							totalPages: 1,
							totalItems: result.length,
							itemsPerPage: result.length,
						},
					},
				};
			} else if (result.data && Array.isArray(result.data)) {
				// Handle case where API returns data as an array
				return {
					data: {
						content: result.data,
						pagination: {
							currentPage: 1,
							totalPages: 1,
							totalItems: result.data.length,
							itemsPerPage: result.data.length,
						},
					},
				};
			} else {
				console.warn("Unexpected API response structure:", result);
				return {
					data: {
						content: [],
						pagination: {
							currentPage: 1,
							totalPages: 0,
							totalItems: 0,
							itemsPerPage: 10,
						},
					},
				};
			}
		} catch (fetchError) {
			clearTimeout(timeoutId); // Clear the timeout if fetch fails
			if (fetchError.name === "AbortError") {
				console.error("Fetch request timed out");
				throw new Error("Request timed out. Please try again later.");
			}
			throw fetchError; // Re-throw other fetch errors
		}
	} catch (error) {
		console.error("Error fetching content:", error);
		// Return empty data structure on error
		return {
			data: {
				content: [],
				pagination: {
					currentPage: 1,
					totalPages: 0,
					totalItems: 0,
					itemsPerPage: 10,
				},
			},
		};
	}
}

// Update getContentBySlug to handle errors better and provide fallback content
export async function getContentBySlug(
	slug: string
): Promise<ContentItem | null> {
	try {
		console.log(`Fetching content with slug: ${slug}`);

		// Try direct API call first since that seems to be working
		console.log("Trying direct API call for content with slug");
		const directUrl = `${API_BASE_URL}/content?slug=${slug}`;
		console.log(`Direct content URL: ${directUrl}`);

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

			const directResponse = await fetch(directUrl, {
				next: { revalidate: 0 },
				cache: "no-store",
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (directResponse.ok) {
				const directResult = await directResponse.json();
				console.log("Direct content API response:", directResult);

				// Handle the specific API response structure we received
				if (directResult.success && directResult.data) {
					// Map the API response fields to our expected ContentItem structure
					return {
						id: directResult.data._id || 0,
						title: directResult.data.title || "Untitled",
						slug: directResult.data.slug || slug,
						body:
							directResult.data.description ||
							directResult.data.summary ||
							"<p>No content available.</p>",
						thumbnailUrl: directResult.data.image || null,
						contentType: directResult.data.contentType || "blog",
						tags: directResult.data.tags || [],
						createdAt: directResult.data.createdAt || new Date().toISOString(),
					};
				}
			}
		} catch (directError) {
			console.error("Error with direct content fetch:", directError);
		}

		// If direct API call fails, try the other methods
		try {
			const response = await fetchContent({ slug });
			console.log(`Content response for slug ${slug}:`, response);

			if (response.data.content && response.data.content.length > 0) {
				return response.data.content[0];
			}
		} catch (slugError) {
			console.error("Error fetching with slug parameter:", slugError);
		}

		// If no content found with the slug, try fetching with path parameter
		console.log(
			"No content found with slug parameter, trying with path parameter"
		);
		try {
			const pathResponse = await fetchContent({ path: slug });
			console.log(`Content response for path ${slug}:`, pathResponse);

			if (pathResponse.data.content && pathResponse.data.content.length > 0) {
				return pathResponse.data.content[0];
			}
		} catch (pathError) {
			console.error("Error fetching with path parameter:", pathError);
		}

		// If all fetch attempts fail, check if we're in development mode and return mock data
		if (process.env.NODE_ENV === "development") {
			console.log("Returning mock content for development mode");
			return {
				id: 1,
				title: `Mock Content: ${slug}`,
				slug: slug,
				body: `<p>This is mock content for development purposes. The actual content with slug "${slug}" could not be fetched.</p>
               <p>Please ensure the API is running and accessible.</p>`,
				thumbnailUrl: "/placeholder.svg?height=400&width=800",
				contentType: "blog",
				tags: ["mock", "development"],
				createdAt: new Date().toISOString(),
			};
		}

		console.log(`No content found for slug: ${slug}`);
		return null;
	} catch (error) {
		console.error("Error fetching content by slug:", error);

		// In development, return mock data
		if (process.env.NODE_ENV === "development") {
			return {
				id: 1,
				title: `Error Content: ${slug}`,
				slug: slug,
				body: `<p>An error occurred while fetching content: ${error.message}</p>`,
				thumbnailUrl: "/placeholder.svg?height=400&width=800",
				contentType: "blog",
				tags: ["error"],
				createdAt: new Date().toISOString(),
			};
		}

		return null;
	}
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
	return fetchProducts({ search: query }) as Promise<ProductsResponse>;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
	try {
		console.log(`Fetching product with slug: ${slug}`);
		const response = await fetchProducts({ slug });
		console.log(`Product response for slug ${slug}:`, response);

		if (response.data.products && response.data.products.length > 0) {
			return response.data.products[0];
		}

		// If no product found with the slug, try fetching with path parameter
		console.log(
			"No product found with slug parameter, trying with path parameter"
		);
		const pathResponse = await fetchProducts({ path: slug });
		console.log(`Product response for path ${slug}:`, pathResponse);

		if (pathResponse.data.products && pathResponse.data.products.length > 0) {
			return pathResponse.data.products[0];
		}

		console.log(`No product found for slug: ${slug}`);
		return null;
	} catch (error) {
		console.error("Error fetching product by slug:", error);
		return null;
	}
}

export async function getProductCategories(): Promise<string[]> {
	try {
		console.log("Fetching products to extract categories...");
		const productsResponse = await fetchProducts({ limit: 100 });
		const products = productsResponse.data.products;

		if (Array.isArray(products) && products.length > 0) {
			console.log(`Extracted categories from ${products.length} products`);

			// Extract unique categories from products
			const categories = products
				.map((product) => product.kategori)
				.filter((category): category is string => !!category)
				.filter((value, index, self) => self.indexOf(value) === index) 
				.sort(); 

			console.log("Extracted categories:", categories);

			if (categories.length > 0) {
				return categories;
			}
		}

		
		console.log("Using default categories as fallback");
		return [
			"Tenda Camping",
			"Aksesori",
			"Sleeping Bag",
			"Perlengkapan Outdoor & Survival",
			"Lampu",
			"Carrier & Ransel",
			"Peralatan Memasak Outdoor",
			"Lain-lain",
		];
	} catch (error) {
		console.error("Error fetching product categories:", error);
		// Return default categories on error
		return [
			"Tenda Camping",
			"Aksesori",
			"Sleeping Bag",
			"Perlengkapan Outdoor & Survival",
			"Lampu",
			"Carrier & Ransel",
			"Peralatan Memasak Outdoor",
			"Lain-lain",
		];
	}
}

// Admin API functions
// Update the fetchAdminStats function to use authentication token

export async function fetchAdminStats() {
	try {
		const token = getToken();
		const url = `${API_BASE_URL}/admin/stats`;
		console.log("Fetching admin stats from:", url);

		const headers: HeadersInit = {};
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		} else if (process.env.NODE_ENV === "development") {
			// Use mock token in development
			headers["Authorization"] = `Bearer mock-dev-token`;
		}

		const response = await fetch(url, {
			headers,
			next: { revalidate: 0 },
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch admin stats: ${response.status}`);
		}

		const result = await response.json();
		console.log("Admin stats API response:", result);

		// Handle the specific API response structure
		if (result.success && result.data) {
			// Map the API field names to what our application expects
			return {
				productCount: result.data.totalProducts || 0,
				contentCount: result.data.totalContents || 0,
				userCount: result.data.totalUsers || 0,
			};
		} else if (result.data) {
			// Try to handle other possible structures
			return {
				productCount:
					result.data.productCount || result.data.totalProducts || 0,
				contentCount:
					result.data.contentCount || result.data.totalContents || 0,
				userCount: result.data.userCount || result.data.totalUsers || 0,
			};
		} else {
			// If we can't find the expected structure, return the result as is
			return result;
		}
	} catch (error) {
		console.error("Error fetching admin stats:", error);
		// Return default stats on error
		return {
			productCount: 0,
			contentCount: 0,
			userCount: 0,
		};
	}
}}
