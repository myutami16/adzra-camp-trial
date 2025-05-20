export const metadata = {
  title: "Syarat & Ketentuan - Adzra Camp",
  description: "Syarat dan ketentuan persewaan peralatan camping Adzra Camp",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Syarat & Ketentuan</h1>
          <p className="text-gray-600">Syarat dan ketentuan persewaan peralatan camping Adzra Camp</p>
        </div>

        <div className="prose max-w-none">
          <h2>Standar Operasional Prosedur (SOP) Persewaan Alat-Alat Camping di ADZRA CAMP</h2>

          <h3>1. Penerimaan Permohonan Sewa</h3>
          <ol>
            <li>
              <strong>Pengajuan Permohonan sewa:</strong>
              <p>Penyewa mengajukan permohonan sewa melalui WhatsApp, atau langsung datang ke TKP Adzra Camp.</p>
              <p>
                Jika penyewa mengajukan permohonan sewa melalui WhatsApp untuk hari esoknya maka dimasukkan ke Google
                Calendar. Kemudian setting pengingat untuk 1 hari sebelumnya (agar dapat menyiapkan barang sewaan 1 hari
                sebelumnya).
              </p>
              <p>
                Jika penyewa langsung datang ke TKP Adzra Camp maka crew akan menuliskan permohonan sewa dalam nota.
                (Begitu pun juga dengan yang mengajukan permohonan sewa melalui WhatsApp dituliskan ke dalam nota ketika
                penyewa datang mengambil alat sewa)
              </p>
            </li>
            <li>
              <strong>Pengolahan Permohonan sewa:</strong>
              <p>Crew memeriksa ketersediaan alat sewa dan memastikan bahwa alat tersebut dalam kondisi baik.</p>
              <p>Crew menyiapkan/menyisihkan alat yang akan disewa.</p>
            </li>
            <li>
              <strong>Pencatatan alat:</strong>
              <p>Crew mencatat alat-alat yang akan disewa, dan memastikannya kembali kepada penyewa.</p>
              <p>
                Crew menanyakan akan menyewa untuk 1 (satu) hari atau lebih. jika lebih dari 1 hari maka total harga
                sewa dikalikan dengan hari sewa.
              </p>
            </li>
          </ol>

          <h3>2. Teknis Alur Pemberian Alat</h3>
          <ul>
            <li>Crew memperlihatkan kelengkapan alat yang disewakan kepada penyewa.</li>
            <li>
              Crew meminta kartu tanda pengenal penyewa sebagai jaminan. Kartu tanda pengenal yang dimaksud seperti:
              KTP, SIM, KTM, Kartu Pelajar, dan NPWP.
            </li>
            <li>Crew mengambil foto wajah penyewa dan nota sebagai bukti, lalu mengirimkannya ke grup WhatsApp.</li>
            <li>Crew menuliskan transaksi ke buku rental.</li>
          </ul>

          <h3>3. Pengembalian Alat Sewa</h3>
          <ol>
            <li>
              <strong>Pengembalian Alat:</strong>
              <p>
                Penyewa harus mengembalikan alat pada waktu yang telah ditentukan, yakni maksimal jam 22.00 WIB di hari
                pengembalian.
              </p>
              <p>
                Jika penyewa tidak dapat mengembalikan alat pada waktu yang telah ditentukan, maka penyewa harus
                membayar biaya keterlambatan.
              </p>
            </li>
            <li>
              <strong>Aturan Keterlambatan Pengembalian Alat:</strong>
              <p>
                Jika penyewa tidak dapat mengembalikan alat pada waktu yang telah ditentukan, maka akan dikenakan denda
                berdasarkan ketentuan berikut:
              </p>
              <ul>
                <li>Keterlambatan Pada Esok Hari Pagi: Denda sebesar 50% dari harga sewa.</li>
                <li>
                  Keterlambatan Lebih dari Hari yang Ditentukan: Denda sebesar 1 kali total harga sewa (dihitung
                  menambah hari sewa).
                </li>
              </ul>
            </li>
            <li>
              <strong>Pengecekan ketika kembali:</strong>
              <p>Ketika alat dikembalikan, crew akan melakukan pengecekan terhadap kondisi dan kelengkapan alat.</p>
              <p>Pengembalian kartu tanda pengenal:</p>
              <ul>
                <li>
                  Jika alat dikembalikan dalam kondisi baik, maka kartu tanda pengenal akan dikembalikan kepada penyewa.
                </li>
                <li>
                  Jika alat mengalami kerusakan, maka kartu tanda pengenal tidak akan dikembalikan dan penyewa harus
                  membayar denda kerusakan.
                </li>
              </ul>
            </li>
          </ol>

          <h3>4. Aturan Diskon</h3>
          <ul>
            <li>Penyewa yang sebelumnya pernah menyewa di Adzra Camp berhak diberikan diskon 10%.</li>
            <li>Menyewa alat rental di atas Rp. 100.000,- diberikan diskon 10%.</li>
            <li>Menyewa alat rental di atas Rp. 150.000,- diberikan diskon 20%.</li>
            <li>
              Apabila penyewa memenuhi lebih dari 1 (satu) kriteria diskon, maka diskon yang diberikan adalah diskon
              yang paling besar.
            </li>
          </ul>

          <h3>5. Denda Kerusakan Barang</h3>
          <p>
            Penyewa yang mengembalikan alat dalam kondisi rusak akan dikenakan denda berdasarkan tingkat kerusakan alat:
          </p>
          <ul>
            <li>Kerusakan Total (Tidak Dapat Diperbaiki): Denda sebesar harga beli per item.</li>
            <li>Kerusakan yang Bisa Diperbaiki: Denda sebesar 50% dari harga beli per item.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
