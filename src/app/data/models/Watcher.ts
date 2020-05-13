import Sequelize, { QueryTypes, Model } from 'sequelize';
import Notification from './Notification';

class Watcher extends Model {
  public id!: number;

  public user_id!: number;

  public userId!: number;

  public name!: string;

  public url!: string;

  public status!: boolean;

  public delay!: number;

  public active!: boolean;

  public lastChange!: string;

  public notifications!: Notification[];

  static initModel(sequelize: Sequelize.Sequelize) {
    this.init(
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

  // @ts-ignore
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }

  static async getById(id: number, user_id: number) {
    const [watcher] = (await this.sequelize?.query(
      `SELECT
      watcher.id,
      watcher.name,
      watcher.url,
      watcher.status,
      watcher.delay,
      watcher.active,
      watcher.user_id,
      watcher.last_change AS "lastChange",
          JSONB_AGG(
              JSONB_BUILD_OBJECT('id', u.id, 'platform', u.platform, 'platformData', u.platform_data, 'active', u.active, 'name', u.name)
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
    )) as Watcher[];
    if (watcher)
      watcher.notifications =
        watcher.notifications[0]?.id === null ? [] : watcher.notifications;
    return watcher;
  }

  static async getAllByUserId(user_id: number) {
    const Doc = await this.findAll({
      where: { user_id },
      order: [['createdAt', 'DESC']],
    });

    return Doc;
  }

  static async createOne(data: Partial<Watcher>, user_id: number) {
    const Doc = await this.create({
      ...data,
      user_id,
    });

    return Doc;
  }

  static async updateById(data: Partial<Watcher>, id: number, user_id: number) {
    const [, [Doc]] = await this.update(data, {
      where: { user_id, id },
      returning: true,
    });

    return Doc;
  }

  static async deleteById(id: number, user_id: number) {
    return this.destroy({
      where: { user_id, id },
    });
  }
}

export default Watcher;
