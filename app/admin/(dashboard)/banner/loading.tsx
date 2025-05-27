import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function BannerLoadingPage() {
	return (
		<div className="space-y-6">
			{/* Header Skeleton */}
			<div className="flex justify-between items-center">
				<div>
					<div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
					<div className="w-64 h-4 bg-gray-200 rounded animate-pulse"></div>
				</div>
				<div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
			</div>

			{/* Statistics Cards Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{[...Array(3)].map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
							<div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
						</CardHeader>
						<CardContent>
							<div className="w-16 h-8 bg-gray-200 rounded animate-pulse mb-1"></div>
							<div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Tabs Skeleton */}
			<div className="space-y-4">
				<div className="flex space-x-1">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
					))}
				</div>

				{/* Banner Grid Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[...Array(6)].map((_, i) => (
						<Card key={i} className="overflow-hidden">
							<div className="aspect-video bg-gray-200 animate-pulse"></div>
							<CardContent className="p-4">
								<div className="space-y-2">
									<div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
									<div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
								</div>
								<div className="flex gap-2 mt-4">
									<div className="flex-1 h-8 bg-gray-200 rounded animate-pulse"></div>
									<div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
