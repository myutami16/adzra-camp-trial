"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, Trash2 } from "lucide-react";

interface ProductItem {
	id: string;
	name: string;
	quantity: number;
}

export default function PurchaseFormClient() {
	const searchParams = useSearchParams();
	const productQuery = searchParams.get("produk");



	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [products, setProducts] = useState<ProductItem[]>([
		{ id: crypto.randomUUID(), name: productQuery, quantity: 1 },
	]);
	const [notes, setNotes] = useState("");

	const addProduct = () => {
		setProducts([
			...products,
			{ id: crypto.randomUUID(), name: "", quantity: 1 },
		]);
	};

	const removeProduct = (id: string) => {
		if (products.length > 1) {
			setProducts(products.filter((product) => product.id !== id));
		}
	};

	const updateProduct = (
		id: string,
		field: keyof ProductItem,
		value: string | number
	) => {
		setProducts(
			products.map((product) =>
				product.id === id ? { ...product, [field]: value } : product
			)
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Format the products list
		const productsList = products
			.filter((product) => product.name.trim() !== "")
			.map((product) => `${product.name} x ${product.quantity}`)
			.join("\n");

		// Format the message for WhatsApp
		const message = `
*FORM PEMBELIAN ADZRA CAMP*

Nama: ${name}
No. Telp: ${phone}
Alamat: ${address}

Produk yang ingin dibeli:
${productsList}

Catatan:
${notes || "-"}
    `.trim();

		const encodedMessage = encodeURIComponent(message);

		window.open(`https://wa.me/6281937681294?text=${encodedMessage}`, "_blank");
	};

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

							<div className="space-y-3">
								<Label>Produk yang ingin dibeli</Label>

								{products.map((product, index) => (
									<div key={product.id} className="flex gap-2">
										<Input
											value={product.name}
											onChange={(e) =>
												updateProduct(product.id, "name", e.target.value)
											}
											placeholder="Nama produk"
											className="flex-1"
										/>
										<Input
											type="number"
											min="1"
											value={product.quantity}
											onChange={(e) =>
												updateProduct(
													product.id,
													"quantity",
													Number.parseInt(e.target.value)
												)
											}
											className="w-20"
										/>
										<Button
											type="button"
											variant="outline"
											size="icon"
											onClick={() => removeProduct(product.id)}
											disabled={products.length === 1}>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								))}

								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addProduct}
									className="flex items-center gap-1">
									<Plus className="h-4 w-4" />
									Tambah Produk
								</Button>
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
