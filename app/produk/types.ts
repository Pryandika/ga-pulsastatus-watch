export type { Product, OperatorGroup, StatusInfo };
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

type StatusInfo = {
  variant: "destructive" | "secondary" | "default";
  label: string;
  className?: string;
};
