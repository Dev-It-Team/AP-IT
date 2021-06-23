var sequelize = require('../../app.js').configDatabase;
const { DataTypes } = require('sequelize');
const entityName = "Utilisateurs";

const Utilisateurs = sequelize.define(entityName, {
  IdUser: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Adresse: {
    type: DataTypes.STRING,
    allowNull: false
  },
  MotDePasse: {
    type: DataTypes.STRING,
    allowNull: false
  },
  DateDeNaissance: {
    type: DataTypes.DATE,
    allowNull: false
  },
  DateInscription: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  UserFlag: {
    type: DataTypes.STRING,
    allowNull: false
  },
  CodeParainage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  NbParainages: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  }, {
    tableName: entityName
});

module.exports = Utilisateurs;