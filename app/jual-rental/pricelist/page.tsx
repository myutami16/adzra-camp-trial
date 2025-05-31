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
          <TabsList className="grid w-full grid-cols-2 gap-2">
            <TabsTrigger
              value="tenda"
              className="text-center px-2 py-2 text-sm md:text-base">Tenda & Flysheet</TabsTrigger>
            <TabsTrigger
              value="cooking"
              className="text-center px-2 py-2 text-sm md:text-base"
            >
              Cooking Set
            </TabsTrigger>
          </TabsList>

    

          <TabsContent value="tenda" className="mt-6">
            <div className="rounded-lg overflow-hidden">
              <Image src="/images/pricelist1.jpg" alt="Pricelist Tenda" width={800} height={1000} className="w-full" />
            
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
