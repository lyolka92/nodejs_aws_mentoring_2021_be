import { logger } from "@libs/logger";

export const logRequest = (event): void => {
  const { httpMethod, resource, queryStringParameters, pathParameters, body } =
    event;

  logger.info(
    JSON.stringify({
      httpMethod,
      resource,
      params: {
        queryStringParameters,
        pathParameters,
        body,
      },
    })
  );
};

export const formatJSONResponse = (
  response?: string | any,
  statusCode = 200
) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: typeof response === "string" ? response : JSON.stringify(response),
  };
};
