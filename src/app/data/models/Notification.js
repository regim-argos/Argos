import Sequelize from 'sequelize';
import Model from './Model';

class Notification extends Model {
  static init(sequelize) {
    super.init(
      {
        platform: Sequelize.STRING,
        name: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
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
  }

  static async getAllByIds(ids, user_id) {
    return this.findAll({
      where: { id: ids, user_id },
      order: [['createdAt', 'DESC']],
    });
  }
}

export default Notification;
