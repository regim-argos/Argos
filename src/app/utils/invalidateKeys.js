export default {
  users: (method, userId) => {
    const keys = [];
    if (method === 'PUT' || method === 'DELETE')
      return keys.concat([{ key: `${userId}`, type: 'MANY' }]);

    return keys;
  },
  watchers: (method, userId, oneKey, adminRegisKey) => {
    const base = `${userId}:watchers`;
    let keys = [{ key: `${base}:all`, type: 'ONE' }];
    if (method === 'POST') return keys;
    if (method === 'PUT' || method === 'DELETE')
      keys = keys.concat([
        { key: oneKey, type: 'ONE' },
        { key: adminRegisKey, type: 'ONE' },
      ]);
    return keys;
  },
  change_status: (method, userId, oneKey, adminRegisKey) => {
    const base = `${userId}:watchers`;
    let keys = [{ key: `${base}:all`, type: 'ONE' }];
    if (method === 'PUT' || method === 'DELETE')
      keys = keys.concat([
        { key: oneKey, type: 'ONE' },
        { key: adminRegisKey, type: 'ONE' },
      ]);
    return keys;
  },
};
