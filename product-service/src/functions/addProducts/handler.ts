import "source-map-support/register";

import {
  formatJSONResponse,
  logRequest,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import { ProductsDA } from "../../data-access/products.DA";
import { logger } from "@libs/logger";

export const addProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async (event) => {
    logRequest(event);
    const DA = new ProductsDA();

    try {
      const product = await DA.addProduct(
        event.body.product,
        event.body.amount
      );

      logger.info(`Product ${product.title} is added to database`);

      return formatJSONResponse({
        ...product,
      });
    } catch (err) {
      logger.error(
        `Error while adding product to database: ${JSON.stringify(err)}`
      );

      return formatJSONResponse(
        {
          title: "POST /products error",
          detail: err.message,
        },
        err.statusCode || 500
      );
    }
  };

export const main = middyfy(addProducts);
