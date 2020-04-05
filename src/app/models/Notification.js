import Sequelize from 'sequelize';
import Model from './Model';

class Notification extends Model {
  static init(sequelize) {
    super.init(
      {
        platform: Sequelize.STRING,
        platformData: Sequelize.JSON,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Watcher, {
      foreignKey: { field: 'watcher_id', name: 'watcherId' },
      as: 'watcher',
    });
  }

  static async getAllByUserId(user_id) {
    const notifications = await super.getAllByUserId(user_id);

    return notifications.map((notification) => ({
      ...notification,
      platformData: JSON.parse(notification.platformData),
    }));
  }

  static async getAllByWatcherId(watcherId) {
    const notifications = await this.findAll({
      where: { watcherId },
      order: [['createdAt', 'DESC']],
    });

    return notifications.map((notification) => ({
      ...notification.get(),
      platformData: JSON.parse(notification.platformData),
    }));
  }

  static async getById(id, user_id) {
    const notification = await super.getById(id, user_id);

    notification.platformData = JSON.parse(notification.platformData);

    return notification;
  }

  static async create(data, user_id) {
    const notification = await super.create(data, user_id);

    notification.platformData = JSON.parse(notification.platformData);

    return notification;
  }

  static async updateById(data, id, user_id) {
    const notification = await super.updateById(data, id, user_id);

    notification.platformData = JSON.parse(notification.platformData);

    return notification;
  }
}

export default Notification;
