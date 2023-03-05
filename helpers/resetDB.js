const OppaGen1 = require("../database/models/oppagen1.model");
const OppaGen2 = require("../database/models/oppagen2.model");
const gen1Path = `${process.cwd()}/database/migrate/gen1.csv`;
const gen2Path = `${process.cwd()}/database/migrate/gen2.csv`;
const csvtojson = require("csvtojson");

const baseIpfs =
  // "ipfs://bafybeid5uiefrwxejqqii6bemh2tsos5hzqxrzl5ieyulg26ugmm2eq26a";
  "ipfs://bafybeiefz3zwhro2v25yug5f6zhodjmezhpckthaoof4vzenlhx2l35vra";

const reset = async () => {
  const gen1Result = await OppaGen1.update(
    { used: false },
    {
      where: {
        used: true,
      },
    }
  );

  const gen2Result = await OppaGen2.update(
    { used: false },
    { where: { used: true } }
  );

  console.log("gen1Result: ", gen1Result);
  console.log("gen2Result: ", gen2Result);
};

reset().then(() => console.log("reset successfully"));
