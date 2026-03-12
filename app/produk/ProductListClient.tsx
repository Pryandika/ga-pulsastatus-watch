"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

import { Product, OperatorGroup, StatusInfo } from "./types";

export function getCategory(
  operator: string,
): "PULSA" | "DATA" | "PLN" | "E-MONEY" | "LAINNYA" {
  const u = operator.toUpperCase().trim();

  if (u.includes("PLN")) return "PLN";

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

  if (
    u.includes("PULSA") ||
    u.includes("NELPON") ||
    u.includes("TELPON") ||
    u.includes("TRANSFER PULSA") ||
    u.includes("TRANSFER") ||
    u.includes("MASA AKTIF")
  ) {
    return "PULSA";
  }

  if (
    u.includes("DANA") ||
    u.includes("GOJEK") ||
    u.includes("OVO") ||
    u.includes("SHOPEE") ||
    u.includes("BRIZZI") ||
    u.includes("LINKAJA")
  ) {
    return "E-MONEY";
  }

  return "LAINNYA";
}

export function getBrand(operator: string): string {
  return operator.split(" ")[0]?.toUpperCase() ?? "UNKNOWN";
}

export function matchesSearch(product: Product, search: string): boolean {
  if (!search.trim()) return true;
  const term = search.toLowerCase();
  return (
    product.nama.toLowerCase().includes(term) ||
    product.kode.toLowerCase().includes(term)
  );
}

export function formatPrice(harga: number): string {
  return new Intl.NumberFormat("id-ID").format(harga);
}

export function getProductStatus(item: Product): StatusInfo {
  if (item.gangguan === 1) {
    return { variant: "destructive", label: "Gangguan" };
  }
  if (item.stokKosong === 1) {
    return { variant: "secondary", label: "Stok Habis" };
  }
  return { variant: "default", label: "Normal", className: "bg-green-600" };
}

const operatorPriority: Record<string, number> = {
  "INDOSAT PULSA": 100,
  "TELKOMSEL PULSA AS": 99,
  "TELKOMSEL PULSA SIMPATI": 98,
  "XL PULSA": 97,
  "AXIS PULSA": 96,
  "SMART PULSA": 95,
  "TRI PULSA": 94,
  // ...
};
const getPriority = (operator: string) => operatorPriority[operator] ?? 0;

export function getFilteredAndSearchedGroups(
  allGroups: OperatorGroup[],
  category: "PULSA" | "DATA" | "PLN" | "E-MONEY" | "LAINNYA",
  brand: string,
  search: string,
): OperatorGroup[] {
  let groups = allGroups.filter((g) => getCategory(g.operator) === category);

  if (brand !== "SEMUA") {
    groups = groups.filter((g) => getBrand(g.operator) === brand);
  }

  groups.sort((a, b) => {
    const prioA = getPriority(a.operator);
    const prioB = getPriority(b.operator);

    if (prioA !== prioB) {
      return prioB - prioA;
    }

    return a.operator.localeCompare(b.operator);
  });

  return groups
    .map((group) => ({
      ...group,
      products: group.products.filter((p) => matchesSearch(p, search)),
    }))
    .filter((group) => group.products.length > 0);
}

