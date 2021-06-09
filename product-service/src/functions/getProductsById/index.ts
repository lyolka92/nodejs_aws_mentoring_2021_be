import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products/{id}",
        documentation: {
          summary: "Get products",
          description: "Returns single product by it's id",
          pathParams: [
            {
              name: "id",
              description: "Unique product's id",
              schema: { type: "string" },
            },
          ],
          methodResponses: [
            {
              statusCode: 200,
              responseBody: {
                description: "An object with the found product data",
              },
              responseModels: {
                "application/json": "GetProductResponse",
              },
            },
            {
              statusCode: 500,
              responseBody: {
                description: "An error message when getting a product",
              },
              responseModels: {
                "application/json": "ErrorResponse",
              },
            },
          ],
        },
      },
    },
  ],
};
