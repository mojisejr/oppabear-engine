require("./database/postgres.database");
require("dotenv").config();
const express = require("express");
const { runV2 } = require("./database/services/oppabear.service");
const { logging } = require("./utils/logging");
const { mutant, host, stimulus, labs } = require("./blockchain");
const { ethers } = require("ethers");

// const options = {
//   gasPrice: ethers.utils.parseUnits("20", "gwei"),
//   gasLimit: 5500000,
// };

// const PORT = process.env.PORT || 3000;
const app = express();

app.get("/", async (req, res) => {
  res.status(200).json({
    result: "OK",
  });
});

mutant.on(
  "Minted",
  async (minter, _gen2TokenId, _gen1TokenId, _serumTokenId) => {
    const input = {
      minter,
      gen2TokenId: _gen2TokenId.toString(),
      gen1TokenId: _gen1TokenId.toString(),
      serumTokenId: _serumTokenId.toString(),
    };

    //TODO : get uri from serum for mainnet
    const stimulusUri = await stimulus.tokenURI(_serumTokenId);
    const serum = JSON.parse(stimulusUri).attributes[0].value;

    const gen2TokenUri = await runV2(input.gen1TokenId, parseInt(serum));
    const tx = await mutant
      .setBaseURI(input.gen2TokenId, gen2TokenUri)
      .catch((e) => console.log("err is here", e.message));
    logging(
      `${minter} | minted with ${input.gen1TokenId} + ${input.serumTokenId} => ${input.gen1TokenId} [${gen2TokenUri}]\n tx: ${tx.hash} \n`
    );
    console.log(
      `${minter} | minted with ${input.gen1TokenId} + ${input.serumTokenId} => ${input.gen1TokenId} [${gen2TokenUri}]\n tx: ${tx.hash} \n`
    );
    //TODO:
    //save transaction hash and timestamp to database
  }
);

process.on("uncaughtException", (error) => {
  console.log(error);
  console.log("uncaught error");
});
process.on("unhandledRejection", (error) => {
  console.log(error);
  console.log("unhandle rejection");
});

app.listen(3001, () => {
  console.log("generator is now ready");
});
