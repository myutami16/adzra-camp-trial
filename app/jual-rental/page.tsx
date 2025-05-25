import Image from "next/image";
import Link from "next/link";
import {
	ShoppingCart,
	Clock,
	FileText,
	DollarSign,
	Tent,
	Backpack,
	ChefHat,
	Compass,
	Shield,
	Award,
	Star,
} from "lucide-react";

export const metadata = {
	title:
		"Jual & Sewa Peralatan Camping - Adzra Camp Mojokerto | Harga Terjangkau Kualitas Terpercaya",
	description:
		"Jual & sewa peralatan camping berkualitas di Mojokerto. Tenda, sleeping bag, carrier, peralatan masak dengan harga terjangkau. Proses mudah, barang terawat, layanan 24/7.",
	keywords:
		"jual peralatan camping, sewa alat camping mojokerto, rental tenda, jual sleeping bag, peralatan outdoor mojokerto, camping gear murah",
	openGraph: {
		title: "Jual & Sewa Peralatan Camping Terlengkap - Adzra Camp",
		description:
			"Dapatkan peralatan camping berkualitas dengan harga terjangkau. Layanan jual & sewa terpercaya di Mojokerto sejak 2020.",
		type: "website",
	},
};

export default function JualRentalPage() {
	const quickActions = [
		{
			title: "Form Pembelian",
			description: "Beli peralatan camping berkualitas dengan harga terbaik",
			icon: ShoppingCart,
			href: "/jual-rental/form-pembelian",
			color:
				"bg-gradient-to-br from-green-700 to-green-800 hover:from-green-600 hover:to-green-700",
		},
		{
			title: "Form Persewaan",
			description: "Sewa peralatan camping untuk petualangan Anda",
			icon: Clock,
			href: "/jual-rental/form-persewaan",
			color:
				"bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500",
		},
		{
			title: "Daftar Harga",
			description: "Lihat harga lengkap semua peralatan camping kami",
			icon: DollarSign,
			href: "/jual-rental/pricelist",
			color:
				"bg-gradient-to-br from-green-700 to-green-800 hover:from-green-600 hover:to-green-700",
		},
		{
			title: "Syarat & Ketentuan",
			description: "Baca aturan jual beli dan persewaan peralatan",
			icon: FileText,
			href: "/jual-rental/syarat-ketentuan",
			color:
				"bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500",
		},
	];

	const categories = [
		{
			name: "Tenda & Shelter",
			items: [
				"Tenda Dome 2-8 Orang",
				"Tenda Gunung",
				"Flysheet",
				"Tarp",
				"Hammock",
			],
			icon: Tent,
			available: "25+ Item",
		},
		{
			name: "Tas & Carrier",
			items: [
				"Carrier 40-80L",
				"Daypack",
				"Sling Bag",
				"Dry Bag",
				"Travel Bag",
			],
			icon: Backpack,
			available: "30+ Item",
		},
		{
			name: "Peralatan Masak",
			items: [
				"Kompor Portable",
				"Nesting Cook Set",
				"Gas Kaleng",
				"Water Bottle",
				"Cutlery Set",
			],
			icon: ChefHat,
			available: "20+ Item",
		},
		{
			name: "Perlengkapan Tidur",
			items: ["Sleeping Bag", "Matras", "Pillow", "Ground Sheet", "Blanket"],
			icon: Compass,
			available: "15+ Item",
		},
	];

	const whyChooseUs = [
		{
			icon: Shield,
			title: "Kualitas Terjamin",
			description:
				"Semua peralatan kami telah melewati quality control ketat dan selalu dalam kondisi prima",
		},
		{
			icon: Award,
			title: "Harga Terjangkau",
			description:
				"Dapatkan peralatan camping berkualitas dengan harga yang ramah di kantong",
		},
		{
			icon: Star,
			title: "Layanan Terpercaya",
			description:
				"Pengalaman 5+ tahun melayani ribuan customer dengan rating kepuasan 4.9/5",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-r from-green-800 via-green-700 to-orange-500 text-white py-20">
				<div className="absolute inset-0 bg-black/20"></div>
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
							Jual & Sewa Peralatan
							<br />
							<span className="text-orange-300">Camping Terlengkap</span>
						</h1>
						<p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto leading-relaxed">
							Dapatkan peralatan camping berkualitas premium dengan harga
							terjangkau. Melayani jual beli dan persewaan di Mojokerto &
							sekitarnya sejak 2020.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<div className="flex items-center gap-2 text-orange-200">
								<Star className="h-5 w-5 fill-current" />
								<span className="font-semibold">4.9/5 Rating</span>
							</div>
							<div className="hidden sm:block w-px h-6 bg-gray-300"></div>
							<div className="flex items-center gap-2 text-orange-200">
								<Shield className="h-5 w-5" />
								<span className="font-semibold">1000+ Customer Puas</span>
							</div>
							<div className="hidden sm:block w-px h-6 bg-gray-300"></div>
							<div className="flex items-center gap-2 text-orange-200">
								<Award className="h-5 w-5" />
								<span className="font-semibold">Garansi Kualitas</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Quick Actions */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
								Mulai Petualangan Anda Sekarang
							</h2>
							<p className="text-xl text-gray-600 max-w-2xl mx-auto">
								Pilih layanan yang Anda butuhkan dan nikmati kemudahan
								berbelanja peralatan camping terbaik
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
							{quickActions.map((action, index) => (
								<Link
									key={index}
									href={action.href}
									className={`${action.color} rounded-2xl p-8 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group`}>
									<div className="flex flex-col items-center text-center space-y-4">
										<div className="p-4 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
											<action.icon className="h-8 w-8" />
										</div>
										<div>
											<h3 className="text-xl font-bold mb-2">{action.title}</h3>
											<p className="text-white/90 text-sm leading-relaxed">
												{action.description}
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Categories Section */}
			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
								Kategori Peralatan Lengkap
							</h2>
							<p className="text-xl text-gray-600 max-w-2xl mx-auto">
								Dari tenda hingga peralatan masak, kami sediakan semua kebutuhan
								camping Anda
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
							{categories.map((category, index) => (
								<div
									key={index}
									className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
									<div className="flex items-center justify-between mb-4">
										<div className="p-3 bg-gradient-to-br from-green-100 to-orange-100 rounded-xl">
											<category.icon className="h-8 w-8 text-green-700" />
										</div>
										<span className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
											{category.available}
										</span>
									</div>
									<h3 className="text-xl font-bold text-gray-800 mb-3">
										{category.name}
									</h3>
									<ul className="space-y-2">
										{category.items.map((item, itemIndex) => (
											<li
												key={itemIndex}
												className="text-gray-600 text-sm flex items-center">
												<div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
												{item}
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Why Choose Us */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
								Mengapa Pilih Adzra Camp?
							</h2>
							<p className="text-xl text-gray-600 max-w-2xl mx-auto">
								Kami berkomitmen memberikan layanan terbaik untuk setiap
								petualangan Anda
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{whyChooseUs.map((reason, index) => (
								<div
									key={index}
									className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-green-50 hover:to-orange-50 transition-all duration-300">
									<div className="inline-flex p-4 bg-gradient-to-br from-green-600 to-orange-500 rounded-full text-white mb-6">
										<reason.icon className="h-8 w-8" />
									</div>
									<h3 className="text-2xl font-bold text-gray-800 mb-4">
										{reason.title}
									</h3>
									<p className="text-gray-600 leading-relaxed">
										{reason.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-gradient-to-r from-green-700 to-orange-500">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto text-center text-white">
						<h2 className="text-3xl md:text-4xl font-bold mb-6">
							Siap Untuk Petualangan Selanjutnya?
						</h2>
						<p className="text-xl mb-8 text-gray-100 leading-relaxed">
							Jangan biarkan peralatan yang kurang berkualitas merusak
							pengalaman camping Anda. Hubungi kami sekarang dan dapatkan
							penawaran terbaik!
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/jual-rental/form-persewaan"
								className="bg-white text-green-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 inline-flex items-center justify-center gap-2">
								<Clock className="h-5 w-5" />
								Sewa Sekarang
							</Link>
							<Link
								href="/jual-rental/form-pembelian"
								className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-green-700 transition-all duration-300 inline-flex items-center justify-center gap-2">
								<ShoppingCart className="h-5 w-5" />
								Beli Sekarang
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
