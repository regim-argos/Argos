module.exports = {
  up: (queryInterface) => {
    return queryInterface.removeColumn('notifications', 'watcher_id');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('notifications', 'watcher_id', {
      type: Sequelize.INTEGER,
      references: { model: 'watchers', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
