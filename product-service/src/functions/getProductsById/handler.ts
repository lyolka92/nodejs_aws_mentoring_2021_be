import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import { ProductsDA } from "../../data-access/products.DA";

const getProductsById: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  const DA = new ProductsDA();
  const stone = await DA.getProductById(event.pathParameters.id);

  return formatJSONResponse({
    ...stone
  });
}

export const main = middyfy(getProductsById);
