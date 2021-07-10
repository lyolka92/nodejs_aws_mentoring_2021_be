import "source-map-support/register";

import { S3Event } from "aws-lambda/trigger/s3";
import * as AWS from "aws-sdk";
import { S3 } from "aws-sdk/clients/browser_default";
import * as csv from "csv-parser";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

const BUCKET = "stone-shop-import-service";

const importFileParser = async (event: S3Event) => {
  const s3 = new AWS.S3({ signatureVersion: "v4" });

  const params: S3.Types.PutObjectRequest = {
    Bucket: BUCKET,
    Key: event.Records[0].s3.object.key,
  };

  const moveFileToParsed = async () => {
    await s3
      .copyObject({
        Bucket: BUCKET,
        CopySource: BUCKET + "/" + event.Records[0].s3.object.key,
        Key: event.Records[0].s3.object.key.replace("uploaded", "parsed"),
      })
      .promise();

    await s3
      .deleteObject({
        Bucket: BUCKET,
        Key: event.Records[0].s3.object.key,
      })
      .promise();
  };

  try {
    const s3ReadStream = s3.getObject(params).createReadStream();

    s3ReadStream
      .pipe(csv())
      .on("data", (data) => console.log(data))
      .on("end", await moveFileToParsed);

    return formatJSONResponse({ success: true });
  } catch (err) {
    return formatJSONResponse(err.message, 500);
  }
};

export const main = middyfy(importFileParser);
