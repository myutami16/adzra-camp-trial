// components/BannerSlider.jsx
"use client"; // untuk Next.js App Router (Next.js 13+)
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ProductBanner = () => {
const ProductBanners = [
  {
    id: 1,
    name: "Promo Ramadhan",
    image: "/Banner/banner1.jpg",
    href: "/promo/ramadhan"
  },
  {
    id: 2,
    name: "Diskon Spesial",
    image: "/Banner/banner2.webp",
    href: "/promo/diskon"
  }
];


  return (
    <div className="w-full h-[600px]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 10000 }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="w-full h-full"
        >
        {ProductBanners.map((banner) => (
            <SwiperSlide key={banner.id}>
            <a href={banner.href}>
                <img
                src={banner.image}
                alt={banner.name}
                className="w-full h-full object-cover"
                />
            </a>
            </SwiperSlide>
        ))}
        </Swiper>
    </div>
  );
};

export default ProductBanner;
