import "source-map-support/register";

import { formatJSONResponse, logRequest } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { ProductsDA } from "../../data-access/products.DA";
import { logger } from "@libs/logger";

export const getProducts = async (event) => {
  logRequest(event);
  const DA = new ProductsDA();

  try {
    const products = await DA.getAllProducts();

    logger.info(`Get ${products.length} products from database`);

    return formatJSONResponse({
      products,
    });
  } catch (err) {
    logger.error(
      `Error while getting products from database: ${JSON.stringify(err)}`
    );

    return formatJSONResponse(
      {
        title: "GET /products error",
        detail: err.message,
      },
      err.statusCode || 500
    );
  }
};

export const main = middyfy(getProducts);
