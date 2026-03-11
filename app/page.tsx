"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Product = {
  NAMAPRODUK: string;
  KodeProduk: string;
  hargajual1: string;
  isstokkosong: number;
  isgangguan: number;
};

export default function ProdukPage() {
  const [data, setData] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/data");
      const json = await res.json();
      setData(json);
    }

    loadData();
  }, []);

  const filtered = data.filter(
    (item) =>
      item.NAMAPRODUK.toLowerCase().includes(search.toLowerCase()) ||
      item.KodeProduk.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4">Daftar Produk</h1>

      <div className="mb-6">
        <Input
          placeholder="Cari nama produk atau kode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Mobile-friendly responsive table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-left font-medium text-gray-700 tracking-wider w-5/12 sm:w-auto"
              >
                Produk
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left font-medium text-gray-700 tracking-wider hidden sm:table-cell"
              >
                Kode
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right font-medium text-gray-700 tracking-wider w-4/12 sm:w-auto"
              >
                Harga
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center font-medium text-gray-700 tracking-wider w-3/12 sm:w-28"
              >
                Status
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-gray-500">
                  Tidak ada produk ditemukan
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => {
                const harga = Number(item.hargajual1).toLocaleString("id-ID");

                const isGangguan = item.isgangguan === 1;
                const stokKosong = item.isstokkosong === 1;

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    {/* Produk name + code (stacked on mobile) */}
                    <td className="px-3 py-3">
                      <div className="font-medium text-gray-900">
                        {item.NAMAPRODUK}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 sm:hidden">
                        {item.KodeProduk}
                      </div>
                    </td>

                    {/* Kode - hidden on very small screens */}
                    <td className="px-3 py-3 text-gray-600 hidden sm:table-cell">
                      {item.KodeProduk}
                    </td>

                    {/* Harga */}
                    <td className="px-3 py-3 text-right font-medium">
                      Rp {harga}
                    </td>

                    {/* Status badge */}
                    <td className="px-3 py-3 text-center">
                      {isGangguan ? (
                        <Badge variant="destructive" className="text-xs">
                          Gangguan
                        </Badge>
                      ) : stokKosong ? (
                        <Badge variant="secondary" className="text-xs">
                          Stok Habis
                        </Badge>
                      ) : (
                        <Badge className="bg-green-600 hover:bg-green-600 text-xs">
                          Normal
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Optional: show count */}
      <div className="mt-4 text-sm text-gray-500 text-center sm:text-left">
        Menampilkan {filtered.length} produk
      </div>
    </div>
  );
}
