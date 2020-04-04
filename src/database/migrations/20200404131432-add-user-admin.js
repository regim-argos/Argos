module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('DEFAULT', 'ADMIN'),
      allowNull: false,
      defaultValue: 'DEFAULT',
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('users', 'role');
  },
};
