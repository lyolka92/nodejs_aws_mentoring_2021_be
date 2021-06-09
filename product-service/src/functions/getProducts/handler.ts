import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import { ProductsDA } from "../../data-access/products.DA";

const getProducts: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async () => {
  const DA = new ProductsDA();
  const stones = await DA.getAllProducts();

  return formatJSONResponse({
    ...stones
  });
}

export const main = middyfy(getProducts);
