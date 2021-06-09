export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  count: number;
  src: string;
}

export interface Products {
  products: Product[];
}
