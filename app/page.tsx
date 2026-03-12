"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import React from "react";

type Product = {
  nama: string;
  kode: string;
  harga: number;
  stokKosong: number;
  gangguan: number;
};

type OperatorGroup = {
  operator: string;
  idoperator: number;
  products: Product[];
};

export default function ProdukPage() {
  const [data, setData] = useState<OperatorGroup[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/data");
      const json = await res.json();

      setData(json);
    }

    loadData();
  }, []);

  const filtered = data
    .map((group) => ({
      ...group,
      products: group.products.filter(
        (item) =>
          item.nama.toLowerCase().includes(search.toLowerCase()) ||
          item.kode.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((group) => group.products.length > 0);

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
            {filtered.map((group) => (
              <React.Fragment key={group.idoperator}>
                {/* Operator header */}
                <tr className="bg-gray-100">
                  <td
                    colSpan={4}
                    className="px-3 py-2 font-semibold text-gray-700"
                  >
                    {group.operator}
                  </td>
                </tr>

                {group.products.map((item) => {
                  const harga = Number(item.harga).toLocaleString("id-ID");

                  const isGangguan = item.gangguan === 1;
                  const stokKosong = item.stokKosong === 1;

                  return (
                    <tr key={item.kode} className="hover:bg-gray-50">
                      <td className="px-3 py-3">
                        <div className="font-medium text-gray-900">
                          {item.nama}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 sm:hidden">
                          {item.kode}
                        </div>
                      </td>

                      <td className="px-3 py-3 text-gray-600 hidden sm:table-cell">
                        {item.kode}
                      </td>

                      <td className="px-3 py-3 text-right font-medium">
                        Rp {harga}
                      </td>

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
                          <Badge className="bg-green-600 text-xs">Normal</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
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
