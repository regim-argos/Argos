module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('watchers', 'current_watcher_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('watchers', 'current_watcher_id');
  },
};
