import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Jual & Rental Alat Outdoor | Sewa & Pembelian Alat Gunung",
	description:
		"Kami melayani jual-rental alat outdoor berkualitas, cocok untuk mendaki, camping, dan kegiatan luar ruangan lainnya. Sewa atau beli alat outdoor dengan mudah.",
	openGraph: {
		title: "Jual & Rental Alat Outdoor | Sewa & Pembelian Alat Gunung",
		description:
			"Kami melayani jual-rental alat outdoor berkualitas, cocok untuk mendaki, camping, dan kegiatan luar ruangan lainnya. Sewa atau beli alat outdoor dengan mudah.",
		type: "website",
	},
	alternates: {
		canonical: "/jual-rental",
	},
};

export default function JualRentalPage() {
	const boxStyle = {
		width: "260px",
		height: "200px",
		borderRadius: "14px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		fontSize: "18px",
		fontWeight: 600,
		cursor: "pointer",
		color: "white",
		textAlign: "center",
		textTransform: "uppercase",
		backgroundColor: "rgb(243, 156, 17)",
		boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
		transition: "transform 0.2s ease",
	};

	const hoverEffect = {
		transform: "scale(1.05)",
	};

	const links = [
		{ href: "/form-pembelian", label: "Form Pembelian" },
		{ href: "/form-persewaan", label: "Form Persewaan" },
		{ href: "/pricelist", label: "Pricelist" },
		{ href: "/syarat-ketentuan", label: "Syarat & Ketentuan" },
	];

	return (
		<main
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				minHeight: "100vh",
				padding: "40px 20px",
				backgroundColor: "#f9f9f9",
				fontFamily: "var(--font-sans, sans-serif)",
			}}>
			<h1 style={{ textAlign: "center", marginBottom: "12px" }}>
				Layanan Jual & Sewa Peralatan Outdoor
			</h1>
			<p
				style={{
					textAlign: "center",
					color: "#555",
					maxWidth: "600px",
					marginBottom: "36px",
				}}>
				Temukan solusi terbaik untuk kebutuhan camping & aktivitas luar ruangan
				Anda. Sewa alat gunung untuk perjalanan pendek, atau beli perlengkapan
				outdoor terbaik untuk jangka panjang.
			</p>

			<section
				style={{
					display: "flex",
					justifyContent: "center",
					flexWrap: "wrap",
					gap: "24px",
				}}>
				{links.map(({ href, label }) => (
					<Link href={href} key={href} style={{ textDecoration: "none" }}>
						<div
							style={boxStyle}
							onMouseOver={(e) =>
								(e.currentTarget.style.transform = hoverEffect.transform)
							}
							onMouseOut={(e) =>
								(e.currentTarget.style.transform = "scale(1)")
							}>
							{label}
						</div>
					</Link>
				))}
			</section>
		</main>
	);
}
