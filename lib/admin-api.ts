import { getToken } from "./auth";
import {
	normalizeBannerData,
	normalizeBannerListResponse,
} from "./banner-utils";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	"https://camp-store.vercel.app/api";

// Helper function for authenticated API requests
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
	const token = getToken();

	if (!token) {
		// Check if we're in development mode and use a mock token
		if (process.env.NODE_ENV === "development") {
			console.warn("No auth token found, using mock token for development");
			const mockToken = "mock-dev-token";

			const headers = {
				Authorization: `Bearer ${mockToken}`,
				...options.headers,
			};

			try {
				const response = await fetch(`${API_BASE_URL}${endpoint}`, {
					...options,
					headers,
				});

				if (!response.ok) {
					const error = await response
						.json()
						.catch(() => ({ message: "An error occurred" }));
					throw new Error(
						error.message || `Request failed with status ${response.status}`
					);
				}

				return response.json();
			} catch (error) {
				console.error(
					`Failed to fetch from ${API_BASE_URL}${endpoint}:`,
					error
				);
				throw error;
			}
		} else {
			throw new Error("Authentication token not found. Please log in again.");
		}
	}

	const headers = {
		Authorization: `Bearer ${token}`,
		...options.headers,
	};

	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			...options,
			headers,
		});

		if (!response.ok) {
			const error = await response
				.json()
				.catch(() => ({ message: "An error occurred" }));
			throw new Error(
				error.message || `Request failed with status ${response.status}`
			);
		}

		return response.json();
	} catch (error) {
		console.error(`Failed to fetch from ${API_BASE_URL}${endpoint}:`, error);
		throw error;
	}
};

// Dashboard
export const getAdminStats = async () => {
	try {
		console.log("Fetching admin stats from API");
		const data = await fetchWithAuth("/admin/stats");
		console.log("Admin stats response:", data);

		// Map the API response to our expected format
		if (data.success && data.data) {
			// Handle the specific API response structure
			return {
				productCount: data.data.totalProducts || 0,
				contentCount: data.data.totalContents || 0,
				// Add other stats as needed
			};
		}

		// Fallback for different response structures
		if (data.data) {
			return {
				productCount: data.data.productCount || data.data.totalProducts || 0,
				contentCount: data.data.contentCount || data.data.totalContents || 0,
				// Add other stats as needed
			};
		}

		return data;
	} catch (error) {
		console.error("Error in getAdminStats:", error);
		throw error;
	}
};

