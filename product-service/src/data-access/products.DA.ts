import { getMockData } from "./utils/getMockData";
import { Product, Products } from "@models/Product";
import { HTTPError } from "@models/HTTPError";

export class ProductsDA {
  private readonly DB;

  constructor() {
    this.DB = getMockData();
  }

  public async getProductById(id: string): Promise<Product> {
    const product = this.DB.find((item) => item.id == id);

    if (product) {
      return Promise.resolve(product);
    } else {
      const error: HTTPError = new Error("Product not found");
      error.statusCode = 400;
      throw error;
    }
  }

  public async getAllProducts(): Promise<Products> {
    const products = { products: this.DB };
    return Promise.resolve(products);
  }
}
