"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { Send, Plus, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchProducts, type Product } from "@/lib/api";

interface ProductItem {
	id: string;
	name: string;
	quantity: number;
	price?: number;
	productId?: number;
}

export default function PurchaseFormClient() {
	const searchParams = useSearchParams();
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [products, setProducts] = useState<ProductItem[]>([]);
	const [notes, setNotes] = useState("");
	const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
	const [loadingProducts, setLoadingProducts] = useState(true);
	const [openCombobox, setOpenCombobox] = useState<string | null>(null);

	// Initialize products with pre-filled data from query params
	useEffect(() => {
		const productFromQuery = searchParams.get("produk");

		if (productFromQuery) {
			// Pre-fill with product from query string
			setProducts([
				{
					id: crypto.randomUUID(),
					name: decodeURIComponent(productFromQuery),
					quantity: 1,
				},
			]);
		} else {
			// Default empty product
			setProducts([{ id: crypto.randomUUID(), name: "", quantity: 1 }]);
		}
	}, [searchParams]);

	// Fetch products on component mount
	useEffect(() => {
		const loadProducts = async () => {
			try {
				setLoadingProducts(true);
				const response = await fetchProducts({
					limit: 1000, // Get all products
					isForSale: "true", // Only get sale products
				});
				setAvailableProducts(response.data.products);

				// Auto-match pre-filled product with available products to get price and productId
				const productFromQuery = searchParams.get("produk");
				if (productFromQuery && response.data.products.length > 0) {
					const decodedProductName = decodeURIComponent(productFromQuery);
					const matchedProduct = response.data.products.find(
						(p) => p.namaProduk === decodedProductName
					);

					if (matchedProduct) {
						setProducts((prev) =>
							prev.map((item, index) =>
								index === 0
									? {
											...item,
											name: matchedProduct.namaProduk,
											price: matchedProduct.harga,
											productId: matchedProduct.id,
									  }
									: item
							)
						);
					}
				}
			} catch (error) {
				console.error("Error loading products:", error);
			} finally {
				setLoadingProducts(false);
			}
		};

		loadProducts();
	}, [searchParams]);

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

	const selectProduct = (itemId: string, product: Product) => {
		setProducts(
			products.map((item) =>
				item.id === itemId
					? {
							...item,
							name: product.namaProduk,
							price: product.harga,
							productId: product.id,
					  }
					: item
			)
		);
		setOpenCombobox(null);
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

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
		}).format(price);
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
									<div key={product.id} className="flex gap-2 items-start">
										<div className="flex-1">
											<Popover
												open={openCombobox === product.id}
												onOpenChange={(open) =>
													setOpenCombobox(open ? product.id : null)
												}>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														role="combobox"
														aria-expanded={openCombobox === product.id}
														className="w-full justify-between">
														{product.name || "Pilih produk..."}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-full p-0">
													<Command>
														<CommandInput placeholder="Cari produk..." />
														<CommandEmpty>
															{loadingProducts
																? "Memuat produk..."
																: "Produk tidak ditemukan."}
														</CommandEmpty>
														<CommandGroup className="max-h-64 overflow-auto">
															{availableProducts.map((availableProduct) => (
																<CommandItem
																	key={availableProduct.id}
																	onSelect={() =>
																		selectProduct(product.id, availableProduct)
																	}
																	className="flex items-center justify-between">
																	<div className="flex items-center">
																		<Check
																			className={cn(
																				"mr-2 h-4 w-4",
																				product.productId ===
																					availableProduct.id
																					? "opacity-100"
																					: "opacity-0"
																			)}
																		/>
																		<span className="flex-1">
																			{availableProduct.namaProduk}
																		</span>
																	</div>
																	<span className="text-sm text-gray-500 ml-2">
																		{formatPrice(availableProduct.harga)}
																	</span>
																</CommandItem>
															))}
														</CommandGroup>
													</Command>
												</PopoverContent>
											</Popover>
											{product.price && (
												<div className="mt-1 text-sm text-green-600 font-medium">
													{formatPrice(product.price)}
												</div>
											)}
										</div>
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
							konfirmasi pembelian dan pembayaan.
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
