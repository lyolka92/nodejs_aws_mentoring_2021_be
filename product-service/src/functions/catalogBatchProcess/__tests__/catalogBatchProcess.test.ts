import { catalogBatchProcess } from "../handler";
import { ProductsDA } from "../../../data-access/products.DA";
import { SNS } from "aws-sdk/clients/browser_default";

jest.mock("../../../data-access/products.DA", () => {
  const mockAddProduct = jest
    .fn()
    .mockImplementation(async (product, count) => {
      return await new Promise((resolve) => resolve({ ...product, count }));
    });

  return {
    ProductsDA: jest.fn().mockImplementation(() => {
      return { addProduct: mockAddProduct };
    }),
  };
});

jest.mock("aws-sdk/clients/browser_default", () => {
  return {
    SNS: jest.fn().mockImplementation(() => ({
      publish: jest.fn().mockReturnThis(),
      promise: jest.fn(),
    })),
  };
});

describe("catalogBatchProcess", () => {
  const PRODUCT = {
    title: "Test",
    description: "Test description",
    src: "https://test.com",
    price: 10,
    count: 10,
  };

  const EVENT = {
    Records: [
      {
        body: JSON.stringify(PRODUCT),
      },
    ],
  };

  it("should call ProductsDA", async () => {
    await catalogBatchProcess(EVENT);

    expect(ProductsDA).toHaveBeenCalled();
  });

  it("should call SNS", async () => {
    await catalogBatchProcess(EVENT);

    expect(SNS).toHaveBeenCalled();
  });
});
