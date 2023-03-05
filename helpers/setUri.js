const { mutant } = require("../blockchain");
const { log, LOG_TYPE } = require("../database/services/logging.service");

async function setURI(gen2, gen1TokenId, serumTokenId, minter) {
  const setBaseURITx = await mutant
    .setBaseURI(gen2.name, gen2.ipfs, minter)
    .catch((e) => {
      log(
        "EVENT_FUSION",
        `SetBaseURI Error Gen1_Id: ${gen1TokenId}, with Serum_Id: ${serumTokenId}`,
        minter,
        LOG_TYPE.ERROR
      );
    });
  return setBaseURITx;
}

module.exports = {
  setURI,
};
