import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing Upstash Redis environment variables. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your deployment environment."
    );
  }

  return { url, token };
}

export function getRedis() {
  if (redisClient) {
    return redisClient;
  }

  const { url, token } = getRedisConfig();
  redisClient = new Redis({ url, token });

  return redisClient;
}
