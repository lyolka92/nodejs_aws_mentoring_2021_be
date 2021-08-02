export interface HTTPError extends Error {
  statusCode?: number;
}
