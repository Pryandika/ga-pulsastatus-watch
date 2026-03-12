import ProductListClient from "./ProductListClient";
import { OperatorGroup } from "./types";

export const revalidate = 300;

export default async function ProdukPage() {
  const res = await fetch("https://api.gunaarthapulsa.com/data", {
    headers: {
      "x-api-key": "LaFvdfXAZdM2XPn0vPUrD1RLdpcpWHj1",
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    // TODO In production: better to use error.tsx boundary
    throw new Error("Gagal memuat data produk");
  }

  const initialData: OperatorGroup[] = await res.json();

  return <ProductListClient initialData={initialData} />;
}
