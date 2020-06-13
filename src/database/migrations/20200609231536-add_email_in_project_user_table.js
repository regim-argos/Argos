module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('project_user', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('project_user', 'email');
  },
};
