"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
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
import {
	CalendarIcon,
	Plus,
	Trash2,
	Send,
	Check,
	ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { fetchProducts, type Product } from "@/lib/api";

interface RentalItem {
	id: string;
	name: string;
	quantity: number;
	price?: number;
	productId?: number;
}

export default function RentalFormClient() {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [date, setDate] = useState<Date>();
	const [duration, setDuration] = useState("");
	const [pickupTime, setPickupTime] = useState("");
	const [items, setItems] = useState<RentalItem[]>([
		{ id: crypto.randomUUID(), name: "", quantity: 1 },
	]);
	const [products, setProducts] = useState<Product[]>([]);
	const [loadingProducts, setLoadingProducts] = useState(true);
	const [openCombobox, setOpenCombobox] = useState<string | null>(null);

	// Fetch products on component mount
	useEffect(() => {
		const loadProducts = async () => {
			try {
				setLoadingProducts(true);
				const response = await fetchProducts({
					limit: 1000, // Get all products
					isForRent: "true", // Only get rental products
				});
				setProducts(response.data.products);
			} catch (error) {
				console.error("Error loading products:", error);
			} finally {
				setLoadingProducts(false);
			}
		};

		loadProducts();
	}, []);

	const addItem = () => {
		setItems([...items, { id: crypto.randomUUID(), name: "", quantity: 1 }]);
	};

	const removeItem = (id: string) => {
		if (items.length > 1) {
			setItems(items.filter((item) => item.id !== id));
		}
	};

	const updateItem = (
		id: string,
		field: keyof RentalItem,
		value: string | number
	) => {
		setItems(
			items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
		);
	};

	const selectProduct = (itemId: string, product: Product) => {
		setItems(
			items.map((item) =>
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

		// Format the message for WhatsApp
		const formattedDate = date
			? format(date, "dd MMMM yyyy", { locale: id })
			: "-";
		const itemsList = items
			.filter((item) => item.name.trim() !== "")
			.map((item) => `${item.name} x ${item.quantity}`)
			.join("\n");

		const message = `
*FORM BOOKING RENTAL ADZRA CAMP*

Nama: ${name}
No. Telp: ${phone}
Tanggal Sewa: ${formattedDate}
Lama Sewa: ${duration} hari
Waktu Pengambilan: ${pickupTime}

Barang yang disewa:
${itemsList}
    `.trim();

		// Encode the message for WhatsApp URL
		const encodedMessage = encodeURIComponent(message);

		// Open WhatsApp with the pre-filled message
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
					<h1 className="text-3xl font-bold mb-2">Form Persewaan</h1>
					<p className="text-gray-600">
						Isi form di bawah ini untuk menyewa peralatan camping dari Adzra
						Camp
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
					<div>
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
									<Label htmlFor="phone">No. Telp Penanggung Jawab</Label>
									<Input
										id="phone"
										type="tel"
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
										required
									/>
								</div>

								<div>
									<Label htmlFor="date">Tanggal Sewa</Label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal",
													!date && "text-muted-foreground"
												)}>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{date
													? format(date, "PPP", { locale: id })
													: "Pilih tanggal"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={date}
												onSelect={setDate}
												initialFocus
												locale={id}
											/>
										</PopoverContent>
									</Popover>
								</div>

								<div>
									<Label htmlFor="duration">Lama Sewa (hari)</Label>
									<Input
										id="duration"
										type="number"
										min="1"
										value={duration}
										onChange={(e) => setDuration(e.target.value)}
										required
									/>
								</div>

								<div>
									<Label htmlFor="pickupTime">Waktu Pengambilan</Label>
									<Input
										id="pickupTime"
										value={pickupTime}
										onChange={(e) => setPickupTime(e.target.value)}
										placeholder="Contoh: 10:00 WIB"
										required
									/>
								</div>

								<div className="space-y-3">
									<Label>Barang yang disewa</Label>

									{items.map((item, index) => (
										<div key={item.id} className="flex gap-2 items-start">
											<div className="flex-1">
												<Popover
													open={openCombobox === item.id}
													onOpenChange={(open) =>
														setOpenCombobox(open ? item.id : null)
													}>
													<PopoverTrigger asChild>
														<Button
															variant="outline"
															role="combobox"
															aria-expanded={openCombobox === item.id}
															className="w-full justify-between">
															{item.name || "Pilih barang..."}
															<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-full p-0">
														<Command>
															<CommandInput placeholder="Cari barang..." />
															<CommandEmpty>
																{loadingProducts
																	? "Memuat produk..."
																	: "Barang tidak ditemukan."}
															</CommandEmpty>
															<CommandGroup className="max-h-64 overflow-auto">
																{products.map((product) => (
																	<CommandItem
																		key={product.id}
																		onSelect={() =>
																			selectProduct(item.id, product)
																		}
																		className="flex items-center justify-between">
																		<div className="flex items-center">
																			<Check
																				className={cn(
																					"mr-2 h-4 w-4",
																					item.productId === product.id
																						? "opacity-100"
																						: "opacity-0"
																				)}
																			/>
																			<span className="flex-1">
																				{product.namaProduk}
																			</span>
																		</div>
																		<span className="text-sm text-gray-500 ml-2">
																			{formatPrice(product.harga)}/hari
																		</span>
																	</CommandItem>
																))}
															</CommandGroup>
														</Command>
													</PopoverContent>
												</Popover>
												{item.price && (
													<div className="mt-1 text-sm text-green-600 font-medium">
														{formatPrice(item.price)}/hari
													</div>
												)}
											</div>
											<Input
												type="number"
												min="1"
												value={item.quantity}
												onChange={(e) =>
													updateItem(
														item.id,
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
												onClick={() => removeItem(item.id)}
												disabled={items.length === 1}>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									))}

									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={addItem}
										className="flex items-center gap-1">
										<Plus className="h-4 w-4" />
										Tambah Barang
									</Button>
								</div>
							</div>

							<Button type="submit" className="w-full flex items-center gap-2">
								<Send className="h-4 w-4" />
								Kirim via WhatsApp
							</Button>
						</form>
					</div>

					<div className="space-y-6">
						<div className="bg-primary-light/10 p-4 rounded-lg">
							<h3 className="font-semibold mb-2">Catatan:</h3>
							<ul className="text-sm space-y-2">
								<li>• Form ini akan dikirim via WhatsApp</li>
								<li>• Sewa minimal 1 hari</li>
								<li>• Pembayaran dilakukan saat pengambilan barang</li>
								<li>• Diperlukan kartu identitas sebagai jaminan</li>
								<li>• Pengembalian maksimal jam 22.00 WIB</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
