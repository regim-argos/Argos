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

  static async getAllByUserId(user_id, search = '') {
    const DocWatchers = await this.findAndCountAll({
      where: { user_id, name: { [Op.iLike]: `%${search}%` } },
      order: [['createdAt', 'DESC']],
    });

    return DocWatchers;
  }

  static async getById(id, user_id) {
    const DocWatcher = await this.findOne({
      where: user_id ? { user_id, id } : { id },
    });

    return DocWatcher && DocWatcher.get();
  }

  static async create(data, user_id) {
    const DocWatcher = await super.create({
      ...data,
      user_id,
    });

    return DocWatcher && DocWatcher.get();
  }

  static async updateById(data, id, user_id) {
    const [, [DocWatcher]] = await this.update(data, {
      where: { user_id, id },
      returning: true,
    });

    return DocWatcher && DocWatcher.get();
  }

  static async ChangeWatcherStatusById(data, id) {
    const [, [DocWatcher]] = await this.update(data, {
      where: { id },
      returning: true,
    });

    return DocWatcher && DocWatcher.get();
  }

  static async deleteById(id, user_id) {
    return this.destroy({
      where: { user_id, id },
    });
  }
}

export default Watcher;
