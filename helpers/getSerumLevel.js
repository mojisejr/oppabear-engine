const { stimulus } = require("../blockchain");
const { getTokenUri } = require("../utils/getTokenUri");
const { log, LOG_TYPE } = require("../database/services/logging.service");

async function getSerumLevel(minter, _serumTokenId) {
  const stimulusUri = await stimulus.tokenURI(_serumTokenId);
  const serumURI = await getTokenUri(stimulusUri);
  const serum = serumURI.attributes[0].value;
  const level = serum.split(".")[1];
  log("EVENT_FUSION", `fusion with serum: ${serum}`, minter, LOG_TYPE.INFO);
  return level;
}

module.exports = {
  getSerumLevel,
};
