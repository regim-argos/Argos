import Sequelize, { Model } from 'sequelize';

class Notification extends Model {
  public id!: number;

  public project_id!: number;

  public projectId!: number;

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
    this.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
  }

  static async getAllByProjectId(project_id: number) {
    const Doc = await this.findAll({
      where: { project_id },
      order: [['createdAt', 'DESC']],
    });

    return Doc;
  }

  static async getById(id: number, project_id: number) {
    const Doc = await this.findOne({
      where: { id, project_id },
    });

    return Doc;
  }

  static async createOne(data: Notification, project_id: number) {
    const Doc = await this.create({
      ...data,
      project_id,
    });

    return Doc;
  }

  static async updateById(data: Notification, id: number, project_id: number) {
    const [, [Doc]] = await this.update(data, {
      where: { project_id, id },
      returning: true,
    });

    return Doc;
  }

  static async deleteById(id: number, project_id: number) {
    return this.destroy({
      where: { project_id, id },
    });
  }

  static async getAllByIds(ids: number[], project_id: number) {
    return this.findAll({
      where: { id: ids, project_id },
      order: [['createdAt', 'DESC']],
    });
  }
}

export default Notification;
