import Cache from '../../lib/Redis';
import getRedisKey from '../utils/redisKey';
import getEntity from '../utils/getEntity';

export default async (req, res, next) => {
  const { entity, paths } = getEntity(req);
  const redisKey = getRedisKey(req, entity, paths);
  req.entity = entity;
  req.redisKey = redisKey;
  if (req.method === 'GET') {
    if (redisKey) {
      const cached = await Cache.get(redisKey);

      if (cached && process.env.NODE_ENV !== 'test') return res.json(cached);
    }
  }

  return next();
};
