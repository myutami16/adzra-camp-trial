import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export interface Banner {
	id: number | string;
	image: string;
	cloudinary_id?: string;
	location: "homepage" | "productpage";
	targetUrl?: string;
	isActive: boolean;
	createdAt: string;
}

interface UseBannersOptions {
	location: "homepage" | "productpage";
	limit?: number;
}

export const useBanners = ({ location, limit = 5 }: UseBannersOptions) => {
	const url = `/api/banner?location=${location}&limit=${limit}&isActive=true`;

	const { data, error, isLoading, mutate } = useSWR<Banner[]>(url, fetcher, {
		revalidateOnFocus: false,
		refreshInterval: 60000,
		dedupingInterval: 30000,
		errorRetryCount: 3,
		errorRetryInterval: 5000,
	});

	return {
		banners: data || [],
		isLoading,
		error,
		mutate,
	};
};
