import "source-map-support/register";

import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { ProductsDA } from "../../data-access/products.DA";

export const getProducts = async () => {
  const DA = new ProductsDA();

  try {
    const products = await DA.getAllProducts();
    return formatJSONResponse({
      ...products,
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
