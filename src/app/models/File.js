import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
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

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: { field: 'user_id', name: 'userId' },
      as: 'user',
    });
  }

  static async getFileById(id, userId) {
    const DocFile = await this.findOne({ where: { id, userId } });

    return DocFile && DocFile.get();
  }

  static async create(data, userId) {
    const DocFile = await super.create({
      ...data,
      userId,
    });

    return DocFile && DocFile.get();
  }
}

export default File;
