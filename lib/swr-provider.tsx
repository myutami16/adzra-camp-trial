"use client";

import { SWRConfig } from "swr";
import { fetcher } from "./fetcher";

interface SWRProviderProps {
	children: React.ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
	return (
		<SWRConfig
			value={{
				fetcher,
				revalidateOnFocus: false,
				refreshInterval: 60000,
				dedupingInterval: 2000,
				errorRetryCount: 3,
				errorRetryInterval: 5000,
				onError: (error, key) => {
					console.error("SWR Error:", error, "Key:", key);
				},
			}}>
			{children}
		</SWRConfig>
	);
}
