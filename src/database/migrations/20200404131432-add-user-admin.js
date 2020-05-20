module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('DEFAULT', 'ADMIN'),
      allowNull: false,
      defaultValue: 'DEFAULT',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.sequelize.query('DROP TYPE "enum_users_role"');
  },
};
