import Image from "next/image"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export const metadata = {
  title: "Tentang Kami - Adzra Camp",
  description: "Tentang Adzra Camp - Penyedia peralatan camping berkualitas di Mojokerto",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Tentang Kami</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Adzra Camp adalah penyedia peralatan camping berkualitas untuk sewa dan jual di Mojokerto, Jawa Timur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image src="/images/logo.png" alt="Adzra Camp Logo" fill className="object-contain" />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Sejarah Kami</h2>
            <p className="text-gray-600">
              Adzra Camp didirikan dengan tujuan untuk menyediakan peralatan camping berkualitas dengan harga terjangkau
              bagi para pecinta kegiatan outdoor di Mojokerto dan sekitarnya.
            </p>
            <p className="text-gray-600">
              Berawal dari hobi dan passion di bidang outdoor, kami memahami pentingnya peralatan yang baik dan terawat
              untuk kenyamanan dan keamanan dalam kegiatan camping.
            </p>
            <p className="text-gray-600">
              Kami berkomitmen untuk terus meningkatkan kualitas layanan dan memperluas koleksi peralatan camping kami
              untuk memenuhi kebutuhan pelanggan.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Layanan Kami</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Persewaan Peralatan</h3>
              <p className="text-gray-600 mb-4">
                Kami menyediakan berbagai peralatan camping untuk disewa dengan harga terjangkau. Semua peralatan kami
                terawat dengan baik dan selalu diperiksa sebelum disewakan.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Tenda berbagai ukuran</li>
                <li>• Peralatan masak</li>
                <li>• Sleeping bag dan matras</li>
                <li>• Carrier dan tas</li>
                <li>• Peralatan pendukung lainnya</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Penjualan Peralatan</h3>
              <p className="text-gray-600 mb-4">
                Selain menyewakan, kami juga menjual berbagai peralatan camping berkualitas. Kami menyediakan
                produk-produk terbaik untuk kebutuhan outdoor Anda.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Tenda dan flysheet</li>
                <li>• Peralatan masak camping</li>
                <li>• Perlengkapan tidur outdoor</li>
                <li>• Tas dan carrier</li>
                <li>• Aksesoris camping</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Lokasi & Kontak</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary-dark shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Alamat</h3>
                  <p className="text-gray-600">
                    Sebelah bank BRI pasar pandan, masuk Gang ke barat, Njarum, Pandanarum, Kec. Pacet, Kabupaten
                    Mojokerto, Jawa Timur 61374
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary-dark shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Telepon</h3>
                  <p className="text-gray-600">081937681294 (Admin)</p>
                  <p className="text-gray-600">082142551758 (Ridho)</p>
                  <p className="text-gray-600">081233583059 (Siro)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary-dark shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Jam Operasional</h3>
                  <p className="text-gray-600">Senin - Minggu: 08.00 - 22.00 WIB</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary-dark shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">info@adzracamp.com</p>
                </div>
              </div>
            </div>

            <div className="h-[300px] rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.5690069099!2d112.5453!3d-7.6123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7874c1e9e4b3b3%3A0x3b3b7f5f5e5e5e5e!2sAdzra%20Camp!5e0!3m2!1sen!2sid!4v1621234567890!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
