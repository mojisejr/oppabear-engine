const { Model, DataTypes } = require("sequelize");
const sequelize = require("../postgres.database");

class OppaGen1 extends Model {}

OppaGen1.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    //1 common
    //2 rare
    //3 super rare
    //4 legendary
    rarity: {
      type: DataTypes.INTEGER,
    },
    used: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
  }
);

module.exports = OppaGen1;
