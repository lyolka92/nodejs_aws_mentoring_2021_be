export default {
  type: "object",
  properties: {
    product: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        price: { type: "number" },
        src: { type: "string" },
      },
      required: ["title", "description", "price", "src"],
    },
    amount: { type: "number" },
  },
  required: ["product", "amount"],
} as const;
