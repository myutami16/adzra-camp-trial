"use client";

import Image from "next/image";

interface ImageWithErrorBoundaryProps {
	src: string;
	alt: string;
	fill?: boolean;
	className?: string;
}

export default function ImageWithErrorBoundary({
	src,
	alt,
	fill,
	className,
}: ImageWithErrorBoundaryProps) {
	const handleOnError = (e: Event) => {
		const target = e.target as HTMLImageElement;
		target.src = "/placeholder.svg?height=300&width=300";
	};

	return (
		<Image
			src={src}
			alt={alt}
			fill={fill}
			className={className}
			onError={handleOnError}
		/>
	);
}
