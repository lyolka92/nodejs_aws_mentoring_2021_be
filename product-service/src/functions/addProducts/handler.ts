import "source-map-support/register";

import {
  formatJSONResponse,
  logRequest,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";
import { ProductsDA } from "../../data-access/products.DA";

export const addProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async (event) => {
    logRequest(event);

    try {
      const product = await ProductsDA.addProduct(
        event.body.product,
        event.body.amount
      );
      return formatJSONResponse({
        ...product,
      });
    } catch (err) {
      console.log(err);
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
