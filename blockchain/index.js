require("dotenv").config();
const { ethers } = require("ethers");
const mutantAbi = require("./mutant.abi");
const hostAbi = require("./host.abi");
const stiAbi = require("./stimulus.abi");
const labAbi = require("./labs.abi");

const config = {
  providerUrl:
    "https://opt-goerli.g.alchemy.com/v2/FJoUwTBR1cpQiyK2gzrELLoP1ZsAmatQ",
  hostAddr: "0x9C4Fcb88f54708133242933325884106DB7B0756",
  mutantAddr: "0xC7ffE5f33F162Ef9E637d1404fDF805CEAa6E859",
  stimulusAddr: "0x671120fe7a6Ae84d0FFbA42013Bf754151E4FaC7",
  labAddr: "0x8537d7FEd909e2bFd08Ce584d7D7a7edaB77c498",
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
