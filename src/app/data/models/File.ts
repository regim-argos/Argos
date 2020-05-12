import Sequelize, { Model } from 'sequelize';

class File extends Model {
  id!: number;

  name!: string;

  path!: string;

  url!: string;

  user_id!: number;

  userId!: number;

  static initModel(sequelize: Sequelize.Sequelize) {
    this.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            // @ts-ignore
            return `${process.env.FILES_URL}/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // @ts-ignore
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: { field: 'user_id', name: 'userId' },
      as: 'user',
    });
  }

  static async getFileById(id: number, userId: number) {
    const DocFile = await this.findOne({ where: { id, userId } });

    return DocFile;
  }

  static async createOne(data: Partial<File>, userId: number) {
    const DocFile = await this.create({
      ...data,
      userId,
    });

    return DocFile;
  }
}

export default File;