// Products
export const fetchAdminProducts = async (params = {}) => {
	try {
		console.log("Fetching admin products with params:", params);

		// First try the correct admin endpoint
		try {
			console.log("Trying admin products endpoint with correct URL");
			const queryString = new URLSearchParams(
				params as Record<string, string>
			).toString();
			const endpoint = `/admin/produk${queryString ? `?${queryString}` : ""}`;

			try {
				const result = await fetchWithAuth(endpoint);
				console.log("Admin products response from admin endpoint:", result);

				// If we get a valid response, process it
				if (result) {
					// Map the API response to our expected format
					if (result.success && Array.isArray(result.data)) {
						// Map each product item to our expected format
						const mappedProducts = result.data.map((item: any) => ({
							id: item._id || item.id,
							namaProduk: item.namaProduk,
							slug: item.slug,
							harga: item.harga,
							stok: item.stok,
							deskripsi: item.deskripsi,
							gambar: item.gambar,
							kategori: item.kategori,
							isForSale: item.isForSale,
							isForRent: item.isForRent,
							createdAt: item.createdAt,
						}));

						return {
							products: mappedProducts,
							pagination: {
								currentPage: result.currentPage || 1,
								totalPages: result.totalPages || 1,
								totalItems:
									result.totalCount || result.count || mappedProducts.length,
								itemsPerPage: mappedProducts.length,
							},
						};
					}

					// If the structure is different, try to handle it
					if (result.data && Array.isArray(result.data)) {
						const mappedProducts = result.data.map((item: any) => ({
							id: item._id || item.id,
							namaProduk: item.namaProduk,
							slug: item.slug,
							harga: item.harga,
							stok: item.stok,
							deskripsi: item.deskripsi,
							gambar: item.gambar,
							kategori: item.kategori,
							isForSale: item.isForSale,
							isForRent: item.isForRent,
							createdAt: item.createdAt,
						}));

						return {
							products: mappedProducts,
							pagination: {
								currentPage: 1,
								totalPages: 1,
								totalItems: mappedProducts.length,
								itemsPerPage: mappedProducts.length,
							},
						};
					}
				}
			} catch (fetchError) {
				console.error("Error in fetchWithAuth for /admin/produk:", fetchError);
				// Continue to next attempt rather than throw
			}
		} catch (adminError) {
			console.error("Error fetching from admin endpoint:", adminError);
		}

		// Try alternative endpoint names as fallback
		try {
			console.log("Trying alternative admin products endpoint");
			const queryString = new URLSearchParams(
				params as Record<string, string>
			).toString();
			const endpoint = `/admin/products${queryString ? `?${queryString}` : ""}`;

			try {
				const result = await fetchWithAuth(endpoint);
				console.log(
					"Admin products response from alternative endpoint:",
					result
				);

				// Process response...
				if (result) {
					if (result.success && Array.isArray(result.data)) {
						const mappedProducts = result.data.map((item: any) => ({
							id: item._id || item.id,
							namaProduk: item.namaProduk || item.name,
							slug: item.slug,
							harga: item.harga || item.price,
							stok: item.stok || item.stock,
							deskripsi: item.deskripsi || item.description,
							gambar: item.gambar || item.image || item.images,
							kategori: item.kategori || item.category,
							isForSale: item.isForSale,
							isForRent: item.isForRent,
							createdAt: item.createdAt,
						}));

						return {
							products: mappedProducts,
							pagination: {
								currentPage: result.currentPage || 1,
								totalPages: result.totalPages || 1,
								totalItems:
									result.totalCount || result.count || mappedProducts.length,
								itemsPerPage: mappedProducts.length,
							},
						};
					}
				}
			} catch (fetchError) {
				console.error(
					"Error in fetchWithAuth for /admin/products:",
					fetchError
				);
				// Continue to next attempt rather than throw
			}
		} catch (adminError) {
			console.error(
				"Error fetching from alternative admin endpoint:",
				adminError
			);
		}

		// If admin endpoints fail, try the public endpoint
		try {
			console.log("Trying public products endpoint");

			try {
				const response = await fetch(`${API_BASE_URL}/products`, {
					next: { revalidate: 0 },
					cache: "no-store",
				});

				if (response.ok) {
					const result = await response.json();
					console.log("Products response from public endpoint:", result);

					if (
						result.status === "success" &&
						result.data &&
						Array.isArray(result.data.products)
					) {
						// Map each product item to our expected format
						const mappedProducts = result.data.products.map((item: any) => ({
							id: item._id || item.id,
							namaProduk: item.namaProduk || item.name,
							slug: item.slug,
							harga: item.harga || item.price,
							stok: item.stok || item.stock,
							deskripsi: item.deskripsi || item.description,
							gambar: item.gambar || item.thumbnailImage || item.images?.[0],
							kategori: item.kategori || item.category,
							isForSale: item.isForSale,
							isForRent: item.isForRent,
							createdAt: item.createdAt,
						}));

						return {
							products: mappedProducts,
							pagination: result.data.pagination || {
								currentPage: 1,
								totalPages: 1,
								totalItems: mappedProducts.length,
								itemsPerPage: mappedProducts.length,
							},
						};
					}
				}
			} catch (fetchError) {
				console.error("Error fetching from public endpoint:", fetchError);
				// Continue to next attempt rather than throw
			}
		} catch (publicError) {
			console.error("Error fetching from public endpoint:", publicError);
		}

		// If all attempts fail, return empty data
		console.warn("All product fetch attempts failed, returning empty data");
		return {
			products: [],
			pagination: {
				currentPage: 1,
				totalPages: 0,
				totalItems: 0,
				itemsPerPage: 10,
			},
		};
	} catch (error) {
		console.error("Error in fetchAdminProducts:", error);
		throw error;
	}
};

