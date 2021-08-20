import winston from "winston";

export const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: "import-service" },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
