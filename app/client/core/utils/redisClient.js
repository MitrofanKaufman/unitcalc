// path: src/queue/redisClient.js
import { Redis } from 'ioredis';

export const connection = new Redis({
  host: '127.0.0.1', // или твой адрес Redis
  port: 6379,
});
