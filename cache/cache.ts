require("dotenv").config()
import { Redis, RedisConfigNodejs } from "@upstash/redis"

let REDIS_INSTANCE: Redis;

const getRedisInstance = () => {
  if (REDIS_INSTANCE) {
    return REDIS_INSTANCE;
  }

  REDIS_INSTANCE = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  } as RedisConfigNodejs);

  return REDIS_INSTANCE;
}

export {
  getRedisInstance
}