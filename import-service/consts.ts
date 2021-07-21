export const SERVICE_NAME = "import-service";
export const BUCKET_NAME = `stone-shop-${SERVICE_NAME}`;
export const BUCKET_ARN = `arn:aws:s3:::${BUCKET_NAME}`;
export const SQS_QUEUE_LOCAL_NAME = "SQSQueue";
export const SQS_QUEUE_NAME = "catalogItemsQueue";
export const SQS_QUEUE_URL =
  "https://sqs.eu-west-1.amazonaws.com/662624365868/catalogItemsQueue";
