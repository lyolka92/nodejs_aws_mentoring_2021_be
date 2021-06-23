import "source-map-support/register";

import { formatJSONResponse, logRequest } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { ProductsDA } from "../../data-access/products.DA";

export const getProducts = async (event) => {
  logRequest(event);

  try {
    const products = await ProductsDA.getAllProducts();
    return formatJSONResponse({
      products,
    });
  } catch (err) {
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
