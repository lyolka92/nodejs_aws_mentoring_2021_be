import { getProducts } from "../handler";

describe("GET products", () => {
  it("should return an array in body.products", async () => {
    const response = await getProducts();
    const { products } = JSON.parse(response.body);
    expect(Array.isArray(products)).toBe(true);
  });

  it("should return 200", async () => {
    const { statusCode } = await getProducts();
    expect(statusCode).toBe(200);
  });
});
