import 'source-map-support/register';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";

const getProduct: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  return formatJSONResponse({
    id: event.pathParameters.id,
    name: "Violet rocks",
    price: 14.99
  });
}

export const main = middyfy(getProduct);
