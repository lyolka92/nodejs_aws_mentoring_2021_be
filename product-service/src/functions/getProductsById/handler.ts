import "source-map-support/register";

import { formatJSONResponse, logRequest } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { ProductsDA } from "../../data-access/products.DA";

export const getProductsById = async (event) => {
  logRequest(event);

  try {
    const product = await ProductsDA.getProductById(event.pathParameters.id);
    return formatJSONResponse({
      ...product,
    });
  } catch (err) {
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
