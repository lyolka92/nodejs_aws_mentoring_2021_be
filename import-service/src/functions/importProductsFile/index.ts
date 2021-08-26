import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
        authorizer: {
          name: "basicAuthorizer",
          arn: "arn:aws:lambda:eu-west-1:662624365868:function:authorization-service-dev-basicAuthorizer",
          resultTtlInSeconds: 0,
          identitySource: "method.request.header.Authorization",
          type: "token",
        },
      },
    },
  ],
};
