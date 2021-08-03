export class BaseError extends Error {
  private readonly statusCode: number;

  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }

  getDetails(title?) {
    return {
      body: {
        detail: this.message,
        ...(title && title),
      },
      statusCode: this.statusCode,
    };
  }
}
