const Log = require("../models/logs.model");

const LOG_TYPE = {
  ERROR: "ERROR",
  INFO: "INFO",
};

async function log(fn, message, caller, type = LOG_TYPE.ERROR) {
  await Log.create({ function: fn, type, message, caller });
}

module.exports = {
  log,
  LOG_TYPE,
};
