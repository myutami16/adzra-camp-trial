"use client";

import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteBanner } from "@/lib/admin-api";
import { toast } from "sonner";

interface DeleteBannerDialogProps {
	bannerId: string | number;
	bannerLocation: string;
	onSuccess?: () => void;
}

export default function DeleteBannerDialog({
	bannerId,
	bannerLocation,
	onSuccess,
}: DeleteBannerDialogProps) {
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			console.log(`Attempting to delete banner with ID: ${bannerId}`);

			await deleteBanner(bannerId);

			toast.success("Banner berhasil dihapus");
			setOpen(false);

			// Call the success callback to refresh the data
			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			console.error("Error deleting banner:", error);
			toast.error(
				error instanceof Error ? error.message : "Gagal menghapus banner"
			);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<Button
				variant="outline"
				size="sm"
				onClick={() => setOpen(true)}
				className="text-red-600 hover:text-red-700 hover:bg-red-50">
				<Trash2 className="h-4 w-4" />
			</Button>

			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Hapus Banner</AlertDialogTitle>
						<AlertDialogDescription>
							Apakah Anda yakin ingin menghapus banner untuk lokasi{" "}
							<span className="font-semibold">{bannerLocation}</span>? Tindakan
							ini tidak dapat dibatalkan.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isDeleting}
							className="bg-red-600 hover:bg-red-700">
							{isDeleting ? "Menghapus..." : "Hapus"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
