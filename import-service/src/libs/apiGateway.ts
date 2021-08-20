export const logRequest = (event): void => {
  const { httpMethod, resource, queryStringParameters, pathParameters, body } =
    event;

  console.log(
    httpMethod,
    resource,
    JSON.stringify({
      queryStringParameters,
      pathParameters,
      body,
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
