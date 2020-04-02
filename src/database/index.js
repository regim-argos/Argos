import Sequelize from 'sequelize';

import User from '../app/models/User';

import databaseConfig from '../config/database';
import Hash from '../app/models/Hash';
import File from '../app/models/File';

const models = [User, Hash, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  close() {
    this.connection.close();
  }
}

export default new Database();
