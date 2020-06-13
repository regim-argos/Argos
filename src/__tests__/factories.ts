import faker from 'faker';
import factory from 'factory-girl';
import Watcher from '../app/data/models/Watcher';
import Notification from '../app/data/models/Notification';
import User from '../app/data/models/User';
import Project from '../app/data/models/Project';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Notification', Notification, {
  platform: 'SLACK',
  name: faker.name.findName(),
  platformData: {
    webhook: faker.internet.url(),
  },
});

factory.define('Watcher', Watcher, {
  name: faker.name.findName(),
  url: faker.internet.url(),
  delay: faker.random.number({ min: 60, max: 180 }),
});

factory.define('Project', Project, {
  name: faker.name.findName(),
});

export default factory;
