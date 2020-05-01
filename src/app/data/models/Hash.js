import Sequelize, { Model } from 'sequelize';

class Hash extends Model {
  static init(sequelize) {
    super.init(
      {
        hash: Sequelize.STRING,
        type: Sequelize.ENUM('CONFIRM_EMAIL', 'CHANGE_PASSWORD'),
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }

  static async getHashByHash(hash, type) {
    const DocHash = await this.findOne({ where: { hash, type } });

    return DocHash && DocHash.get();
  }

  static async createHash(data, user_id) {
    const DocHash = await this.create({
      ...data,
      user_id,
    });

    return DocHash && DocHash.get();
  }

  static async deleteHashById(id) {
    return this.destroy({
      where: { id },
    });
  }
}

export default Hash;
