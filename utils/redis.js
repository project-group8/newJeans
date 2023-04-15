const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
// const redisClient = createClient({
//     socket: {
//       host: process.env.REDIS_HOST,
//       port: process.env.REDIS_PORT 
//     }
//   });
//   redisClient.connect()
//   redisClient.ping()
module.exports = redisClient