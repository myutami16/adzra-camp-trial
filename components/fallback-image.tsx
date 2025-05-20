"use client";

import Image from "next/image";
import { useState } from "react";

interface FallbackImageProps {
	src: string;
	alt: string;
	fallbackSrc?: string;
	fill?: boolean;
	className?: string;
	width?: number;
	height?: number;
}

export default function FallbackImage({
	src,
	alt,
	fallbackSrc = "/placeholder.svg",
	...props
}: FallbackImageProps) {
	const [imgSrc, setImgSrc] = useState(src);

	return (
		<Image
			src={imgSrc}
			alt={alt}
			{...props}
			onError={() => {
				console.error("Image failed to load:", src);
				setImgSrc(fallbackSrc);
			}}
		/>
	);
}
