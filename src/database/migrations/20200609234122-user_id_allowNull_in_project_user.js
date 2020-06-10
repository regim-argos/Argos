module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('project_user', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('project_user', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
