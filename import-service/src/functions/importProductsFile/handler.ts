import "source-map-support/register";

import { APIGatewayProxyEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
import { S3 } from "aws-sdk/clients/browser_default";
import { formatJSONResponse, logRequest } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEventMock } from "@libs/types";
import { BUCKET_NAME } from "../../../consts";

const CATALOG_NAME = "uploaded";

export const importProductsFile = async (
  event: APIGatewayProxyEvent | APIGatewayProxyEventMock
) => {
  logRequest(event);

  try {
    const s3 = new AWS.S3({ signatureVersion: "v4" });
    const params: S3.Types.PutObjectRequest = {
      Bucket: BUCKET_NAME,
      Key: `${CATALOG_NAME}/${event.queryStringParameters.name}`,
      ContentType: "text/csv",
    };
    const s3PutObjectUrl = await s3.getSignedUrlPromise("putObject", params);
    return formatJSONResponse(s3PutObjectUrl);
  } catch (err) {
    return formatJSONResponse(err.message, 500);
  }
};

export const main = middyfy(importProductsFile);
