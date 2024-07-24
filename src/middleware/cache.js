import client from '../config/redis.js';

const cacheMiddleware = async (req, res, next) => {
  const key = req.originalUrl;

  try {
    const cacheData = await client.get(key);

    if (cacheData) {
      console.log('cache hit')
      return res.send(JSON.parse(cacheData));
    }

    next();
  } catch (err) {
    console.error('Cache error:', err);
    next();
  }
};

export default cacheMiddleware;