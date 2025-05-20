import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Pricelist Rental - Adzra Camp",
  description: "Daftar harga sewa peralatan camping Adzra Camp",
}

export default function PricelistPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Pricelist Rental</h1>
          <p className="text-gray-600">Daftar harga sewa peralatan camping Adzra Camp</p>
        </div>

        <Tabs defaultValue="tenda" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tenda">Tenda & Flysheet</TabsTrigger>
            <TabsTrigger value="cooking">Cooking Set</TabsTrigger>
            <TabsTrigger value="carrier">Carrier & Sleeping</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>

          <TabsContent value="tenda" className="mt-6">
            <div className="rounded-lg overflow-hidden">
              <Image src="/images/pricelist1.jpg" alt="Pricelist Tenda" width={800} height={1000} className="w-full" />
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold">Tenda Camping dan Similiar</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Tenda Dome Kapasitas 4 Orang</span>
                  <span className="font-semibold">Rp. 40.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Tenda Dome Kapasitas 2 Orang</span>
                  <span className="font-semibold">Rp. 30.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Tenda Dome Melano Kap. 4-5 orang</span>
                  <span className="font-semibold">Rp. 60.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Lampu Tenda Baterai</span>
                  <span className="font-semibold">Rp. 10.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Lampu Tenda USB Charger</span>
                  <span className="font-semibold">Rp. 5.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Lampu Tumblr</span>
                  <span className="font-semibold">Rp. 10.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Matras</span>
                  <span className="font-semibold">Rp. 3.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Matras Allumunium</span>
                  <span className="font-semibold">Rp. 5.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Terpal 4 x 3 m</span>
                  <span className="font-semibold">Rp. 40.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Flysheet</span>
                  <span className="font-semibold">Rp. 15.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Tongkat Flysheet</span>
                  <span className="font-semibold">Rp. 10.000</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cooking" className="mt-6">
            <div className="rounded-lg overflow-hidden">
              <Image
                src="/images/pricelist2.jpg"
                alt="Pricelist Cooking"
                width={800}
                height={1000}
                className="w-full"
              />
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold">Cooking and Similar</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Cooking Set Besar</span>
                  <span className="font-semibold">Rp. 15.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Cooking Set Kecil</span>
                  <span className="font-semibold">Rp. 10.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Paket Teko dan Gelas</span>
                  <span className="font-semibold">Rp. 10.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Kompor</span>
                  <span className="font-semibold">Rp. 10.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Kompor Windproof</span>
                  <span className="font-semibold">Rp. 10.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Kompor Koper</span>
                  <span className="font-semibold">Rp. 20.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Grill Pan</span>
                  <span className="font-semibold">Rp. 15.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Paket Coffe Maker (Moka Pot, Grinder, Gelas 2 pcs)</span>
                  <span className="font-semibold">Rp. 20.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Paket Kompor Koper & Grill Pan</span>
                  <span className="font-semibold">Rp. 30.000</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="carrier" className="mt-6">
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold">Carrier and Similar</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Carrier 45L</span>
                  <span className="font-semibold">Rp. 15.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Carrier 60L</span>
                  <span className="font-semibold">Rp. 20.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Cover Bag</span>
                  <span className="font-semibold">Rp. 5.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Hydropack</span>
                  <span className="font-semibold">Rp. 15.000</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mt-8">Sleeping Kit</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Sleeping Bag</span>
                  <span className="font-semibold">Rp. 10.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Sleepingpad Pillow</span>
                  <span className="font-semibold">Rp. 20.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Lazy Bag</span>
                  <span className="font-semibold">Rp. 20.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Hammock</span>
                  <span className="font-semibold">Rp. 10.000</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accessories" className="mt-6">
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold">Summit Kit</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Trekking Pole</span>
                  <span className="font-semibold">Rp. 10.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Headlamp Baterai</span>
                  <span className="font-semibold">Rp. 10.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Headlamp USB Charger</span>
                  <span className="font-semibold">Rp. 5.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Senter</span>
                  <span className="font-semibold">Rp. 10.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Sarung Tangan</span>
                  <span className="font-semibold">Rp. 5.000</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mt-8">Chill Kit</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Kursi Lipat Mini</span>
                  <span className="font-semibold">Rp. 5.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Kursi Lipat Biasa</span>
                  <span className="font-semibold">Rp. 10.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Kursi Lipat Santai</span>
                  <span className="font-semibold">Rp. 20.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Meja Lipat Mini</span>
                  <span className="font-semibold">Rp. 5.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Meja Lipat Biasa</span>
                  <span className="font-semibold">Rp. 20.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Meja Lipat Panjang</span>
                  <span className="font-semibold">Rp. 30.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Stand Api Unggun</span>
                  <span className="font-semibold">Rp. 15.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Tripod</span>
                  <span className="font-semibold">Rp. 15.000</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 bg-primary-light/10 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Informasi Penting</h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Diskon:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>Penyewa yang sebelumnya pernah menyewa di Adzra Camp berhak diberikan diskon 10%</li>
                <li>Menyewa alat rental di atas Rp. 100.000,- diberikan diskon 10%</li>
                <li>Menyewa alat rental di atas Rp. 150.000,- diberikan diskon 20%</li>
                <li>
                  Apabila penyewa memenuhi lebih dari 1 kriteria diskon, maka diskon yang diberikan adalah diskon yang
                  paling besar
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Ketentuan Sewa:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>
                  Penyewa harus mengembalikan alat pada waktu yang telah ditentukan, yakni maksimal jam 22.00 WIB di
                  hari pengembalian
                </li>
                <li>
                  Jika penyewa tidak dapat mengembalikan alat pada waktu yang telah ditentukan, maka akan dikenakan
                  denda
                </li>
                <li>Keterlambatan pada esok hari pagi: Denda sebesar 50% dari harga sewa</li>
                <li>
                  Keterlambatan lebih dari hari yang ditentukan: Denda sebesar 1 kali total harga sewa (dihitung
                  menambah hari sewa)
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Denda Kerusakan:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>Kerusakan total (tidak dapat diperbaiki): Denda sebesar harga beli per item</li>
                <li>Kerusakan yang bisa diperbaiki: Denda sebesar 50% dari harga beli per item</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
