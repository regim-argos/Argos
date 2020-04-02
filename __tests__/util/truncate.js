import bcrypt from 'bcryptjs';
import database from '../../src/database';

export default function truncate(confirmEmail = true) {
  return Promise.all([
    ...Object.keys(database.connection.models).map(key => {
      return database.connection.models[key].destroy({
        truncate: { cascade: true },
        force: true,
      });
    }),
    database.connection.models.User.bulkCreate([
      {
        name: 'Argos Admin',
        email: 'admin@argos.com',
        password_hash: bcrypt.hashSync('123456', 8),
        active: confirmEmail,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]),
  ]);
}
