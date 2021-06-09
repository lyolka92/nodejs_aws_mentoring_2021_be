import { getMockData } from "./utils/getMockData";
import { Product } from "../models/Product";

export class ProductsDA {
    private readonly DB;

    constructor() {
        this.DB = getMockData();
    }

    public async getProductById(id: string): Promise<Product> {
        return Promise.resolve(this.DB.find(item => item.id === id))
    }

    public async getAllProducts(): Promise<Product[]> {
        return Promise.resolve(this.DB)
    }
}