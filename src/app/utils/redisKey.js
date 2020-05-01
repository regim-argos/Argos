const dictionary = {
  // watchers: (params, { search }, userId, userRole) => {
  //   const base = `${userRole === 'ADMIN' ? 'admin' : userId}:watchers`;
  //   if (params[0]) return `${base}:${params[0]}`;
  //   if (!search) return `${base}:all`;
  //   return undefined;
  // },
  // change_status: (params, { search }, userId, userRole) => {
  //   const base = `${userRole === 'ADMIN' ? 'admin' : userId}:watchers`;
  //   if (params[0]) return `${base}:${params[0]}`;
  //   if (!search) return `${base}:all`;
  //   return undefined;
  // },
};
/**
 * @param {import("express").Request} req
 */
export default function getRedisKey(req, entity, paths, role) {
  const { query, userId, userRole } = req;
  if (dictionary[entity]) {
    const entityKey = dictionary[entity](
      paths,
      query,
      userId,
      role || userRole
    );
    return entityKey;
  }
  return false;
}
