var sequelize = require('../../app.js').configDatabase;
const { DataTypes } = require('sequelize');
const entityName = "Users";

const Users = sequelize.define(entityName, {
  IdUser: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  FirstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  BirthDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  InscriptionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  UserFlag: {
    type: DataTypes.STRING,
    allowNull: false
  },
  PatronageCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  PatronageNb: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  }, {
    tableName: entityName,
    createdAt: false,
    updatedAt: false,
});

module.exports = Users;