import { Http400 } from "./errors";
import { ErrorRequestHandler } from "express";
const http400Handler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof Http400) {
    return res.status(400).json({
      code: 400,
      reason: "Bad Request",
      message: err.message,
    });
  }
  return next(err);
};

export { http400Handler };
