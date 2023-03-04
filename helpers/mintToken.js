const { log, LOG_TYPE } = require("../database/services/logging.service");
const { mutant } = require("../blockchain");

async function mintToken(minter, gen2, gen1TokenId, serumTokenId) {
  const mintTokenURITx = await mutant.mint(minter, gen2.edition).catch((e) => {
    log(
      "EVENT_FUSION",
      `Minting Error Gen1_Id: ${gen1TokenId}, with Serum_Id: ${serumTokenId}`,
      minter,
      LOG_TYPE.ERROR
    );
  });

  return mintTokenURITx;
}

module.exports = {
  mintToken,
};
