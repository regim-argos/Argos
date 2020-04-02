export default {
  users: (method, userId) => {
    const keys = [];
    if (method === 'PUT' || method === 'DELETE')
      return keys.concat([{ key: `${userId}`, type: 'MANY' }]);

    return keys;
  },
};
