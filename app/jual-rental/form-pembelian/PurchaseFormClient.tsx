"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
	fetchProducts,
	getProductCategories,
	type Product,
} from "../../../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function PurchaseFormClient() {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [selectedProducts, setSelectedProducts] = useState(""); // Textarea for manual entry
	const [notes, setNotes] = useState("");

	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedProduct, setSelectedProduct] = useState(""); // Dropdown selection

	const [categories, setCategories] = useState<string[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [rentableProducts, setRentableProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadData() {
			setIsLoading(true);
			setError(null);
			try {
				// Assuming getProductCategories returns string[] now
				const fetchedCategories: string[] = await getProductCategories();
				setCategories(fetchedCategories);
				const fetchedProducts = await fetchProducts();
				setProducts(fetchedProducts);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "An unknown error occurred"
				);
			} finally {
				setIsLoading(false);
			}
		}
		loadData();
	}, []);

	useEffect(() => {
		// Ensure products are filtered correctly based on isForRent
		setRentableProducts(products.filter((product) => product.isForRent));
	}, [products]);

	const handleCategoryChange = (value: string) => {
		setSelectedCategory(value);
		setSelectedProduct(""); // Reset product when category changes
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Format the message for WhatsApp
		const message = `
*FORM PEMBELIAN ADZRA CAMP*

Nama: ${name}
No. Telp: ${phone}
Alamat: ${address}

Produk Pilihan: ${selectedProduct || "Tidak ada produk dipilih dari daftar"}
Detail/Produk Tambahan:
${selectedProducts || "-"}

Catatan:
${notes || "-"}
    `.trim();

		// Encode the message for WhatsApp URL
		const encodedMessage = encodeURIComponent(message);

		// Open WhatsApp with the pre-filled message
		window.open(`https://wa.me/6281937681294?text=${encodedMessage}`, "_blank");
	};

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error: {error}</p>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-3xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-2">Form Pembelian</h1>
					<p className="text-gray-600">
						Isi form di bawah ini untuk membeli peralatan camping dari Adzra
						Camp
					</p>
				</div>

				<div className="bg-white rounded-lg shadow-md p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-4">
							<div>
								<Label htmlFor="name">Nama</Label>
								<Input
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>

							<div>
								<Label htmlFor="phone">No. Telp</Label>
								<Input
									id="phone"
									type="tel"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									required
								/>
							</div>

							<div>
								<Label htmlFor="address">Alamat</Label>
								<Textarea
									id="address"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									rows={3}
									required
								/>
							</div>

							<div>
								<Label htmlFor="category">Kategori</Label>
								<Select
									onValueChange={handleCategoryChange}
									value={selectedCategory}
									disabled={isLoading}>
									<SelectTrigger id="category">
										<SelectValue placeholder="Pilih kategori" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Kategori</SelectLabel>
											{categories.map((category) => (
												<SelectItem key={category} value={category}>
													{category}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="product">Produk</Label>
								<Select
									onValueChange={(value) => setSelectedProduct(value)}
									value={selectedProduct}
									disabled={!selectedCategory || isLoading}>
									<SelectTrigger id="product">
										<SelectValue placeholder="Pilih produk" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Produk</SelectLabel>
											{rentableProducts
												.filter(
													(product) => product.kategori === selectedCategory
												)
												.map((product) => (
													<SelectItem
														key={product.id}
														value={product.namaProduk}>
														{product.namaProduk}
													</SelectItem>
												))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="products">
									Detail Produk / Produk Lain (jika perlu)
								</Label>
								<Textarea
									id="products"
									value={selectedProducts}
									onChange={(e) => setSelectedProducts(e.target.value)}
									placeholder="Contoh: Tenda Dome 4 orang - 1 buah, Sleeping Bag - 2 buah. Atau produk lain yang tidak ada di daftar."
									rows={4}
								/>
							</div>

							<div>
								<Label htmlFor="notes">Catatan (opsional)</Label>
								<Textarea
									id="notes"
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									rows={3}
								/>
							</div>
						</div>

						<Button type="submit" className="w-full flex items-center gap-2">
							<Send className="h-4 w-4" />
							Kirim via WhatsApp
						</Button>

						<div className="text-sm text-gray-500 text-center mt-4">
							Setelah mengirim form, tim kami akan menghubungi Anda untuk
							konfirmasi pembelian dan pembayaran.
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
