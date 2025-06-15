"use client";

import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

interface ErrorDialogProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	message: string;
	type?: "error" | "warning" | "info";
}

export default function ErrorDialog({
	isOpen,
	onClose,
	title,
	message,
	type = "error",
}: ErrorDialogProps) {
	const getIcon = () => {
		switch (type) {
			case "error":
				return <AlertTriangle className="h-6 w-6 text-red-500" />;
			case "warning":
				return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
			case "info":
				return <AlertTriangle className="h-6 w-6 text-blue-500" />;
			default:
				return <AlertTriangle className="h-6 w-6 text-red-500" />;
		}
	};

	const getDefaultTitle = () => {
		switch (type) {
			case "error":
				return "Error";
			case "warning":
				return "Peringatan";
			case "info":
				return "Informasi";
			default:
				return "Error";
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{getIcon()}
						{title || getDefaultTitle()}
					</DialogTitle>
					<DialogDescription className="text-base mt-2">
						{message}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="sm:justify-end">
					<Button type="button" onClick={onClose} className="w-full sm:w-auto">
						<X className="h-4 w-4 mr-2" />
						Tutup
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
