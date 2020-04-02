import Cache from '../../lib/Redis';

// eslint-disable-next-line no-unused-vars
export default async (req, _res, next) => {
  if (req.method === 'GET') {
    if (req.redisKey) {
      await Cache.set(req.redisKey, req.response);
    }
  }
  next();
};
