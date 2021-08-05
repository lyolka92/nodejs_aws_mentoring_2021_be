import { getProductsById } from "../handler";

describe("GET products/{id}", () => {
  it("should return product with correct id", async () => {
    const PRODUCT_ID = "8752f19a-0ab3-4114-bba7-5627e19d2f16";
    const EVENT = {
      pathParameters: {
        id: PRODUCT_ID,
      },
    };
    const response = await getProductsById(EVENT);
    const product = JSON.parse(response.body);

    expect(product).toMatchObject({
      id: PRODUCT_ID,
    });
  });

  it("should return 200 on request with existent product id", async () => {
    const PRODUCT_ID = "8752f19a-0ab3-4114-bba7-5627e19d2f16";
    const EVENT = {
      pathParameters: {
        id: PRODUCT_ID,
      },
    };
    const { statusCode } = await getProductsById(EVENT);

    expect(statusCode).toBe(200);
  });

  it("should return 400 on request with non-existent product id", async () => {
    const EVENT = {
      pathParameters: {
        id: "8752f19a-0ab3-4114-bba7-5627e19d2f10",
      },
    };
    const { statusCode } = await getProductsById(EVENT);

    expect(statusCode).toBe(400);
  });
});
