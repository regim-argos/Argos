import Sequelize, { QueryTypes } from 'sequelize';
import Model from './Model';

class Watcher extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        url: Sequelize.STRING,
        status: Sequelize.BOOLEAN,
        delay: Sequelize.INTEGER,
        active: Sequelize.BOOLEAN,
        lastChange: Sequelize.DATE,
        notifications: Sequelize.JSONB,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }

  static async getById(id, user_id) {
    const [watcher] = await this.sequelize.query(
      `SELECT
      watcher.id,
      watcher.name,
      watcher.url,
      watcher.status,
      watcher.delay,
      watcher.active,
      watcher.user_id AS userId,
      watcher.last_change AS "lastChange",
          JSONB_AGG(
              JSONB_BUILD_OBJECT('id', u.id, 'platform', u.platform, 'platformData', u.platform_data)
          ) AS notifications
      FROM watchers watcher
      LEFT JOIN LATERAL JSONB_ARRAY_ELEMENTS(watcher.notifications) AS e(usr) ON TRUE
      LEFT JOIN notifications u ON (e.usr->'id')::text::int = u.id
      WHERE ${user_id ? 'watcher.user_id = $user_id AND' : ''} watcher.id = $id
      GROUP BY watcher.id
      lIMIT 1`,
      {
        bind: { id, user_id },
        type: QueryTypes.SELECT,
      }
    );
    watcher.notifications =
      watcher.notifications[0].id === null ? [] : watcher.notifications;
    return watcher;
  }

  static async ChangeWatcherStatusById(data, id) {
    const [, [DocWatcher]] = await this.update(data, {
      where: { id },
      returning: true,
    });

    return DocWatcher && DocWatcher.get();
  }
}

export default Watcher;
