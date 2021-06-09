import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products",
        documentation: {
          summary: "Get products",
          description: "Returns all available products",
          methodResponses: [
            {
              statusCode: 200,
              responseBody: {
                description: "An array of all available products objects",
              },
              responseModels: {
                "application/json": "GetProductsResponse",
              },
            },
            {
              statusCode: 500,
              responseBody: {
                description: "An error message when getting all products",
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
