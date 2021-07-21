import type { AWS } from "@serverless/typescript";
import dotenv from "dotenv";

import * as AddProductSchema from "@models/AddProductSchema.json";
import * as ErrorResponseSchema from "@models/ErrorResponseSchema.json";
import * as GetProductSchema from "@models/GetProductSchema.json";
import * as GetProductsSchema from "@models/GetProductsSchema.json";

import addProducts from "@functions/addProducts";
import catalogBatchProcess from "@functions/catalogBatchProcess";
import getProductsById from "@functions/getProductsById";
import getProducts from "@functions/getProducts";

dotenv.config();

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
          name: "AddProductRequest",
          description: "Add new product to DB request",
          contentType: "application/json",
          schema: AddProductSchema,
        },
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
      PG_HOST: process.env.PG_HOST,
      PG_PORT: process.env.PG_PORT,
      PG_DATABASE: process.env.PG_DATABASE,
      PG_USERNAME: process.env.PG_USERNAME,
      PG_PASSWORD: process.env.PG_PASSWORD,
    },
    lambdaHashingVersion: "20201221",
  },
  functions: { addProducts, catalogBatchProcess, getProductsById, getProducts },
};

module.exports = serverlessConfiguration;
