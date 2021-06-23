import { handlerPath } from "@libs/handlerResolver";
import schema from "./schema";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "products",
        cors: true,
        request: {
          schema: {
            "application/json": schema,
          },
        },
        documentation: {
          summary: "Add product",
          description: "Adds product to DB and returns it",
          requestBody: {
            description: "Product data and its amount",
          },
          requestModels: {
            "application/json": "AddProductRequest",
          },
          methodResponses: [
            {
              statusCode: 200,
              responseBody: {
                description: "Added product",
              },
              responseModels: {
                "application/json": "GetProductResponse",
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
