"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Eye, EyeOff } from "lucide-react";

interface BannerStatsCardProps {
	title: string;
	total: number;
	active: number;
	maxAllowed?: number;
	icon?: React.ReactNode;
}

export default function BannerStatsCard({
	title,
	total,
	active,
	maxAllowed = 5,
	icon = <ImageIcon className="h-4 w-4 text-muted-foreground" />,
}: BannerStatsCardProps) {
	const isNearLimit = total >= maxAllowed * 0.8; // 80% of max
	const isAtLimit = total >= maxAllowed;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<div>
						<div className="text-2xl font-bold">
							{active}/{total}
						</div>
						<p className="text-xs text-muted-foreground">
							Aktif/Total (max {maxAllowed})
						</p>
					</div>
					<div className="flex flex-col gap-1">
						<Badge
							variant={active > 0 ? "default" : "secondary"}
							className={`text-xs ${active > 0 ? "bg-green-600" : ""}`}>
							<Eye className="h-3 w-3 mr-1" />
							{active}
						</Badge>
						{total - active > 0 && (
							<Badge variant="secondary" className="text-xs">
								<EyeOff className="h-3 w-3 mr-1" />
								{total - active}
							</Badge>
						)}
					</div>
				</div>

				{/* Progress bar */}
				<div className="mt-3">
					<div className="flex justify-between text-xs text-muted-foreground mb-1">
						<span>Kapasitas</span>
						<span>
							{total}/{maxAllowed}
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className={`h-2 rounded-full transition-all duration-300 ${
								isAtLimit
									? "bg-red-500"
									: isNearLimit
									? "bg-yellow-500"
									: "bg-blue-500"
							}`}
							style={{ width: `${Math.min((total / maxAllowed) * 100, 100)}%` }}
						/>
					</div>
					{isAtLimit && (
						<p className="text-xs text-red-600 mt-1">Batas maksimal tercapai</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
