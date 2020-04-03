import Sequelize, { Model, Op } from 'sequelize';

class Watcher extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        url: Sequelize.STRING,
        status: Sequelize.BOOLEAN,
        delay: Sequelize.INTEGER,
        active: Sequelize.BOOLEAN,
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

  static async getUserWatchers(user_id, search = '') {
    const DocWatchers = await this.findAndCountAll({
      where: { user_id, name: { [Op.iLike]: `%${search}%` } },
      order: [['createdAt', 'DESC']],
    });

    return DocWatchers;
  }

  static async getWatcherById(id, user_id) {
    const DocWatcher = await this.findByPk(id, {
      where: { user_id },
    });

    return DocWatcher && DocWatcher.get();
  }

  static async createWatcher(data, user_id) {
    const DocWatcher = await this.create({
      ...data,
      user_id,
    });

    return DocWatcher && DocWatcher.get();
  }

  static async updateWatcherById(data, id, user_id) {
    const [, [DocWatcher]] = await this.update(data, {
      where: { user_id, id },
      returning: true,
    });

    return DocWatcher && DocWatcher.get();
  }

  static async deleteWatcherById(id, user_id) {
    return this.destroy({
      where: { user_id, id },
    });
  }
}

export default Watcher;
