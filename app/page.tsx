"use client";

import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeCategory, setActiveCategory] = useState<
    "PULSA" | "DATA" | "PLN" | "LAINNYA"
  >("PULSA");
  const [activeBrand, setActiveBrand] = useState("SEMUA");

  // Helper: determine main category
  const getCategory = (
    operator: string,
  ): "PULSA" | "DATA" | "PLN" | "LAINNYA" => {
    const u = operator.toUpperCase().trim();

    // PLN
    if (u.includes("PLN")) return "PLN";

    // DATA — broad match for almost everything data-related
    if (
      u.includes("DATA") ||
      u.includes("BY U") ||
      u.includes("VOUCHER BALI") ||
      u.includes("AON") ||
      u.includes("HAPPY") ||
      u.includes("MINI") ||
      u.includes("UNLIMITED") ||
      u.includes("FLAZZ") ||
      u.includes("HARIAN") ||
      u.includes("NASIONAL") ||
      u.includes("OMNI") ||
      u.includes("REG") ||
      u.includes("BULK") ||
      u.includes("XTRA") ||
      u.includes("BEBAS PUAS") ||
      u.includes("FLEX MAX") ||
      u.includes("FREEDOM") ||
      u.includes("COMBO") ||
      u.includes("INET")
    ) {
      return "DATA";
    }

    // PULSA — credit, calls, transfer, masa aktif
    if (
      u.includes("PULSA") ||
      u.includes("NELPON") ||
      u.includes("TELPON") ||
      u.includes("TRANSFER PULSA") ||
      u.includes("MASA AKTIF")
    ) {
      return "PULSA";
    }

    // Everything else → LAINNYA
    return "LAINNYA";
  };

  const getBrand = (operator: string): string => {
    const words = operator.split(" ");
    return words[0].toUpperCase();
  };

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/data");
      const json = await res.json();
      setData(json);
    }
    loadData();
  }, []);

  // Reset brand when category changes
  useEffect(() => {
    setActiveBrand("SEMUA");
  }, [activeCategory]);

  // Get brands for current category
  const availableBrands = useMemo(() => {
    const groupsInCat = data.filter(
      (g) => getCategory(g.operator) === activeCategory,
    );
    const brandsSet = new Set(groupsInCat.map((g) => getBrand(g.operator)));
    return Array.from(brandsSet).sort();
  }, [data, activeCategory]);

  const subTabs = ["SEMUA", ...availableBrands];

  // Filter groups by category + brand
  const displayedGroups = data.filter((group) => {
    const cat = getCategory(group.operator);
    if (cat !== activeCategory) return false;

    const brand = getBrand(group.operator);
    if (activeBrand !== "SEMUA" && brand !== activeBrand) return false;

    return true;
  });

  // Apply search → remove empty groups after filtering
  const searchedGroups = displayedGroups
    .map((group) => ({
      ...group,
      products: group.products.filter(
        (item) =>
          item.nama.toLowerCase().includes(search.toLowerCase()) ||
          item.kode.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((group) => group.products.length > 0);

  const totalProducts = searchedGroups.reduce(
    (sum, g) => sum + g.products.length,
    0,
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

      {/* ==================== MAIN TABS ==================== */}
      <Tabs
        value={activeCategory}
        onValueChange={(value) =>
          setActiveCategory(value as "PULSA" | "DATA" | "PLN" | "LAINNYA")
        }
        className="mb-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="PULSA">PULSA</TabsTrigger>
          <TabsTrigger value="DATA">DATA</TabsTrigger>
          <TabsTrigger value="PLN">PLN</TabsTrigger>
          <TabsTrigger value="LAINNYA">LAINNYA</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ==================== SUB TABS (brands) ==================== */}
      {availableBrands.length > 0 && (
        <Tabs
          value={activeBrand}
          onValueChange={setActiveBrand}
          className="mb-6"
        >
          <TabsList className="flex flex-wrap gap-1">
            {subTabs.map((brand) => (
              <TabsTrigger key={brand} value={brand} className="text-sm">
                {brand}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* ==================== TABLE ==================== */}
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
            {searchedGroups.map((group) => (
              <React.Fragment key={group.idoperator}>
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

      <div className="mt-4 text-sm text-gray-500 text-center sm:text-left">
        Menampilkan {totalProducts} produk
      </div>
    </div>
  );
}
