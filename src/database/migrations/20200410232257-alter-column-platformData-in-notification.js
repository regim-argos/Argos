module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('notifications', 'platform_data', {
      type: Sequelize.JSONB,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('notifications', 'platform_data', {
      type: Sequelize.JSON,
    });
  },
};
