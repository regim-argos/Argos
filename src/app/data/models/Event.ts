import Sequelize, { Model } from 'sequelize';
import { differenceInSeconds } from 'date-fns';

class Event extends Model {
  public id!: number;

  public status!: boolean;

  public startedAt!: Date;

  public endedAt!: Date;

  public watcher_id!: number;

  public watcherId!: number;

  public duration!: number;

  static initModel(sequelize: Sequelize.Sequelize) {
    this.init(
      {
        status: Sequelize.BOOLEAN,
        startedAt: Sequelize.DATE,
        endedAt: Sequelize.DATE,
        duration: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // @ts-ignore
  static associate(models) {
    this.belongsTo(models.Watcher, { foreignKey: 'watcher_id', as: 'watcher' });
  }

  static async getLast(watcherId: number) {
    const Doc = await this.findOne({
      where: { watcher_id: watcherId },
      limit: 1,
      order: [['startedAt', 'DESC']],
    });

    return Doc;
  }

  static async createOne(watcherId: number, status: boolean, startedAt: Date) {
    const lastEvent = await this.getLast(watcherId);
    if (lastEvent) {
      lastEvent.endedAt = startedAt;
      lastEvent.duration = differenceInSeconds(startedAt, lastEvent.startedAt);
      await lastEvent.save();
    }

    const Doc = await this.create({
      status,
      startedAt,
      watcher_id: watcherId,
    });

    return Doc;
  }
}

export default Event;
