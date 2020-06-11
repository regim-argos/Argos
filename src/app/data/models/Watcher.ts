import Sequelize, { QueryTypes, Model, Op } from 'sequelize';
import { set, lastDayOfMonth } from 'date-fns';
import Notification from './Notification';
import Event from './Event';

class Watcher extends Model {
  public id!: number;

  public projectId!: number;

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
        projectId: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // @ts-ignore
  static associate(models) {
    this.belongsTo(models.Project, {
      foreignKey: { field: 'project_id', name: 'projectId' },
      as: 'project',
    });
    this.hasMany(models.Event, { as: 'events', foreignKey: 'watcher_id' });
  }

  static async getById(id: number, projectId: number) {
    const [watcher] = (await this.sequelize?.query(
      `SELECT
      watcher.id,
      watcher.name,
      watcher.url,
      watcher.status,
      watcher.delay,
      watcher.active,
      watcher.project_id AS "projectId",
      watcher.last_change AS "lastChange",
          JSONB_AGG(
              JSONB_BUILD_OBJECT('id', u.id, 'platform', u.platform, 'platformData', u.platform_data, 'active', u.active, 'name', u.name)
          ) AS notifications
      FROM watchers watcher
      LEFT JOIN LATERAL JSONB_ARRAY_ELEMENTS(watcher.notifications) AS e(usr) ON TRUE
      LEFT JOIN notifications u ON (e.usr->'id')::text::int = u.id
      WHERE ${
        projectId ? 'watcher.project_id = $projectId AND' : ''
      } watcher.id = $id
      GROUP BY watcher.id
      lIMIT 1`,
      {
        bind: { id, projectId },
        type: QueryTypes.SELECT,
      }
    )) as Watcher[];
    if (watcher)
      watcher.notifications =
        watcher.notifications[0]?.id === null ? [] : watcher.notifications;
    return watcher;
  }

  static async getByIdWithEvent(
    id: number,
    projectId: number,
    month?: number,
    year?: number
  ) {
    let dateFnsMonth: number | undefined;
    if (month) dateFnsMonth = month - 1;
    const startDate = set(new Date(), {
      hours: 0,
      minutes: 0,
      seconds: 0,
      date: 1,
      month: dateFnsMonth,
      year,
    });
    const finishDate = set(lastDayOfMonth(startDate), {
      hours: 23,
      minutes: 59,
      seconds: 59,
    });
    // @ts-ignore
    const Doc = await this.findOne({
      where: { id, projectId },
      include: [
        {
          attributes: ['status', 'startedAt', 'endedAt', 'duration'],
          model: Event,
          as: 'events',
          where: {
            [Op.or]: [
              {
                endedAt: {
                  [Op.between]: [startDate, finishDate],
                },
              },
              {
                startedAt: {
                  [Op.between]: [startDate, finishDate],
                },
              },
            ],
          },
        },
      ],
    });

    return Doc || [];
  }

  static async getAllByProjectId(projectId: number) {
    const Doc = await this.findAll({
      where: { projectId },
      order: [['createdAt', 'DESC']],
    });

    return Doc;
  }

  static async createOne(data: Partial<Watcher>, projectId: number) {
    const Doc = await this.create({
      ...data,
      projectId,
    });

    return Doc;
  }

  static async updateById(
    data: Partial<Watcher>,
    id: number,
    projectId: number
  ) {
    const [, [Doc]] = await this.update(data, {
      where: { projectId, id },
      returning: true,
    });

    return Doc;
  }

  static async deleteById(id: number, projectId: number) {
    return this.destroy({
      where: { projectId, id },
    });
  }
}

export default Watcher;
