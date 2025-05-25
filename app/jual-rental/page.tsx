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
	const commonBoxStyle = {
		width: "250px",
		height: "200px",
		border: "1px solid #ccc",
		borderRadius: "12px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		fontSize: "18px",
		fontWeight: "bold",
		cursor: "pointer",
		textDecoration: "none",
		color: "white",
		textTransform: "uppercase",
		textAlign: "center",
		padding: "10px",
		backgroundImage:
			'url("https://via.placeholder.com/250x200.png?text=Outdoor+Gear")',
		backgroundSize: "cover",
		backgroundPosition: "center",
	};

	return (
		<main
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				minHeight: "100vh",
				padding: "20px",
				fontFamily: "sans-serif",
			}}>
			<h1 style={{ textAlign: "center", margin: "20px 0 40px 0" }}>
				{" "}
				{/* Centered heading with margin */}
				Kami juga melayani jual-rental alat-alat outdoor
			</h1>
			<section
				style={{
					display: "flex",
					justifyContent: "center",
					gap: "25px",
					marginTop: "30px",
					flexWrap: "wrap",
				}}>
				<Link href="/form-pembelian" style={{ textDecoration: "none" }}>
					<div style={commonBoxStyle}>FORM PEMBELIAN</div>
				</Link>
				<Link href="/form-persewaan" style={{ textDecoration: "none" }}>
					<div style={commonBoxStyle}>FORM PERSEWAAN</div>
				</Link>
				<Link href="/pricelist" style={{ textDecoration: "none" }}>
					<div style={commonBoxStyle}>PRICELIST</div>
				</Link>
				<Link href="/syarat-ketentuan" style={{ textDecoration: "none" }}>
					<div style={commonBoxStyle}>SYARAT & KETENTUAN</div>
				</Link>
			</section>
		</main>
	);
}
