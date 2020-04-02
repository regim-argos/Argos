const dictionary = {};
/**
 * @param {import("express").Request} req
 */
export default function getRedisKey(req, entity, paths) {
  if (dictionary[entity]) {
    const entityKey = dictionary[entity](paths, req.query, req.userId);
    return entityKey;
  }
  return false;
}
