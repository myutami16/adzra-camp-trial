"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface BlogCardProps {
	post: {
		id?: number;
		title?: string;
		name?: string;
		slug?: string;
		thumbnailUrl?: string;
		thumbnail?: string;
		image?: string;
		createdAt?: string;
		date?: string;
		contentType?: string;
		type?: string;
		category?: string;
	};
}

export default function BlogCard({ post }: BlogCardProps) {
	// Handle different API response formats
	const id = post.id || Math.floor(Math.random() * 1000);
	const title = post.title || post.name || "Artikel";
	const slug = post.slug || `post-${id}`;
	const image =
		post.thumbnailUrl ||
		post.thumbnail ||
		post.image ||
		"/placeholder.svg?height=300&width=300";
	const date = post.createdAt || post.date || new Date().toISOString();
	const type = post.contentType || post.type || post.category || "blog";

	console.log(`BlogCard: Creating link for post ${title} with slug ${slug}`);

	return (
		<Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
			<Link href={`/blog/${slug}`} className="block">
				<div className="relative h-48">
					<Image
						src={image || "/placeholder.svg?height=300&width=300"}
						alt={title}
						fill
						className="object-cover"
						onError={(e) => {
							// Fallback if image fails to load
							const target = e.target as HTMLImageElement;
							target.src = "/placeholder.svg?height=300&width=300";
						}}
					/>
					{type && (
						<Badge className="absolute top-3 right-3 bg-primary-dark text-white dark:bg-primary-light dark:text-gray-900">
							{type}
						</Badge>
					)}
				</div>
				<CardContent className="p-4">
					<div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
						<Calendar className="h-4 w-4 mr-1" />
						<span>{formatDate(date)}</span>
					</div>
					<h3 className="font-medium text-lg line-clamp-2 hover:text-primary-dark dark:hover:text-primary-light transition-colors">
						{title}
					</h3>
				</CardContent>
			</Link>
		</Card>
	);
}