export const getProductById = async (id: number | string) => {
	try {
		console.log(`Fetching product with ID: ${id}`);
		try {
			const data = await fetchWithAuth(`/admin/produk?id=${id}`);
			console.log("Product response:", data);

			// Map the API response to our expected format
			if (data.success && data.data) {
				const item = data.data;
				return {
					id: item._id || item.id,
					namaProduk: item.namaProduk,
					harga: item.harga,
					stok: item.stok,
					deskripsi: item.deskripsi,
					gambar: item.gambar,
					kategori: item.kategori,
					isForSale: item.isForSale,
					isForRent: item.isForRent,
					createdAt: item.createdAt,
				};
			}

			return data;
		} catch (error) {
			console.error(`Error fetching from /admin/produk?id=${id}:`, error);

			// Fallback to the original endpoint path
			const data = await fetchWithAuth(`/admin/products/${id}`);
			console.log(
				`Product response for ID ${id} from fallback endpoint:`,
				data
			);

			if (data.success && data.data) {
				const item = data.data;
				return {
					id: item._id || item.id,
					namaProduk: item.namaProduk,
					harga: item.harga,
					stok: item.stok,
					deskripsi: item.deskripsi,
					gambar: item.gambar,
					kategori: item.kategori,
					isForSale: item.isForSale,
					isForRent: item.isForRent,
					createdAt: item.createdAt,
				};
			}
			return data;
		}
	} catch (error) {
		console.error("Error in getProductById:", error);
		throw error;
	}
};

export const createProduct = async (formData: FormData) => {
	const token = getToken();

	if (!token) {
		// Check if we're in development mode and use a mock token
		if (process.env.NODE_ENV === "development") {
			console.warn("No auth token found, using mock token for development");
			const mockToken = "mock-dev-token";

			const response = await fetch(`${API_BASE_URL}/admin/produk`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${mockToken}`,
				},
				body: formData,
			});

			if (!response.ok) {
				const error = await response
					.json()
					.catch(() => ({ message: "An error occurred" }));
				throw new Error(
					error.message || `Request failed with status ${response.status}`
				);
			}

			return response.json();
		} else {
			throw new Error("Authentication token not found. Please log in again.");
		}
	}

	const response = await fetch(`${API_BASE_URL}/admin/produk`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	});

	if (!response.ok) {
		const error = await response
			.json()
			.catch(() => ({ message: "An error occurred" }));
		throw new Error(
			error.message || `Request failed with status ${response.status}`
		);
	}

	return response.json();
};

export const updateProduct = async (
	id: number | string,
	formData: FormData
) => {
	const token = getToken();

	if (!token) {
		throw new Error("Authentication token not found");
	}

	try {
		const response = await fetch(`${API_BASE_URL}/admin/produk?id=${id}`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: formData,
		});

		if (!response.ok) {
			console.log("First update attempt failed, trying fallback endpoint");
			const fallbackResponse = await fetch(
				`${API_BASE_URL}/admin/produk?id=${id}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			);

			if (!fallbackResponse.ok) {
				const error = await fallbackResponse
					.json()
					.catch(() => ({ message: "An error occurred" }));
				throw new Error(
					error.message ||
						`Request failed with status ${fallbackResponse.status}`
				);
			}

			return fallbackResponse.json();
		}

		return response.json();
	} catch (error) {
		console.error("Error in updateContent:", error);
		throw error;
	}
};

