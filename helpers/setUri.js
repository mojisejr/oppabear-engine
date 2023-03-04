const { mutant } = require("../blockchain");
const { log, LOG_TYPE } = require("../database/services/logging.service");

async function setURI(gen2, gen1TokenId, serumTokenId) {
  const setBaseURITx = await mutant
    .setBaseURI(gen2.edition, gen2.ipfs)
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
