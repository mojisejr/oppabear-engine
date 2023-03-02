require("dotenv").config();
const { ethers } = require("ethers");
const mutantAbi = require("./mutant.abi");
const hostAbi = require("./host.abi");
const stiAbi = require("./stimulus.abi");
const labAbi = require("./labs.abi");

//ENV
const {
  dev_gen1,
  prod_gen1,
  dev_serum,
  prod_serum,
  dev_labs,
  prod_labs,
  dev_gen2,
  prod_gen2,
  production,
} = process.env;

const config = {
  providerUrl:
    "https://opt-goerli.g.alchemy.com/v2/FJoUwTBR1cpQiyK2gzrELLoP1ZsAmatQ",
  hostAddr: production === "PROD" ? prod_gen1 : dev_gen1,
  stimulusAddr: production === "PROD" ? prod_serum : dev_serum,
  labAddr: production === "PROD" ? prod_labs : dev_labs,
  mutantAddr: production === "PROD" ? prod_gen2 : dev_gen2,
};

const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);
const wallet = new ethers.Wallet(process.env.wallet_key);
const account = wallet.connect(provider);

const mutant = new ethers.Contract(config.mutantAddr, mutantAbi, account);
const host = new ethers.Contract(config.hostAddr, hostAbi, provider);
const stimulus = new ethers.Contract(config.stimulusAddr, stiAbi, provider);
const labs = new ethers.Contract(config.labAddr, labAbi, provider);

module.exports = {
  mutant,
  host,
  stimulus,
  labs,
};
