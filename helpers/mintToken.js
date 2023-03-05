const { log, LOG_TYPE } = require("../database/services/logging.service");
const { mutant } = require("../blockchain");

async function mintToken(minter, tokenId) {
  const mintTokenURITx = await mutant.mint(minter, tokenId).catch((e) => {
    console.log(e);
    log("EVENT_FUSION", `Minting Error`, minter, LOG_TYPE.ERROR);
  });

  return mintTokenURITx;
}

module.exports = {
  mintToken,
};