export default function ProductListClient({
  initialData,
}: {
  initialData: OperatorGroup[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    "PULSA" | "DATA" | "PLN" | "E-MONEY" | "LAINNYA"
  >("PULSA");
  const [activeBrand, setActiveBrand] = useState("SEMUA");

  const [data] = useState(initialData);

  const headerRef = useRef<HTMLTableSectionElement>(null);
  const [headerHeight, setHeaderHeight] = useState(48);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [data]);

  useEffect(() => {
    setActiveBrand("SEMUA");
  }, [activeCategory]);

  const availableBrands = useMemo(() => {
    const groupsInCat = data.filter(
      (g) => getCategory(g.operator) === activeCategory,
    );
    const brandsSet = new Set(groupsInCat.map((g) => getBrand(g.operator)));
    return ["SEMUA", ...Array.from(brandsSet).sort()];
  }, [data, activeCategory]);

  const displayedGroups = useMemo(() => {
    return getFilteredAndSearchedGroups(
      data,
      activeCategory,
      activeBrand,
      search,
    );
  }, [data, activeCategory, activeBrand, search]);

  const totalProducts = useMemo(
    () => displayedGroups.reduce((sum, g) => sum + g.products.length, 0),
    [displayedGroups],
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

      <Tabs
        value={activeCategory}
        onValueChange={(value) =>
          setActiveCategory(
            value as "PULSA" | "DATA" | "PLN" | "E-MONEY" | "LAINNYA",
          )
        }
        className="mb-4"
      >
        <TabsList className="grid w-full grid-cols-5 gap-1.5 justify-start bg-transparent h-auto min-h-0 p-0">
          <TabsTrigger
            value="PULSA"
            className={`inline-flex items-center justify-center rounded-full bg-muted/70 hover:bg-muted px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow whitespace-nowrap`}
          >
            PULSA
          </TabsTrigger>
          <TabsTrigger
            value="DATA"
            className={`inline-flex items-center justify-center rounded-full bg-muted/70 hover:bg-muted px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow whitespace-nowrap`}
          >
            DATA
          </TabsTrigger>
          <TabsTrigger
            value="PLN"
            className={`inline-flex items-center justify-center rounded-full bg-muted/70 hover:bg-muted px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow whitespace-nowrap`}
          >
            PLN
          </TabsTrigger>
          <TabsTrigger
            value="E-MONEY"
            className={`inline-flex items-center justify-center rounded-full bg-muted/70 hover:bg-muted px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow whitespace-nowrap`}
          >
            E-MONEY
          </TabsTrigger>
          <TabsTrigger
            value="LAINNYA"
            className={`inline-flex items-center justify-center rounded-full bg-muted/70 hover:bg-muted px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow whitespace-nowrap`}
          >
            LAINNYA
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {availableBrands.length > 0 && (
        <>
          <div className="mb-8 pb-2 min-h-[44px]">
            <Tabs
              value={activeBrand}
              onValueChange={setActiveBrand}
              className="w-full"
            >
              <TabsList className="flex flex-wrap gap-1.5 justify-start bg-transparent h-auto min-h-0 p-0">
                {availableBrands.map((brand) => (
                  <TabsTrigger
                    key={brand}
                    value={brand}
                    className={`inline-flex items-center justify-center rounded-full bg-muted/70 hover:bg-muted px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow whitespace-nowrap`}
                  >
                    {brand}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="h-15 sm:h-0 mb-2" />
        </>
      )}

      <div className="overflow-auto rounded-lg border border-gray-200 max-h-[70vh] md:max-h-[75vh]">
        <table className="min-w-full divide-y divide-gray-200 text-sm table-fixed w-full">
          <thead ref={headerRef} className="bg-gray-50 sticky top-0 z-20">
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
            {displayedGroups.map((group) => (
              <React.Fragment key={group.idoperator}>
                <tr className="bg-gray-200">
                  <td
                    colSpan={4}
                    className="group-title px-3 py-2 font-semibold text-gray-700 bg-gray-100 sticky z-10"
                    style={{ top: `${headerHeight - 2}px` }}
                  >
                    {group.operator}
                  </td>
                </tr>

                {group.products.map((item) => {
                  const harga = formatPrice(Number(item.harga));

                  const status = getProductStatus(item);

                  return (
                    <tr key={item.kode} className="hover:bg-gray-50">
                      <td className="px-3 py-3">
                        <div className="flex flex-col">
                          <div className="text-xs text-gray-900 mt-0.5 sm:hidden order-1 sm:order-2">
                            {item.kode}
                          </div>
                          <div className="font-medium text-gray-900 order-2 sm:order-1">
                            {item.nama}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-900 hidden sm:table-cell">
                        {item.kode}
                      </td>
                      <td className="px-3 py-3 text-right font-medium">
                        Rp {harga}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Badge
                          variant={status.variant}
                          className={`text-xs ${status.className || ""}`}
                        >
                          {status.label}
                        </Badge>
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
