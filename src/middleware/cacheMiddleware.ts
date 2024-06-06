import { NextFunction, Request, Response } from "express";
import { redis } from "../cache/redis-cache";

export const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await redis.hgetall(process.env.GH_USERNAME!, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      if (!result || Object.keys(result).length == 0) {
        next();
      } else {
        res.status(200).json({
          from: "cache",
          data: result,
        });
      }
    }
  });
};
