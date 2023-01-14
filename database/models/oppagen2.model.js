const { Model, DataTypes } = require("sequelize");
const sequelize = require("../postgres.database");

class OppaGen2 extends Model {}

OppaGen2.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rank: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING(255),
    },
    score: {
      type: DataTypes.DOUBLE,
    },
    rarity: {
      type: DataTypes.INTEGER,
    },
    used: {
      type: DataTypes.BOOLEAN,
    },
    ipfs: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
  }
);

module.exports = OppaGen2;
