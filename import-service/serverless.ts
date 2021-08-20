import type { AWS } from "@serverless/typescript";

import importProductsFile from "@functions/importProductsFile";
import importFileParser from "@functions/importFileParser";
import { BUCKET_ARN, BUCKET_NAME } from "./consts";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack"],
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
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "s3:ListBucket",
            Resource: [BUCKET_ARN],
          },
          {
            Effect: "Allow",
            Action: "s3:*",
            Resource: [`${BUCKET_ARN}/*`],
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      WebAppS3Bucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: BUCKET_NAME,
          AccessControl: "PublicRead",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedMethods: ["GET", "PUT"],
                AllowedOrigins: ["*"],
                AllowedHeaders: ["*"],
                ExposedHeaders: [],
              },
            ],
          },
        },
      },
      WebAppS3BucketPolicy: {
        Type: "AWS::S3::BucketPolicy",
        Properties: {
          Bucket: {
            Ref: "WebAppS3Bucket",
          },
          PolicyDocument: {
            Statement: [
              {
                Sid: "AllowPublicRead",
                Effect: "Allow",
                Principal: { AWS: "*" },
                Action: "s3:GetObject",
                Resource: `${BUCKET_ARN}/*`,
              },
            ],
          },
        },
      },
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
