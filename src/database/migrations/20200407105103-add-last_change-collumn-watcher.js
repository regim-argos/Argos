module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('watchers', 'last_change', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now'),
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('watchers', 'last_change');
  },
};
