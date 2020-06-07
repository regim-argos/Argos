module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('watchers', 'project_id', {
        type: Sequelize.INTEGER,
        references: { model: 'projects', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      }),
      queryInterface.addColumn('notifications', 'project_id', {
        type: Sequelize.INTEGER,
        references: { model: 'projects', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('watchers', 'project_id'),
      queryInterface.removeColumn('notifications', 'project_id'),
    ]);
  },
};
