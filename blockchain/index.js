require("dotenv").config();
const { ethers } = require("ethers");
const mutantAbi = require("./mutant.abi");
const hostAbi = require("./host.abi");
const stiAbi = require("./stimulus.abi");
const labAbi = require("./labs.abi");

const config = {
  providerUrl:
    "https://opt-goerli.g.alchemy.com/v2/FJoUwTBR1cpQiyK2gzrELLoP1ZsAmatQ",
  hostAddr: "0xBd770c7DF46c32dC7de54a5Ce680Bb22988a21aF",
  mutantAddr: "0x9296dE16C3D40ACFa337D28B46C76D8aA0599C57",
  stimulusAddr: "0xA9cf8BBe8c26384A63066df6C632c09a9D4D0434",
  labAddr: "0x55263C11f577f750Acb760D20F7a00f05bdE6B5D",
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