export const deleteProduct = async (id: number | string) => {
	try {
		console.log(
			`Attempting to delete product with ID: ${id} from primary endpoint`
		);

		// Make sure we have a valid ID
		if (!id) {
			throw new Error("No product ID provided for deletion");
		}

		// Try the primary endpoint first
		try {
			const result = await fetchWithAuth(`/admin/produk/${id}`, {
				method: "DELETE",
			});
			console.log(
				`Successfully deleted product with ID ${id} from primary endpoint:`,
				result
			);
			return result;
		} catch (primaryError) {
			console.error(
				`Error deleting product with ID ${id} from primary endpoint:`,
				primaryError
			);

			// Try fallback endpoint with ID as query parameter
			try {
				const fallbackResult = await fetchWithAuth(`/admin/produk?id=${id}`, {
					method: "DELETE",
				});
				console.log(
					`Successfully deleted product with ID ${id} from first fallback endpoint:`,
					fallbackResult
				);
				return fallbackResult;
			} catch (fallbackError1) {
				console.error(
					`Error deleting product with ID ${id} from first fallback endpoint:`,
					fallbackError1
				);

				// Try second fallback endpoint
				try {
					const fallbackResult2 = await fetchWithAuth(`/admin/products/${id}`, {
						method: "DELETE",
					});
					console.log(
						`Successfully deleted product with ID ${id} from second fallback endpoint:`,
						fallbackResult2
					);
					return fallbackResult2;
				} catch (fallbackError2) {
					console.error(
						`Error deleting product with ID ${id} from second fallback endpoint:`,
						fallbackError2
					);
					throw fallbackError2;
				}
			}
		}
	} catch (error) {
		console.error(
			`All attempts to delete product with ID ${id} failed:`,
			error
		);
		throw error;
	}
};

// Content
export const fetchAdminContent = async (params = {}) => {
	try {
		console.log("Fetching admin content with params:", params);

		// First try the correct admin endpoint based on the error message
		try {
			console.log("Trying admin content endpoint with correct URL");
			const queryString = new URLSearchParams(
				params as Record<string, string>
			).toString();
			const endpoint = `/admin/konten${queryString ? `?${queryString}` : ""}`;

			try {
				const result = await fetchWithAuth(endpoint);
				console.log("Admin content response from admin endpoint:", result);

				// If we get a valid response, process it
				if (result) {
					// Map the API response to our expected format
					if (result.success && Array.isArray(result.data)) {
						// Map each content item to our expected format
						const mappedContent = result.data.map((item: any) => ({
							id: item._id || item.id,
							title: item.title,
							slug: item.slug,
							body: item.description || item.body,
							thumbnailUrl: item.image || item.thumbnailUrl,
							contentType: item.contentType,
							tags: item.tags || [],
							isActive: item.isActive,
							createdAt: item.createdAt,
						}));

						return {
							content: mappedContent,
							pagination: {
								currentPage: result.currentPage || 1,
								totalPages: result.totalPages || 1,
								totalItems:
									result.totalCount || result.count || mappedContent.length,
								itemsPerPage: mappedContent.length,
							},
						};
					}

					// If the structure is different, try to handle it
					if (result.data && Array.isArray(result.data)) {
						const mappedContent = result.data.map((item: any) => ({
							id: item._id || item.id,
							title: item.title,
							slug: item.slug,
							body: item.description || item.body,
							thumbnailUrl: item.image || item.thumbnailUrl,
							contentType: item.contentType,
							tags: item.tags || [],
							isActive: item.isActive,
							createdAt: item.createdAt,
						}));

						return {
							content: mappedContent,
							pagination: {
								currentPage: 1,
								totalPages: 1,
								totalItems: mappedContent.length,
								itemsPerPage: mappedContent.length,
							},
						};
					}
				}
			} catch (fetchError) {
				console.error("Error in fetchWithAuth for /admin/konten:", fetchError);
				// Continue to next attempt rather than throw
			}
		} catch (adminError) {
			console.error("Error fetching from admin endpoint:", adminError);
		}

		// Try the original admin endpoint path as fallback
		try {
			console.log("Trying original admin content endpoint");
			const queryString = new URLSearchParams(
				params as Record<string, string>
			).toString();
			const endpoint = `/admin/content${queryString ? `?${queryString}` : ""}`;

			try {
				const result = await fetchWithAuth(endpoint);
				console.log("Admin content response from admin endpoint:", result);

				// Process response...
				if (result) {
					if (result.success && Array.isArray(result.data)) {
						const mappedContent = result.data.map((item: any) => ({
							id: item._id || item.id,
							title: item.title,
							slug: item.slug,
							body: item.description || item.body,
							thumbnailUrl: item.image || item.thumbnailUrl,
							contentType: item.contentType,
							tags: item.tags || [],
							isActive: item.isActive,
							createdAt: item.createdAt,
						}));

						return {
							content: mappedContent,
							pagination: {
								currentPage: result.currentPage || 1,
								totalPages: result.totalPages || 1,
								totalItems:
									result.totalCount || result.count || mappedContent.length,
								itemsPerPage: mappedContent.length,
							},
						};
					}
				}
			} catch (fetchError) {
				console.error("Error in fetchWithAuth for /admin/content:", fetchError);
				// Continue to next attempt rather than throw
			}
		} catch (adminError) {
			console.error("Error fetching from admin endpoint:", adminError);
		}

		// If admin endpoints fail, try the public endpoint as provided in your error message
		try {
			console.log("Trying public content endpoint");

			try {
				const response = await fetch(`${API_BASE_URL}/content`, {
					next: { revalidate: 0 },
					cache: "no-store",
				});

				if (response.ok) {
					const result = await response.json();
					console.log("Content response from public endpoint:", result);

					if (result.success && Array.isArray(result.data)) {
						// Map each content item to our expected format
						const mappedContent = result.data.map((item: any) => ({
							id: item._id || item.id,
							title: item.title,
							slug: item.slug,
							body: item.description || item.body,
							thumbnailUrl: item.image || item.thumbnailUrl,
							contentType: item.contentType,
							tags: item.tags || [],
							isActive: item.isActive,
							createdAt: item.createdAt,
						}));

						return {
							content: mappedContent,
							pagination: {
								currentPage: result.currentPage || 1,
								totalPages: result.totalPages || 1,
								totalItems:
									result.totalCount || result.count || mappedContent.length,
								itemsPerPage: mappedContent.length,
							},
						};
					}
				}
			} catch (fetchError) {
				console.error("Error fetching from public endpoint:", fetchError);
				// Continue to next attempt rather than throw
			}
		} catch (publicError) {
			console.error("Error fetching from public endpoint:", publicError);
		}

		// If all attempts fail, return empty data
		console.warn("All content fetch attempts failed, returning empty data");
		return {
			content: [],
			pagination: {
				currentPage: 1,
				totalPages: 0,
				totalItems: 0,
				itemsPerPage: 10,
			},
		};
	} catch (error) {
		console.error("Error in fetchAdminContent:", error);
		throw error;
	}
};

