const csvtojson = require("csvtojson");
const gen1Path = `${process.cwd()}/database/migrate/gen1.csv`;
const gen2Path = `${process.cwd()}/database/migrate/gen2.csv`;

const run = async (gen1, gen2Input, oppaTokenId) => {
  const [gen1Input] = gen1.filter(
    (og1) => og1._name.split("#")[1] == oppaTokenId
  );
  const gen1ThisBodyLen = gen1.filter(
    (og1) =>
      og1.Body.toLowerCase().replace(" ", "") ==
      gen1Input.Body.toLowerCase().replace(" ", "")
  );
  const gen1Index = gen1ThisBodyLen.indexOf(gen1Input);

  const gen2 = gen2Input.filter(
    (oppa2) =>
      oppa2.Body.toLowerCase().replace(" ", "") ==
      gen1Input.Body.toLowerCase().replace(" ", "")
  );

  const indexOfGen2 = Math.floor(
    (gen2.length * gen1Index) / gen1ThisBodyLen.length
  );

  const gen2Output = gen2[indexOfGen2];

  //LOGGING
  /////////

  console.log("GEN1: input token: ", gen1Input._name);
  console.log(
    "GEN1: input token score: ",
    Math.round(gen1Input._score).toFixed(2)
  );
  console.log(
    `GEN1: ${gen1Input.Body.toLowerCase().replace(" ", "")} traits len: ${
      gen1ThisBodyLen.length
    }`
  );
  // console.log(`GEN1: rank: ${gen1Index}/${gen1ThisBodyLen.length}`);
  // console.log(`GEN2: ${gen1Input.Body} traits len ${gen2.length}`);
  // console.log(`let a = gen2 body of type ${gen1Input.Body} count`);
  // console.log(
  //   `let b = gen1 index of input tokenId ranking of [desc (high to low)]`
  // );
  // console.log(
  //   `let c = gen1 body of type ${gen1Input.Body} count [desc (high to low)]`
  // );
  // console.log(`indexOfGen2 = (a * b) / c `);

  // console.log(`GEN2: minting index of gen2 is : ${indexOfGen2}`);

  console.log(
    `compare score[gen1, gen2] - [${gen1Input._score} : ${
      gen2Output._score
    }] %Ratio ${gen2Output._score / gen1Input._score}`
  );
  console.log("==================");
  // console.log(gen2Output);
  // console.log(`${gen1Input._name} at rank ${gen1Index} will mint the`);
};

const test = async () => {
  let len = 11;
  let gen1 = await csvtojson().fromFile(gen1Path);
  let gen2 = await csvtojson().fromFile(gen2Path);
  for (let i = 1; i < len; i++) {
    await run(gen1, gen2, i);
  }
};

test();
