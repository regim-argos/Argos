module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('watchers', 'user_id'),
      queryInterface.removeColumn('notifications', 'user_id'),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('watchers', 'user_id', {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
      queryInterface.addColumn('notifications', 'user_id', {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    ]);
  },
};
