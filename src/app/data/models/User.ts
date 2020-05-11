import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import File from './File';

class User extends Model {
  id!: number;

  name!: string;

  email!: string;

  defaultDelay!: number;

  watcherNumber!: number;

  password!: string;

  password_hash!: string;

  active!: boolean;

  role!: 'DEFAULT' | 'ADMIN';

  image!: File;

  imageId!: number;

  static get include() {
    return [
      {
        model: File,
        as: 'image',
      },
    ];
  }

  static initModel(sequelize: Sequelize.Sequelize) {
    this.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        defaultDelay: Sequelize.INTEGER,
        watcherNumber: Sequelize.INTEGER,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
        role: Sequelize.ENUM('DEFAULT', 'ADMIN'),
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user: User) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // @ts-ignore
  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: { field: 'image_id', name: 'imageId' },
      as: 'image',
    });
  }

  checkPassword(password: string) {
    return bcrypt.compare(password, this.password_hash);
  }

  static async getUserById(id: number) {
    const DocUser = await this.findOne({
      where: { id },
      include: this.include,
    });

    return DocUser;
  }

  static async getUserByEmail(email: string) {
    const DocUser = await this.findOne({
      where: { email },
      include: this.include,
    });

    return DocUser;
  }

  static async createOne(data: Partial<User>) {
    const DocUser = await this.create({
      ...data,
      active: false,
    });
    return DocUser;
  }

  static async updateOne(data: Partial<User>, id: number) {
    const DocUser = await this.findOne({ where: { id } });
    if (DocUser) {
      DocUser.set(data);
      const user = await DocUser.save();

      return user;
    }
    throw new Error('not found user');
  }
}

export default User;
