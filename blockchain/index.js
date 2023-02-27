require("dotenv").config();
const { ethers } = require("ethers");
const mutantAbi = require("./mutant.abi");
const hostAbi = require("./host.abi");
const stiAbi = require("./stimulus.abi");
const labAbi = require("./labs.abi");

const config = {
  providerUrl:
    "https://opt-goerli.g.alchemy.com/v2/FJoUwTBR1cpQiyK2gzrELLoP1ZsAmatQ",
  hostAddr: "0x2873eD15d349B3eCD048B6036Dcab89E87Aeb4F8",
  mutantAddr: "0xb90C4fD94f7E96ED04141AD0f53256D4A51178A3",
  stimulusAddr: "0x13a5631D92DD04E1fF802FEF0e70b392B660a86F",
  labAddr: "0x8D342304292e28696Ce10bA15cc88E255C612734",
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
