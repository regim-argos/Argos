import Sequelize from 'sequelize';
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

  static async ChangeWatcherStatusById(data, id) {
    const [, [DocWatcher]] = await this.update(data, {
      where: { id },
      returning: true,
    });

    return DocWatcher && DocWatcher.get();
  }
}

export default Watcher;
