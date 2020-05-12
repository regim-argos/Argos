import Sequelize, { Model } from 'sequelize';

class Hash extends Model {
  id!: number;

  hash!: string;

  user_id!: number;

  userId!: number;

  type!: 'CONFIRM_EMAIL' | 'CHANGE_PASSWORD';

  static initModel(sequelize: Sequelize.Sequelize) {
    this.init(
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

  // @ts-ignore
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }

  static async getHashByHash(hash: string, type: string) {
    const DocHash = await this.findOne({ where: { hash, type } });

    return DocHash;
  }

  static async createHash(data: Partial<Hash>, user_id: number) {
    const DocHash = await this.create({
      ...data,
      user_id,
    });

    return DocHash;
  }

  static async deleteHashById(id: number) {
    return this.destroy({
      where: { id },
    });
  }
}

export default Hash;