export const getContentById = async (id: number | string) => {
	try {
		console.log(`Fetching content with ID: ${id}`);

		// First try the correct admin endpoint
		try {
			const data = await fetchWithAuth(`/admin/konten?id=${id}`);
			console.log(`Content response for ID ${id}:`, data);

			// Map the API response to our expected format
			if (data.success && data.data) {
				const item = data.data;
				return {
					id: item._id || item.id,
					title: item.title,
					slug: item.slug,
					body: item.description || item.body,
					thumbnailUrl: item.image || item.thumbnailUrl,
					contentType: item.contentType,
					tags: item.tags || [],
					isActive: item.isActive,
					createdAt: item.createdAt,
				};
			}

			return data;
		} catch (error) {
			console.error(`Error fetching from /admin/konten?id=${id}:`, error);

			// Fallback to the original endpoint path
			const data = await fetchWithAuth(`/admin/content/${id}`);
			console.log(
				`Content response for ID ${id} from fallback endpoint:`,
				data
			);

			if (data.success && data.data) {
				const item = data.data;
				return {
					id: item._id || item.id,
					title: item.title,
					slug: item.slug,
					body: item.description || item.body,
					thumbnailUrl: item.image || item.thumbnailUrl,
					contentType: item.contentType,
					tags: item.tags || [],
					isActive: item.isActive,
					createdAt: item.createdAt,
				};
			}

			return data;
		}
	} catch (error) {
		console.error("Error in getContentById:", error);
		throw error;
	}
};

export const createContent = async (formData: FormData) => {
	const token = getToken();

	if (!token) {
		throw new Error("Authentication token not found");
	}

	try {
		// Try the correct endpoint first
		const response = await fetch(`${API_BASE_URL}/admin/konten`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: formData,
		});

		if (!response.ok) {
			// If first attempt fails, try the fallback endpoint
			console.log("First create attempt failed, trying fallback endpoint");
			const fallbackResponse = await fetch(`${API_BASE_URL}/admin/content`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});

			if (!fallbackResponse.ok) {
				const error = await fallbackResponse
					.json()
					.catch(() => ({ message: "An error occurred" }));
				throw new Error(
					error.message ||
						`Request failed with status ${fallbackResponse.status}`
				);
			}

			return fallbackResponse.json();
		}

		return response.json();
	} catch (error) {
		console.error("Error in createContent:", error);
		throw error;
	}
};

