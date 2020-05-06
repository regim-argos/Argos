import Sequelize, { Model } from 'sequelize';

class File extends Model {
  public name!: string;
  public path!: string;
  public url!: string;
  static initModel(sequelize: Sequelize.Sequelize) {
    this.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            //@ts-ignore
            return `${process.env.FILES_URL}/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    // return this;
  }

  static associate(models: {
    [x: string]: Sequelize.ModelCtor<Sequelize.Model<any, any>>;
    User?: any;
  }) {
    this.belongsTo(models.User, {
      foreignKey: { field: 'user_id', name: 'userId' },
      as: 'user',
    });
  }

  static async getFileById(id: number, userId: number) {
    const DocFile = await this.findOne({ where: { id, userId } });

    return DocFile && DocFile.get();
  }

  static async createOne(data: any, userId: number) {
    const DocFile = await this.create({
      ...data,
      userId,
    });

    return DocFile && DocFile.get();
  }
}

export default File;
