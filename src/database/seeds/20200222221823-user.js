const bcrypt = require('bcryptjs');

module.exports = {
  up: (QueryInterface) => {
    return QueryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Argos Admin',
          email: 'admin@argos.com',
          password_hash: bcrypt.hashSync(process.env.ADMIN_PASS || '123456', 8),
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          role: 'ADMIN',
        },
      ],
      {}
    );
  },

  down: () => {},
};
