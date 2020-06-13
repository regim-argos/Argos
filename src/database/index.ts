import { Sequelize, Options } from 'sequelize';

// @ts-ignore
import User from '@app/data/models/User';
import databaseConfig from '../config/database';
import Hash from '../app/data/models/Hash';
import File from '../app/data/models/File';
import Watcher from '../app/data/models/Watcher';
import Notification from '../app/data/models/Notification';
import Event from '../app/data/models/Event';
import Project from '../app/data/models/Project';
import ProjectMember from '../app/data/models/ProjectMember';

const models = [
  User,
  Hash,
  File,
  Watcher,
  Notification,
  Event,
  Project,
  ProjectMember,
];

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
