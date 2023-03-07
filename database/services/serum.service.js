const Serum = require("../models/serum.model");

async function getSerumLevelById(serumId) {
  const result = await Serum.findOne({ where: { id: serumId } });
  return result == undefined ? null : result.dataValues.level;
}

async function markSerumAsUsed(serumId) {
  await Serum.update({ used: true }, { where: { id: serumId } });
}

module.exports = {
  getSerumLevelById,
  markSerumAsUsed,
};
