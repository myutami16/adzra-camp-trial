"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export default function PurchaseFormClient() {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [products, setProducts] = useState("");
	const [notes, setNotes] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Format the message for WhatsApp
		const message = `
*FORM PEMBELIAN ADZRA CAMP*

Nama: ${name}
No. Telp: ${phone}
Alamat: ${address}

Produk yang ingin dibeli:
${products}

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

							<div>
								<Label htmlFor="products">Produk yang ingin dibeli</Label>
								<Textarea
									id="products"
									value={products}
									onChange={(e) => setProducts(e.target.value)}
									placeholder="Contoh: Tenda Dome 4 orang - 1 buah, Sleeping Bag - 2 buah"
									rows={4}
									required
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
