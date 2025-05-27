"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface BulkBannerActionsProps {
	selectedBanners: string[];
	onSelectionChange: (selected: string[]) => void;
	onBulkAction: (
		action: "delete" | "activate" | "deactivate",
		bannerIds: string[]
	) => Promise<void>;
	totalBanners: number;
}

export default function BulkBannerActions({
	selectedBanners,
	onSelectionChange,
	onBulkAction,
	totalBanners,
}: BulkBannerActionsProps) {
	const [loading, setLoading] = useState(false);

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			// This would need to be implemented to select all visible banners
			// For now, we'll just clear selection
			onSelectionChange([]);
		} else {
			onSelectionChange([]);
		}
	};

	const handleBulkAction = async (
		action: "delete" | "activate" | "deactivate"
	) => {
		if (selectedBanners.length === 0) {
			toast.error("Pilih banner terlebih dahulu");
			return;
		}

		try {
			setLoading(true);
			await onBulkAction(action, selectedBanners);
			onSelectionChange([]); // Clear selection after action
		} catch (error) {
			console.error(`Error performing bulk ${action}:`, error);
			toast.error(`Gagal melakukan ${action} massal`);
		} finally {
			setLoading(false);
		}
	};

	if (selectedBanners.length === 0) {
		return null;
	}

	return (
		<div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
			<div className="flex items-center gap-2">
				<Checkbox
					checked={selectedBanners.length > 0}
					onCheckedChange={handleSelectAll}
				/>
				<span className="text-sm font-medium">
					{selectedBanners.length} banner dipilih
				</span>
				<Badge variant="secondary" className="text-xs">
					dari {totalBanners}
				</Badge>
			</div>

			<div className="flex gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm" disabled={loading}>
							Aksi Massal
							<ChevronDown className="h-4 w-4 ml-2" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={() => handleBulkAction("activate")}>
							<Eye className="h-4 w-4 mr-2" />
							Aktifkan Semua
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleBulkAction("deactivate")}>
							<EyeOff className="h-4 w-4 mr-2" />
							Nonaktifkan Semua
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleBulkAction("delete")}
							className="text-red-600">
							<Trash2 className="h-4 w-4 mr-2" />
							Hapus Semua
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<Button
					variant="ghost"
					size="sm"
					onClick={() => onSelectionChange([])}
					disabled={loading}>
					Batal
				</Button>
			</div>
		</div>
	);
}
