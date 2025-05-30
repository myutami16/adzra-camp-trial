import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Adzra Camp - Camping Equipment Rental & Store",
	description: "Rental and store for camping equipment in Mojokerto, East Java",
	icons: {
		icon: "images/logo.png",
		shortcut: "images/logo.png",
		apple: "images/logo.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="id" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/adzra-camp.png" type="image/png" />
				<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
			</head>
			<body className={inter.className}>
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
					<div className="min-h-screen bg-background text-foreground">
						<Navbar />
						<main className="min-h-screen">{children}</main>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
