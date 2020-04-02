import Cache from '../../lib/Redis';
import invalidateKeys from '../utils/invalidateKeys';

// eslint-disable-next-line no-unused-vars
export default async (req, _res, next) => {
  if (['PUT', 'POST', 'DELETE'].includes(req.method)) {
    const keys = invalidateKeys[req.entity]?.(
      req.method,
      req.userId,
      req.redisKey,
      req.public
    );
    if (keys) {
      keys.map(async ({ key, type }) => {
        if (type === 'MANY') {
          await Cache.invalidatePrefix(key);
        } else {
          await Cache.invalidate(key);
        }
      });
    }
  }
  next();
};
