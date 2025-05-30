import Link from "next/link";
import Image from "next/image";
import { Instagram, MapPin, Phone, Mail, ShoppingBag } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-primary-dark text-white pt-12 pb-6 dark:bg-gray-800">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Logo and About */}
					<div className="space-y-4">
						<Link href="/" className="inline-block">
							<Image
								src="/images/logo.png"
								alt="Adzra Camp Logo"
								width={120}
								height={120}
								className="h-24 w-auto"
							/>
						</Link>
						<p className="text-gray-300">
							Penyedia peralatan camping berkualitas untuk sewa dan jual di
							Mojokerto, Jawa Timur.
						</p>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Kontak Kami</h3>
						<ul className="space-y-3">
							<li className="flex items-start">
								<MapPin className="mr-2 h-5 w-5 text-accent shrink-0 mt-0.5" />
								<span>
									Sebelah bank BRI pasar pandan, masuk Gang ke barat, Njarum,
									Pandanarum, Kec. Pacet, Kabupaten Mojokerto, Jawa Timur 61374
								</span>
							</li>
							<li className="flex items-center">
								<Phone className="mr-2 h-5 w-5 text-accent" />
								<span>081937681294 (Admin)</span>
							</li>
							<li className="flex items-center">
								<Mail className="mr-2 h-5 w-5 text-accent" />
								<a href="mailto:adzracampingequipment@gmail.com" className="hover:underline">
									adzracampingequipment@gmail.com
								</a>
							</li>
						</ul>
					</div>

					{/* Marketplace */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Marketplace</h3>
						<ul className="space-y-3">
							<li>
								<a
									href="https://www.tokopedia.com/adzracamp-officialstore"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center hover:text-accent">
									<img
										src="/icons/tokopedia.png"
										alt="Tokopedia"
										className="mr-2 h-5 w-5"
									/>
									<span>Tokopedia</span>
								</a>
							</li>
							<li>
								<a
									href="https://shopee.co.id/adzracampstore"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center hover:text-accent">
									<img
										src="/icons/shopee.png"
										alt="Shopee"
										className="mr-2 h-5 w-5"
									/>
									<span>Shopee</span>
								</a>
							</li>
							<li>
								<a
									href="https://www.lazada.co.id/shop/adzra-camp-store/"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center hover:text-accent">
									<img
										src="/icons/lazada.png"
										alt="Lazada"
										className="mr-2 h-5 w-5"
									/>
									<span>Lazada</span>
								</a>
							</li>
						</ul>
					</div>

					{/* Social Media */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Media Sosial</h3>
						<ul className="space-y-3">
							<li>
								<a
									href="https://www.tiktok.com/@adzra.camp.store"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center hover:text-accent">
									<svg
										className="mr-2 h-5 w-5"
										viewBox="0 0 24 24"
										fill="currentColor">
										<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
									</svg>
									<span>TikTok</span>
								</a>
							</li>
							<li>
								<a
									href="https://www.instagram.com/adzracampstore/"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center hover:text-accent">
									<Instagram className="mr-2 h-5 w-5" />
									<span>Instagram Store</span>
								</a>
							</li>
							<li>
								<a
									href="https://www.instagram.com/adzra_camping_equipment/"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center hover:text-accent">
									<Instagram className="mr-2 h-5 w-5" />
									<span>Instagram Rental</span>
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
					<p>
						&copy; {new Date().getFullYear()} Adzra Camp. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
