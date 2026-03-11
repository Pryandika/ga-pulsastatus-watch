"use client";

import { useEffect, useState } from "react";

type Product = {
  NAMAPRODUK: string;
  KodeProduk: string;
  hargajual1: string;
  isstokkosong: number;
  isgangguan: number;
};

export default function DataPage() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/data");
      const json = await res.json();
      setData(json);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Produk</h1>

      <table border={1} cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Nama Produk</th>
            <th>Kode</th>
            <th>Harga</th>
            <th>Stok Kosong</th>
            <th>Gangguan</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.NAMAPRODUK}</td>
              <td>{row.KodeProduk}</td>
              <td>{Number(row.hargajual1).toLocaleString()}</td>
              <td>{row.isstokkosong ? "Ya" : "Tidak"}</td>
              <td>{row.isgangguan ? "Ya" : "Tidak"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
