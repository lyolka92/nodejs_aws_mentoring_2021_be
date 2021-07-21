import "source-map-support/register";

import { formatJSONResponse, logRequest } from "@libs/apiGateway";
import { BaseError } from "@libs/baseError";
import { middyfy } from "@libs/lambda";
import { checkIsUUID } from "@libs/validator";
import { ProductsDA } from "../../data-access/products.DA";
import { logger } from "@libs/logger";

export const getProductsById = async (event) => {
  logRequest(event);

  const PRODUCT_ID = event.pathParameters.id;

  try {
    if (!checkIsUUID(PRODUCT_ID)) {
      throw new BaseError(
        `Invalid input syntax for UUID: ${event.pathParameters.id}`,
        400
      );
    }

    const product = await ProductsDA.getProductById(PRODUCT_ID);

    logger.info(`Product ${PRODUCT_ID} is got from database`);

    return formatJSONResponse({
      ...product,
    });
  } catch (err) {
    `Error while getting product ${PRODUCT_ID} from database: ${JSON.stringify(
      err
    )}`;

    return formatJSONResponse(
      {
        title: "GET /products/{id} error",
        detail: err.message,
      },
      err.statusCode || 500
    );
  }
};

export const main = middyfy(getProductsById);
