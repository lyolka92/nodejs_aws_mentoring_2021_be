import "source-map-support/register";

import { middyfy } from "@libs/lambda";
import { SQSEvent } from "aws-lambda";
import { ProductsDA } from "../../data-access/products.DA";
import { logger } from "@libs/logger";

const catalogBatchProcess = async (event: SQSEvent) => {
  await event.Records.map(async ({ body }) => {
    try {
      const { count, ...productData } = JSON.parse(body);
      const DA = new ProductsDA();

      const product = await DA.addProduct(productData, count);

      logger.info(`Product ${product.title} is added to database`);
    } catch (err) {
      logger.error(
        `Error while adding product to database: ${JSON.stringify(err)}`
      );
    }
  });
};

export const main = middyfy(catalogBatchProcess);
