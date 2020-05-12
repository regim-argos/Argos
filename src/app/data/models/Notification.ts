import Sequelize, { Model } from 'sequelize';

class Notification extends Model {
  public id!: number;

  public user_id!: number;

  public userId!: number;

  public platform!: string;

  public name!: string;

  public active!: boolean;

  public platformData!: {
    webhook: string;
  };

  static initModel(sequelize: Sequelize.Sequelize) {
    this.init(
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

  // @ts-ignore
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }

  static async getAllByUserId(user_id: number) {
    const Doc = await this.findAll({
      where: { user_id },
      order: [['createdAt', 'DESC']],
    });

    return Doc;
  }

  static async getById(id: number, user_id: number) {
    const Doc = await this.findOne({
      where: { id, user_id },
    });

    return Doc;
  }

  static async createOne(data: Notification, user_id: number) {
    const Doc = await this.create({
      ...data,
      user_id,
    });

    return Doc;
  }

  static async updateById(data: Notification, id: number, user_id: number) {
    const [, [Doc]] = await this.update(data, {
      where: { user_id, id },
      returning: true,
    });

    return Doc;
  }

  static async deleteById(id: number, user_id: number) {
    return this.destroy({
      where: { user_id, id },
    });
  }

  static async getAllByIds(ids: number[], user_id: number) {
    return this.findAll({
      where: { id: ids, user_id },
      order: [['createdAt', 'DESC']],
    });
  }
}

export default Notification;
