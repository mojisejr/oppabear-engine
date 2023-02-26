require("dotenv").config();
const { ethers } = require("ethers");
const mutantAbi = require("./mutant.abi");
const hostAbi = require("./host.abi");
const stiAbi = require("./stimulus.abi");
const labAbi = require("./labs.abi");

const config = {
  providerUrl:
    "https://opt-goerli.g.alchemy.com/v2/FJoUwTBR1cpQiyK2gzrELLoP1ZsAmatQ",
  hostAddr: "0xEBcEF7c7cb28eC904Eb69E9327cE0a465BB68A49",
  mutantAddr: "0xC08efD523a3F1a238a09Bf84a16725de6725d9F5",
  stimulusAddr: "0x74c68931B655636EC1C438616E3eB59231133D2E",
  labAddr: "0x8b3Ea677f28DCF6032279885DFbeBe577C2e0bC5",
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
