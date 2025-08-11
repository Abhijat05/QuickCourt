import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);
  
  // Default error status and message
  const status = 500;
  const message = "Something went wrong";
  
  return res.status(status).json({
    success: false,
    status,
    message: err.message || message,
    stack: process.env.NODE_ENV === "development" ? err.stack : {}
  });
};