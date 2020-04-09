module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      queryInterface.renameColumn('users', 'defaultDelay', 'default_delay'),
      queryInterface.renameColumn('users', 'watcherNumber', 'watcher_number'),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.renameColumn('users', 'default_delay', 'defaultDelay'),
      queryInterface.renameColumn('users', 'watcher_number', 'watcherNumber'),
    ]);
  },
};
