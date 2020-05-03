module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('notifications', 'name', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      }),
      queryInterface.addColumn('notifications', 'active', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('notifications', 'name'),
      queryInterface.removeColumn('notifications', 'active'),
    ]);
  },
};