export const updateContent = async (
	id: number | string,
	formData: FormData
) => {
	const token = getToken();

	if (!token) {
		throw new Error("Authentication token not found");
	}

	try {
		// Use the correct endpoint format based on the API example
		const response = await fetch(`${API_BASE_URL}/admin/konten?id=${id}`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: formData,
		});

		if (!response.ok) {
			// Try fallback endpoint
			console.log("First update attempt failed, trying fallback endpoint");
			const fallbackResponse = await fetch(
				`${API_BASE_URL}/admin/content?id=${id}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			);

			if (!fallbackResponse.ok) {
				const error = await fallbackResponse
					.json()
					.catch(() => ({ message: "An error occurred" }));
				throw new Error(
					error.message ||
						`Request failed with status ${fallbackResponse.status}`
				);
			}

			return fallbackResponse.json();
		}

		return response.json();
	} catch (error) {
		console.error("Error in updateContent:", error);
		throw error;
	}
};

export const deleteContent = async (id: number | string) => {
	try {
		// Try the correct endpoint first
		return await fetchWithAuth(`/admin/konten?id=${id}`, { method: "DELETE" });
	} catch (error) {
		console.error(
			`Error deleting content with ID ${id} from first endpoint:`,
			error
		);

		// Try fallback endpoint
		try {
			return await fetchWithAuth(`/admin/content?id=${id}`, {
				method: "DELETE",
			});
		} catch (fallbackError) {
			console.error(
				`Error deleting content with ID ${id} from fallback endpoint:`,
				fallbackError
			);
			throw fallbackError;
		}
	}
};

// Admin Users
export const fetchAdmins = async () => {
	try {
		console.log("Fetching admin users");
		const data = await fetchWithAuth("/admin/users");
		console.log("Admin users response:", data);

		if (data.data) {
			return data.data;
		}
		return data;
	} catch (error) {
		console.error("Error in fetchAdmins:", error);
		throw error;
	}
};

export const getAdminById = async (id: number) => {
	try {
		console.log(`Fetching admin with ID: ${id}`);
		const data = await fetchWithAuth(`/admin/users/${id}`);
		console.log(`Admin response for ID ${id}:`, data);

		if (data.data) {
			return data.data;
		}
		return data;
	} catch (error) {
		console.error("Error in getAdminById:", error);
		throw error;
	}
};

export const createAdmin = async (adminData: {
	name: string;
	username: string;
	password: string;
	role: string;
}) => {
	return fetchWithAuth("/admin/users", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(adminData),
	});
};

export const updateAdmin = async (
	id: number,
	adminData: {
		name: string;
		username: string;
		role: string;
		password?: string;
	}
) => {
	return fetchWithAuth(`/admin/users/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(adminData),
	});
};

export const deleteAdmin = async (id: number) => {
	return fetchWithAuth(`/admin/users/${id}`, { method: "DELETE" });
};

// Banner
export const fetchAdminBanners = async (params = {}) => {
	try {
		console.log("Fetching admin banners with params:", params);

		// Try the correct admin endpoint
		try {
			console.log("Trying admin banner endpoint with correct URL");
			const queryString = new URLSearchParams(
				params as Record<string, string>
			).toString();
			const endpoint = `/admin/Banner${queryString ? `?${queryString}` : ""}`;

			try {
				const result = await fetchWithAuth(endpoint);
				console.log("Admin banners response from admin endpoint:", result);

				// If we get a valid response, process it
				if (result) {
					return normalizeBannerListResponse(result);
				}
			} catch (fetchError) {
				console.error("Error in fetchWithAuth for /admin/Banner:", fetchError);
				// Continue to next attempt rather than throw
			}
		} catch (adminError) {
			console.error("Error fetching from admin endpoint:", adminError);
		}

		// If admin endpoints fail, try the public endpoint
		try {
			console.log("Trying public banner endpoint");

			try {
				const response = await fetch(`${API_BASE_URL}/banners`, {
					next: { revalidate: 0 },
					cache: "no-store",
				});

				if (response.ok) {
					const result = await response.json();
					console.log("Banners response from public endpoint:", result);
					return normalizeBannerListResponse(result);
				}
			} catch (fetchError) {
				console.error("Error fetching from public endpoint:", fetchError);
			}
		} catch (publicError) {
			console.error("Error fetching from public endpoint:", publicError);
		}

		// If all attempts fail, return empty data
		console.warn("All banner fetch attempts failed, returning empty data");
		return {
			banners: [],
			pagination: {
				currentPage: 1,
				totalPages: 0,
				totalItems: 0,
				itemsPerPage: 10,
			},
			locationStats: null,
		};
	} catch (error) {
		console.error("Error in fetchAdminBanners:", error);
		throw error;
	}
};

