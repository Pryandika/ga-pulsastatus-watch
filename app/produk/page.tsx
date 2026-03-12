import ProductListClient from "./ProductListClient";
import { OperatorGroup } from "./types";

export const revalidate = 300;

export default async function ProdukPage() {
  const res = await fetch("https://gunaarthapulsa.com/api/data", {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    // In production: better to use error.tsx boundary
    // For dev: you can throw or return fallback UI
    throw new Error("Gagal memuat data produk");
  }

  const initialData: OperatorGroup[] = await res.json();

  return <ProductListClient initialData={initialData} />;
}
