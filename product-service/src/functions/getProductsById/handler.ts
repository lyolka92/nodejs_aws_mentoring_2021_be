import "source-map-support/register";

import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { ProductsDA } from "../../data-access/products.DA";

export const getProductsById = async (event) => {
  const DA = new ProductsDA();

  try {
    const product = await DA.getProductById(event.pathParameters.id);
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
