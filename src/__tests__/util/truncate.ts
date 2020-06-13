/* eslint-disable @typescript-eslint/camelcase */
import bcrypt from 'bcryptjs';
import database from '../../database';

export default function truncate(confirmEmail = true) {
  // @ts-ignore
  return Promise.all([
    ...Object.keys(database.connection.models).map((key) => {
      return database.connection.models[key].destroy({
        // @ts-ignore
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
      {
        name: 'Argos Admin',
        email: 'admin@argos2.com',
        password_hash: bcrypt.hashSync('123456', 8),
        active: confirmEmail,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]),
  ]);
}
