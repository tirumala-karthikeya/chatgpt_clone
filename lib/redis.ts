import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

// Connect to Redis
export async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}

// Cache helper functions
export async function setCache(key: string, value: any, ttl: number = 3600) {
  const redis = await connectRedis();
  await redis.setEx(key, ttl, JSON.stringify(value));
}

export async function getCache(key: string) {
  const redis = await connectRedis();
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
}

export async function deleteCache(key: string) {
  const redis = await connectRedis();
  await redis.del(key);
}

// Queue helper functions
export async function addToQueue(queueName: string, data: any) {
  const redis = await connectRedis();
  await redis.lPush(queueName, JSON.stringify(data));
}

export async function processQueue(queueName: string) {
  const redis = await connectRedis();
  const data = await redis.rPop(queueName);
  return data ? JSON.parse(data) : null;
}

export default client;
