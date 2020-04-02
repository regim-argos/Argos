import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import File from './File';

class User extends Model {
  static get include() {
    return [
      {
        model: File,
        as: 'image',
      },
    ];
  }

  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: { field: 'image_id', name: 'imageId' },
      as: 'image',
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  static async getUserById(id) {
    const DocUser = await this.findOne({
      where: { id },
      include: this.include,
    });

    return DocUser && DocUser.get();
  }

  static async getUserByEmail(email) {
    const DocUser = await this.findOne({
      where: { email },
      include: this.include,
    });

    return DocUser;
  }

  static async create(data) {
    const DocUser = await super.create({
      ...data,
      active: false,
    });
    return DocUser && DocUser.get();
  }

  static async update(data, id) {
    const DocUser = await this.findOne({ where: { id } });
    DocUser.set(data);
    const user = await DocUser.save(data);

    return user && user.get();
  }
}

export default User;
