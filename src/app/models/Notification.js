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
  }

  static async getAllByIds(ids) {
    return this.findAll({
      where: { id: ids },
      order: [['createdAt', 'DESC']],
    });
  }
}

export default Notification;
