const { Model, DataTypes } = require("sequelize");
const sequelize = require("../postgres.database");

class Serum extends Model {}

Serum.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dna: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
  }
);

module.exports = Serum;
