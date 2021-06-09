import type { AWS } from "@serverless/typescript";

import * as ErrorResponseSchema from "@models/ErrorResponseSchema.json";
import * as GetProductSchema from "@models/GetProductSchema.json";
import * as GetProductsSchema from "@models/GetProductsSchema.json";

import getProductsById from "@functions/getProductsById";
import getProducts from "@functions/getProducts";

const serverlessConfiguration: AWS = {
  service: "product-service",
  frameworkVersion: "2",
  custom: {
    documentation: {
      version: "1",
      title: "Product service API",
      description: "NodeJS in AWS mentoring product service API",
      models: [
        {
          name: "ErrorResponse",
          description: "An error response",
          contentType: "application/json",
          schema: ErrorResponseSchema,
        },
        {
          name: "GetProductResponse",
          description: "Get single product by id response",
          contentType: "application/json",
          schema: GetProductSchema,
        },
        {
          name: "GetProductsResponse",
          description: "Get all available products response",
          contentType: "application/json",
          schema: GetProductsSchema,
        },
      ],
    },
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack", "@conqa/serverless-openapi-documentation"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
    lambdaHashingVersion: "20201221",
  },
  functions: { getProductsById, getProducts },
};

module.exports = serverlessConfiguration;
