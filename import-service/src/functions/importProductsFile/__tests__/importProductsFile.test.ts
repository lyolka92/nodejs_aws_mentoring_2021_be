import * as AWS from "aws-sdk-mock";
import { importProductsFile } from "../handler";
import { APIGatewayProxyEventMock } from "@libs/types";

beforeAll(() => {
  AWS.mock("S3", "getSignedUrlPromise", (_, __, callback) => {
    callback(null, null);
  });
});

afterAll(() => {
  AWS.restore("S3");
});

describe("Import products file", () => {
  it("should return 200", async () => {
    const event: APIGatewayProxyEventMock = {
      queryStringParameters: { name: "Test" },
    };

    const response = await importProductsFile(event);

    expect(response.statusCode).toBe(200);
  });

  it("should return 500 when the file name is not provided", async () => {
    const response = await importProductsFile({});

    expect(response.statusCode).toBe(500);
  });
});
