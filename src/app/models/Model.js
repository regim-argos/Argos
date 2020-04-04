import { Model as SequelizeModel, Op } from 'sequelize';

class Model extends SequelizeModel {
  static init(dataTypes, sequelize) {
    super.init(dataTypes, sequelize);

    return this;
  }

  static async getAllByUserId(user_id, search = '') {
    const Doc = await this.findAndCountAll({
      where: { user_id, name: { [Op.iLike]: `%${search}%` } },
      order: [['createdAt', 'DESC']],
    });

    return Doc;
  }

  static async getById(id, user_id) {
    const Doc = await this.findOne({
      where: user_id ? { user_id, id } : { id },
    });

    return Doc && Doc.get();
  }

  static async create(data, user_id) {
    const Doc = await super.create({
      ...data,
      user_id,
    });

    return Doc && Doc.get();
  }

  static async updateById(data, id, user_id) {
    const [, [Doc]] = await this.update(data, {
      where: { user_id, id },
      returning: true,
    });

    return Doc && Doc.get();
  }

  static async deleteById(id, user_id) {
    return this.destroy({
      where: { user_id, id },
    });
  }
}

export default Model;
