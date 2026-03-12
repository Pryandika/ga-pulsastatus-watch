export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">Selamat Datang</h1>
      <p className="text-xl mb-8">
        Cek daftar produk pulsa, paket data & token listrik
      </p>

      <a
        href="/produk"
        className="rounded-lg bg-blue-600 px-8 py-4 text-white text-lg font-medium hover:bg-blue-700"
      >
        Lihat Daftar Produk
      </a>
    </main>
  );
}
