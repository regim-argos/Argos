import { Sequelize, Options } from 'sequelize';

import User from '../app/data/models/User';

// @ts-ignore
import databaseConfig from '../config/database';
import Hash from '../app/data/models/Hash';
import File from '../app/data/models/File';
import Watcher from '../app/data/models/Watcher';
import Notification from '../app/data/models/Notification';
import Event from '../app/data/models/Event';

const models = [User, Hash, File, Watcher, Notification, Event];

class Database {
  public connection: Sequelize = new Sequelize(
    (databaseConfig as unknown) as Options
  );

  constructor() {
    this.init();
  }

  init() {
    models
      .map((model) => model.initModel(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  close() {
    this.connection.close();
  }
}

export default new Database();
