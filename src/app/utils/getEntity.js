const removeArray = ['v1', 'pvt', 'pub', ''];

/**
 * @param {import("express").Request} req
 */
export default function getEntity(req) {
  const { path } = req;

  const paths = path.split('/');

  const [entity, ...rest] = paths.filter(el => !removeArray.includes(el));

  return { entity, paths: rest };
}
