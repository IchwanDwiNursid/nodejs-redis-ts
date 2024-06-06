import { Redis } from "ioredis";

const port: number = parseInt(process.env.REDIS_PORT || "6379", 10);
const db = parseInt(process.env.REDIS_DB || "2", 10);

export const redis = new Redis({
  host: process.env.REDIS_HOST as string,
  port: port,
  db: db,
});
