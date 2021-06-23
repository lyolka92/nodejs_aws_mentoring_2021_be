export interface IProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  count: number;
  src: string;
}

export type TProductData = Omit<IProduct, "id" | "count">;
