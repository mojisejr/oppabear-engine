require("dotenv").config();
const { Sequelize } = require("sequelize");
const {
  postgres_db,
  postgres_user,
  postgres_pwd,
  postgres_port,
  postgres_host,
  production,
} = process.env;

const sequeilze = new Sequelize(postgres_db, postgres_user, postgres_pwd, {
  host: production === "PROD" ? "host.docker.internal" : "localhost",
  port: 5433,
  dialect: "postgres",
  logging: false,
});

sequeilze.authenticate().then(() => console.log("PSQL: Authorized!"));
sequeilze.sync().then(() => console.log("PSQL: Database was synced!"));

module.exports = sequeilze;
