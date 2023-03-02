require("dotenv").config();
const { Sequelize } = require("sequelize");
const {
  postgres_db,
  postgres_user,
  postgres_pwd,
  postgres_port_prod,
  postgres_port_dev,
  postgres_host_prod,
  postgres_host_dev,
  production,
} = process.env;

const sequeilze = new Sequelize(postgres_db, postgres_user, postgres_pwd, {
  host: production === "PROD" ? postgres_host_prod : postgres_host_dev,
  port: production === "PROD" ? postgres_port_prod : postgres_port_dev,
  dialect: "postgres",
  logging: false,
});

sequeilze.authenticate().then(() => console.log("PSQL: Authorized!"));
sequeilze.sync().then(() => console.log("PSQL: Database was synced!"));

module.exports = sequeilze;
