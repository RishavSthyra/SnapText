import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

//nothing much just an extra layer of error handling just in case

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // It is for like if someone dont have the env variable and the app is crashing
  // they should be able to know the error perfectly
 
  if (!url) { 
    throw new Error("UPSTASH_REDIS_REST_URL is missing, check your env")
  }
  
  if (!token) { 
    throw new Error("UPSTASH_REDIS_REST_TOKEN is missing, check your env")
  }

  return { url, token };
}

export function getRedis() {

  // this is called singleton/lazy initialzation
  // what is does it like if rediscleint is already present then dont create another one
  // just use the already active one
  
  if (redisClient) { 
    return redisClient;
  }

  const { url, token } = getRedisConfig();
  redisClient  = new Redis({url , token})

  return redisClient;
}
