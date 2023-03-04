const OppaGen1 = require("../database/models/oppagen1.model");
const OppaGen2 = require("../database/models/oppagen2.model");
const gen1Path = `${process.cwd()}/database/migrate/gen1.csv`;
const gen2Path = `${process.cwd()}/database/migrate/gen2.csv`;
const csvtojson = require("csvtojson");

const baseIpfs =
  // "ipfs://bafybeid5uiefrwxejqqii6bemh2tsos5hzqxrzl5ieyulg26ugmm2eq26a";
  "ipfs://bafybeiefz3zwhro2v25yug5f6zhodjmezhpckthaoof4vzenlhx2l35vra";

const migrate = async () => {
  // OppaGen1.drop();
  // OppaGen2.drop();
  const gen1 = await csvtojson().fromFile(gen1Path);
  const gen2 = await csvtojson().fromFile(gen2Path);
  const gen1Data = gen1.map((g) => {
    return {
      rank: g._rank,
      name: g._name.split("#")[1],
      body: g.Body.toLowerCase().replace(" ", ""),
      score: g._score,
      rarity: getRarity(g._score),
      used: false,
    };
  });

  const gen2Data = gen2.map((g) => {
    return {
      rank: g._rank,
      name: g._name.split("#")[1],
      body: g.Body.toLowerCase().replace(" ", ""),
      score: g._score / 2.5,
      rarity: getRarity(g._score / 2.5),
      used: false,
      ipfs: `${baseIpfs}/${g._name.split("#")[1]}.json`,
    };
  });

  await OppaGen1.bulkCreate(gen1Data).catch((e) => console.log(e));
  await OppaGen2.bulkCreate(gen2Data).catch((e) => console.log(e));
};

const getRarity = (score) => {
  if (score < 500) {
    return 1;
  } else if (score > 500 && score < 1000) {
    return 2;
  } else if (score > 1000 && score < 2000) {
    return 3;
  } else if (score == 2000) {
    return 4;
  }
};

migrate().then(() => console.log("migrate successfully"));
