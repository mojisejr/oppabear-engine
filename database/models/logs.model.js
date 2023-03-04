const { Model, DataTypes } = require("sequelize");
const sequelize = require("../postgres.database");

class Log extends Model {}

Log.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    function: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    caller: {
      type: DataTypes.STRING(255),
      defaultValue: "0x00",
    },
  },
  {
    sequelize,
  }
);

module.exports = Log;
