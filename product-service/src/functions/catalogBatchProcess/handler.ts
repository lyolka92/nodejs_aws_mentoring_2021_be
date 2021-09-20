import "source-map-support/register";

import { middyfy } from "@libs/lambda";
import { SQSEvent } from "aws-lambda";
import { ProductsDA } from "../../data-access/products.DA";
import { logger } from "@libs/logger";
import { SNS } from "aws-sdk/clients/browser_default";
import { SQSEventMock } from "@libs/types";

export const catalogBatchProcess = async (event: SQSEvent | SQSEventMock) => {
  const sns = new SNS();

  event.Records.map(async ({ body }) => {
    try {
      const { count, ...productData } = JSON.parse(body);
      const DA = new ProductsDA();

      const product = await DA.addProduct(productData, count);
      const message = `Product ${product.title} is added to database`;
      logger.info(message);

      const result = await sns.publish({
        Subject: "New product",
        Message: message,
        TopicArn: process.env.CREATE_PRODUCT_SNS_ARN,
        MessageAttributes: {
          isExpensive: {
            DataType: "String",
            StringValue: `${product?.price > 100}`,
          },
        },
      });
      logger.info("Email is sent");

      return result;
    } catch (err) {
      logger.error(
        `Error while adding product to database: ${JSON.stringify(err)}`
      );
    }
  });
};

export const main = middyfy(catalogBatchProcess);
