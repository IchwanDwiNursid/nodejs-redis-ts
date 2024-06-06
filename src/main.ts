import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { Request, Response } from "express";
import { redis } from "./cache/redis-cache";
import { cacheMiddleware } from "./middleware/cacheMiddleware";
dotenv.config();

const portAPP = process.env.APP_PORT || 3000;

const app = express();

app.get("/data", cacheMiddleware, async (req: Request, res: Response) => {
  let result = "";

  try {
    const response = await axios.get(
      `https://api.github.com/users/${process.env.GH_USERNAME}`
    );
    result = response.data;
  } catch (err) {
    return res.status(500).send(err);
  }

  //---------Store In Redis----------
  redis.hmset(process.env.GH_USERNAME!, result, (err: any, reply: any) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      redis.expire(process.env.GH_USERNAME!, 30);
    }
  });

  res.status(200).json({
    from: "api",
    data: result,
  });
});

app.listen(portAPP, () => {
  console.log(`Example app listening at http://localhost:${portAPP}`);
});
