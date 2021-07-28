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

import { SNS_TOPIC_LOCAL_NAME, SNS_TOPIC_NAME } from "./consts";

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
      CREATE_PRODUCT_SNS_ARN: {
        Ref: SNS_TOPIC_LOCAL_NAME,
      },
    },
    lambdaHashingVersion: "20201221",
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "sns:*",
            Resource: { Ref: SNS_TOPIC_LOCAL_NAME },
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      [SNS_TOPIC_LOCAL_NAME]: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: SNS_TOPIC_NAME,
        },
      },
      SNSSubscriptionExpensiveProducts: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "oserova-dev@yandex.ru",
          Protocol: "email",
          TopicArn: {
            Ref: SNS_TOPIC_LOCAL_NAME,
          },
          FilterPolicy: {
            isExpensive: ["true"],
          },
        },
      },
      SNSSubscriptionCheapProducts: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "oserovao@ya.ru",
          Protocol: "email",
          TopicArn: {
            Ref: SNS_TOPIC_LOCAL_NAME,
          },
          FilterPolicy: {
            isExpensive: ["false"],
          },
        },
      },
    },
  },
  functions: { addProducts, catalogBatchProcess, getProductsById, getProducts },
};

module.exports = serverlessConfiguration;
