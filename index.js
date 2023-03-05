require("./database/postgres.database");
require("dotenv").config();
const express = require("express");
const { runV2 } = require("./database/services/oppabear.service");
const { log, LOG_TYPE } = require("./database/services/logging.service");
const { labs, mutant } = require("./blockchain");
const { getSerumLevel } = require("./helpers/getSerumLevel");
const { setURI } = require("./helpers/setUri");
const { mintToken } = require("./helpers/mintToken");

// const options = {
//   gasPrice: ethers.utils.parseUnits("20", "gwei"),
//   gasLimit: 5500000,
// };

const app = express();

app.get("/", async (req, res) => {
  res.status(200).json({
    result: "OK",
  });
});

labs.on("Fusioned", async (minter, _gen1TokenId, _serumTokenId) => {
  const input = {
    minter,
    gen1TokenId: _gen1TokenId.toString(),
    serumTokenId: _serumTokenId.toString(),
  };
  try {
    console.log("input: ", input);

    //TODO : get uri from serum for mainnet
    const level = await getSerumLevel(minter, _serumTokenId).catch((e) =>
      console.log("seurm ipfs : ", e.message)
    );
    console.log("serum level: ", level);
    const gen2 = await runV2(input.gen1TokenId, parseInt(level));
    console.log("gen2: ", gen2);
    const tx = await setURI(
      gen2,
      input.gen1TokenId,
      input.serumTokenId,
      input.minter
    ).catch((error) => console.log(error));
    console.log("uriTx : ", tx.hash);

    log(
      "EVENT_FUSION",
      `Successfully : BaseURI_Tx : ${uriTx.hash}, Minting_Tx: ${mintTx.hash}`,
      input.minter,
      LOG_TYPE.INFO
    );
  } catch (error) {
    log(
      "EVENT_FUSION",
      `ERROR : ${error.message}`,
      input.minter,
      LOG_TYPE.ERROR
    );
  }
});

mutant.on("SetBaseURI", async (tokenId, baseUri, owner) => {
  console.log("base URI set! minting token..");
  const mintTx = await mintToken(owner, tokenId.toString());
  console.log("mintTx: ", mintTx.hash);
});

process.on("uncaughtException", (error) => {
  console.log(error);
  log("UNCAUGHT", `uncaughtException`, "0x00", LOG_TYPE.ERROR);
  console.log("uncaught error");
});
process.on("unhandledRejection", (error) => {
  console.log(error);
  log("UNHANDLE", `unhandledRejection`, "0x00", LOG_TYPE.ERROR);
  console.log("unhandle rejection");
});

app.listen(3001, () => {
  console.log("generator is now ready");
});
