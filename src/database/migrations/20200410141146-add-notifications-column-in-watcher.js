module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('watchers', 'notifications', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('watchers', 'notifications');
  },
};
