import { IProduct, TProductData } from "@models/IProduct";
import { HTTPError } from "@models/HTTPError";
import {
  Client,
  ClientConfig,
  Pool,
  PoolClient,
  PoolConfig,
  QueryResult,
} from "pg";
import dotenv from "dotenv";

dotenv.config();

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions: ClientConfig | PoolConfig = {
  host: PG_HOST,
  port: Number(PG_PORT),
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  connectionTimeoutMillis: 15000,
};

class ProductsDA {
  private pool: Pool;
  private client: Client | PoolClient;

  private async connectToDBWithClient(): Promise<void> {
    this.client = new Client(dbOptions);
    await this.client.connect();
  }

  private async connectToDBWithPool(): Promise<void> {
    this.pool = new Pool(dbOptions);
    this.client = await this.pool.connect();
  }

  private async closeDBConnection(): Promise<void> {
    if (this.client instanceof Client) {
      await this.client.end();
    } else {
      this.client.release();
      await this.pool.end();
    }
  }

  public async getProductById(id: string): Promise<IProduct> {
    await this.connectToDBWithClient();

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
    await this.connectToDBWithClient();

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
    await this.connectToDBWithPool();

    try {
      await this.client.query("BEGIN");
      const addProductQuery = `
        INSERT INTO products
        (TITLE, PRICE, SRC, DESCRIPTION)
        VALUES
        ('${productData.title}', '${productData.price}', '${productData.src}', '${productData.description}')
        RETURNING id;`;
      const addProductQueryResult = await this.client.query(addProductQuery);
      const {
        rows: [createdProduct],
      } = addProductQueryResult;

      const addStocksQuery = `
        INSERT INTO stocks
        (PRODUCT_ID, COUNT)
        VALUES
        ('${createdProduct.id}', '${amount}')`;
      await this.client.query(addStocksQuery);

      await this.client.query("COMMIT");

      return await this.getProductById(createdProduct.id);
    } catch (err) {
      await this.client.query("ROLLBACK");
      console.log(err);
    } finally {
      await this.closeDBConnection();
    }
  }
}

const ProductsDAInstance = new ProductsDA();

export { ProductsDAInstance as ProductsDA };
