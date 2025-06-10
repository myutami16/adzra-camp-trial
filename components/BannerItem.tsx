// Solusi 1: Ekstrak ke komponen terpisah (RECOMMENDED)
import { useBannerClick } from "@/hooks/banner_hooks";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";

interface BannerItemProps {
	banner: {
		id: number;
		name: string;
		image: string;
		href?: string;
		targetUrl?: string;
		location?: string;
		isActive?: boolean;
	};
	index: number;
	altPrefix?: string; // Untuk customization alt text
	gradientColors?: string; // Untuk customization gradient fallback
}

const BannerItem: React.FC<BannerItemProps> = ({
	banner,
	index,
	altPrefix = "Banner",
	gradientColors = "from-blue-500 to-purple-600",
}) => {
	// Hook dipanggil di top level komponen - AMAN!
	const { clickHandler, isClickable } = useBannerClick(banner, {
		trackAnalytics: true,
		preventDefault: true,
	});

	return (
		<CarouselItem key={banner.id} className="h-full pl-0">
			<Card className="h-full overflow-hidden border-0 rounded-none">
				<div
					className={`relative w-full h-full ${
						isClickable ? "cursor-pointer" : "cursor-default"
					}`}
					onClick={clickHandler}
					role={isClickable ? "button" : undefined}
					tabIndex={isClickable ? 0 : undefined}
					onKeyDown={(e) => {
						if (isClickable && (e.key === "Enter" || e.key === " ")) {
							e.preventDefault();
							clickHandler(e as any);
						}
					}}>
					<Image
						src={banner.image || "/placeholder.svg"}
						alt={`${altPrefix} ${index + 1}`}
						width={1440}
						height={600}
						className="w-full h-full object-cover object-center"
						sizes="100vw"
						priority={index === 0}
						quality={90}
						onError={(e) => {
							console.error(`Failed to load image: ${banner.image}`);
							const target = e.currentTarget as HTMLImageElement;
							target.src = "/placeholder.svg";
						}}
					/>

					{/* Clickable indicator overlay */}
					{isClickable && (
						<div className="absolute inset-0 bg-transparent hover:bg-black hover:bg-opacity-10 transition-all duration-200" />
					)}

					{/* Fallback for failed images */}
					<div
						className={`absolute inset-0 bg-gradient-to-br ${gradientColors} flex items-center justify-center opacity-0 hover:opacity-20 transition-opacity`}>
						<span className="text-white text-xl font-semibold">
							{banner.name}
						</span>
					</div>
				</div>
			</Card>
		</CarouselItem>
	);
};

export default BannerItem;
