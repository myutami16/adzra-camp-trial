import { notFound } from "next/navigation";
import { getContentBySlug, fetchContent } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import BlogCard from "@/components/blog-card";
import FallbackImage from "@/components/fallback-image";

interface BlogPostPageProps {
	params: {
		slug: string;
	};
}

export async function generateMetadata({ params }: BlogPostPageProps) {
	try {
		const post = await getContentBySlug(params.slug);

		if (!post) {
			return {
				title: "Artikel Tidak Ditemukan - Adzra Camp",
				description: "Artikel yang Anda cari tidak ditemukan",
			};
		}

		return {
			title: `${post.title} - Adzra Camp Blog`,
			description:
				post.body?.slice(0, 160) || `Artikel ${post.title} dari Adzra Camp`,
		};
	} catch (error) {
		console.error("Error generating metadata:", error);
		return {
			title: "Adzra Camp Blog",
			description:
				"Blog Adzra Camp - Informasi dan tips tentang camping dan outdoor",
		};
	}
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	console.log("Fetching blog post with slug:", params.slug);

	let post = null;
	let error = null;

	try {
		post = await getContentBySlug(params.slug);
		console.log("Blog post data:", post);
	} catch (e) {
		console.error("Error fetching blog post:", e);
		error = e;
	}

	if (!post && !error) {
		console.log("Blog post not found, returning 404");
		notFound();
	}

	// If there was an error but we're in production, show 404
	if (error && process.env.NODE_ENV !== "development") {
		notFound();
	}

	// Create a fallback post if some properties are missing
	const safePost = post
		? {
				id: post.id,
				title: post.title || "Untitled Article",
				slug: post.slug || params.slug,
				body: post.body || "<p>No content available.</p>",
				thumbnailUrl:
					post.thumbnailUrl || "/placeholder.svg?height=400&width=800",
				contentType: post.contentType || "blog",
				tags: post.tags || [],
				createdAt: post.createdAt || new Date().toISOString(),
		  }
		: {
				id: 0,
				title: "Error Loading Article",
				slug: params.slug,
				body: error
					? `<p>Error loading article: ${error.message}</p>`
					: "<p>Article could not be loaded.</p>",
				thumbnailUrl: "/placeholder.svg?height=400&width=800",
				contentType: "blog",
				tags: [],
				createdAt: new Date().toISOString(),
		  };

	// Debug output to help troubleshoot
	console.log("Safe post for rendering:", {
		title: safePost.title,
		body: safePost.body ? safePost.body.substring(0, 100) + "..." : "No body",
		thumbnailUrl: safePost.thumbnailUrl,
		contentType: safePost.contentType,
		tags: safePost.tags,
	});

	// Fetch related posts
	let relatedPosts = [];
	try {
		const relatedPostsData = await fetchContent({
			type: safePost.contentType,
			limit: 3,
		});

		// Filter out current post from related posts
		relatedPosts = relatedPostsData.data.content
			.filter((p) => p.id !== safePost.id)
			.slice(0, 3);
	} catch (error) {
		console.error("Error fetching related posts:", error);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<Link
				href="/blog"
				className="inline-flex items-center text-gray-600 hover:text-primary-dark mb-6">
				<ArrowLeft className="h-4 w-4 mr-2" />
				Kembali ke Blog
			</Link>

			<article className="max-w-3xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl md:text-4xl font-bold mb-4">
						{safePost.title}
					</h1>

					<div className="flex items-center gap-4 text-gray-500 mb-6">
						<time dateTime={safePost.createdAt}>
							{formatDate(safePost.createdAt)}
						</time>
						{safePost.contentType && (
							<div className="bg-primary-light/10 text-primary-dark px-3 py-1 rounded-full text-sm">
								{safePost.contentType}
							</div>
						)}
					</div>

					{safePost.thumbnailUrl && (
						<div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
							<FallbackImage
								src={safePost.thumbnailUrl}
								alt={safePost.title}
								fallbackSrc="/placeholder.svg?height=400&width=800"
								fill
								className="object-cover"
							/>
						</div>
					)}
				</div>

				<div className="prose max-w-none">
					{safePost.body ? (
						<div dangerouslySetInnerHTML={{ __html: safePost.body }} />
					) : (
						<p>Konten tidak tersedia.</p>
					)}
				</div>

				{safePost.tags && safePost.tags.length > 0 && (
					<div className="mt-8 pt-6 border-t">
						<div className="flex flex-wrap gap-2">
							{safePost.tags.map((tag) => (
								<span
									key={tag}
									className="bg-gray-100 px-3 py-1 rounded-full text-sm">
									{tag}
								</span>
							))}
						</div>
					</div>
				)}
			</article>

			{relatedPosts.length > 0 && (
				<div className="mt-16">
					<h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{relatedPosts.map((relatedPost) => (
							<BlogCard key={relatedPost.id} post={relatedPost} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}
