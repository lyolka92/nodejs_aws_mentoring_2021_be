import { IProduct, TProductData } from "@models/IProduct";
import { HTTPError } from "@models/HTTPError";
import { Client, ClientConfig, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions: ClientConfig = {
  host: PG_HOST,
  port: Number(PG_PORT),
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  connectionTimeoutMillis: 15000,
};

class ProductsDA {
  private client: Client;

  private async connectToDB(): Promise<void> {
    this.client = new Client(dbOptions);
    await this.client.connect();
  }

  private async closeDBConnection(): Promise<void> {
    await this.client.end();
  }

  public async getProductById(id: string): Promise<IProduct> {
    await this.connectToDB();

    try {
      const query = `
        SELECT products.id, products.title, products.description, products.price, products.src, stocks.count
        FROM products, stocks
        WHERE products.id='${id}' AND products.id = stocks.product_id`;
      const result = await this.client.query(query);

      if (result.rows.length) {
        return result.rows[0];
      } else {
        ProductsDA.throwNotFound();
      }
    } catch (err) {
      throw err;
    } finally {
      await this.closeDBConnection();
    }
  }

  private static throwNotFound() {
    const error: HTTPError = new Error("Product not found");
    error.statusCode = 400;
    throw error;
  }

  public async getAllProducts(): Promise<IProduct[]> {
    await this.connectToDB();

    try {
      const query = `
        SELECT products.id, products.title, products.description, products.price, products.src, stocks.count
        FROM products, stocks
        WHERE products.id = stocks.product_id`;
      const result: QueryResult<IProduct> = await this.client.query(query);

      return result.rows;
    } catch (err) {
      console.log(err);
    } finally {
      await this.closeDBConnection();
    }
  }

  public async addProduct(
    productData: TProductData,
    amount: number
  ): Promise<IProduct> {
    await this.connectToDB();

    try {
      await this.client.query("BEGIN");
      const addProductQuery = `
         INSERT INTO products
         (TITLE, PRICE, SRC, DESCRIPTION)
         VALUES
         ('${productData.title}', '${productData.price}', '${productData.src}', '${productData.description}')
         RETURNING id, title, price, src, description;`;
      const addProductQueryResult = await this.client.query(addProductQuery);
      const {
        rows: [createdProduct],
      } = addProductQueryResult;

      console.log(`Product is created: ${JSON.stringify(createdProduct)}`);

      const addStocksQuery = `
         INSERT INTO stocks
         (PRODUCT_ID, COUNT)
         VALUES
         ('${createdProduct.id}', '${amount}')`;
      await this.client.query(addStocksQuery);

      console.log("Stock is added");

      await this.client.query("COMMIT");

      console.log("Data is committed to database");

      return {
        ...createdProduct,
        count: amount,
      };
    } catch (err) {
      await this.client.query("ROLLBACK");
      console.log(`Create product error: ${JSON.stringify(err)}`);
    } finally {
      await this.closeDBConnection();
    }
  }
}

const ProductsDAInstance = new ProductsDA();

export { ProductsDAInstance as ProductsDA };
