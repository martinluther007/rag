import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const handleValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((err: any) => err.message);
  const message = `Invalid input data ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err: any) => {
  const key = Object.keys(err.keyPattern)[0];
  const value = Object.values(err.keyValue).join(". ");

  const message = `Duplicate key value ${value} for key ${key}`;
  return new AppError(message, 400);
};

const handleInvalidId = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Fail";

  console.log(err);

  if (err.name === "ValidationError") err = handleValidationError(err);
  if (err.code === 11000) err = handleDuplicateFields(err);
  if (err.name === "CastError") err = handleInvalidId(err);
  res.status(err.statusCode).json({
    message: err.message,
    status: err.status,
  });
};

export default globalErrorHandler;