export const getBannerById = async (id: number | string) => {
	try {
		console.log(`Fetching banner with ID: ${id}`);

		try {
			const data = await fetchWithAuth(`/admin/Banner?id=${id}`);
			console.log(`Banner response for ID ${id}:`, data);

			// Map the API response to our expected format
			if (data.success && data.data) {
				return normalizeBannerData(data.data);
			}

			return normalizeBannerData(data);
		} catch (error) {
			console.error(`Error fetching from /admin/Banner?id=${id}:`, error);

			// Try alternative endpoint
			try {
				const data = await fetchWithAuth(`/admin/banner/${id}`);
				console.log(
					`Banner response for ID ${id} from alternative endpoint:`,
					data
				);

				if (data.success && data.data) {
					return normalizeBannerData(data.data);
				}

				return normalizeBannerData(data);
			} catch (altError) {
				console.error(`Error fetching from alternative endpoint:`, altError);
				throw altError;
			}
		}
	} catch (error) {
		console.error("Error in getBannerById:", error);
		throw error;
	}
};

export const createBanner = async (formData: FormData) => {
	const token = getToken();
	let mockToken = null;

	if (!token) {
		// Check if we're in development mode and use a mock token
		if (process.env.NODE_ENV === "development") {
			console.warn("No auth token found, using mock token for development");
			mockToken = "mock-dev-token";
		} else {
			throw new Error("Authentication token not found. Please log in again.");
		}
	}

	console.log("Creating banner with form data:", {
		location: formData.get("location"),
		isActive: formData.get("isActive"),
		targetUrl: formData.get("targetUrl"),
		hasImage: formData.has("image"),
	});

	const response = await fetch(`${API_BASE_URL}/admin/Banner`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token || mockToken}`,
		},
		body: formData,
	});

	if (!response.ok) {
		const errorData = await response
			.json()
			.catch(() => ({ message: "An error occurred" }));
		console.error("Banner creation failed:", errorData);
		throw new Error(
			errorData.message || `Request failed with status ${response.status}`
		);
	}

	const result = await response.json();
	console.log("Banner creation successful:", result);
	return result;
};

export const deleteBanner = async (id: number | string) => {
	try {
		console.log(`Attempting to delete banner with ID: ${id}`);

		// Make sure we have a valid ID
		if (!id) {
			throw new Error("No banner ID provided for deletion");
		}

		try {
			const result = await fetchWithAuth(`/admin/Banner?id=${id}`, {
				method: "DELETE",
			});
			console.log(`Successfully deleted banner with ID ${id}:`, result);
			return result;
		} catch (primaryError) {
			console.error(
				`Error deleting banner with ID ${id} from primary endpoint:`,
				primaryError
			);

			// Try fallback endpoint
			try {
				const fallbackResult = await fetchWithAuth(`/admin/Banner/${id}`, {
					method: "DELETE",
				});
				console.log(
					`Successfully deleted banner with ID ${id} from fallback endpoint:`,
					fallbackResult
				);
				return fallbackResult;
			} catch (fallbackError) {
				console.error(
					`Error deleting banner with ID ${id} from fallback endpoint:`,
					fallbackError
				);
				throw fallbackError;
			}
		}
	} catch (error) {
		console.error(`All attempts to delete banner with ID ${id} failed:`, error);
		throw error;
	}
};
