import "source-map-support/register";

import { S3Event } from "aws-lambda/trigger/s3";
import * as AWS from "aws-sdk";
import dotenv from "dotenv";
import csv from "csv-parser";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { logger } from "@libs/logger";
import { BUCKET_NAME } from "../../../consts";

dotenv.config();

const importFileParser = async (event: S3Event) => {
  const s3 = new AWS.S3({ signatureVersion: "v4" });
  const sqs = new AWS.SQS();
  const FILE_NAME = event.Records[0].s3.object.key;

  const params: AWS.S3.Types.PutObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: FILE_NAME,
  };

  const moveFileToParsed = async () => {
    await s3
      .copyObject({
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${FILE_NAME}`,
        Key: FILE_NAME.replace("uploaded/", "parsed/"),
      })
      .promise();

    logger.info(`File ${FILE_NAME} is copied to /parsed folder`);

    await s3
      .deleteObject({
        Bucket: BUCKET_NAME,
        Key: FILE_NAME,
      })
      .promise();

    logger.info(`File ${FILE_NAME} is removed`);
  };

  try {
    s3.getObject(params)
      .createReadStream()
      .pipe(csv())
      .on("data", async (product) => {
        logger.info(`Sending product to the queue: ${JSON.stringify(product)}`);

        await sqs.sendMessage(
          {
            QueueUrl: process.env.CREATE_PRODUCT_SQS_URL,
            MessageBody: JSON.stringify(product),
          },
          (err, data) => {
            if (err) {
              logger.error(`Sending error: ${JSON.stringify(err)}`);
            } else {
              logger.info(
                `New product is sent to the queue: : ${JSON.stringify(data)}`
              );
            }
          }
        );
      })
      .on("end", await moveFileToParsed);
  } catch (err) {
    logger.error(`Parsing error: ${JSON.stringify(err)}`);
  }
};

export const main = middyfy(importFileParser);
