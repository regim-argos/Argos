import Sequelize from 'sequelize';

import User from '../app/data/models/User';

import databaseConfig from '../config/database';
import Hash from '../app/data/models/Hash';
import File from '../app/data/models/File';
import Watcher from '../app/data/models/Watcher';
import Notification from '../app/data/models/Notification';

const models = [User, Hash, File, Watcher, Notification];

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
