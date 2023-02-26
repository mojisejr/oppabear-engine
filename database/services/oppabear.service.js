const OppaGen1 = require("../models/oppagen1.model");
const OppaGen2 = require("../models/oppagen2.model");
const { Op } = require("sequelize");
const gen1Path = `${process.cwd()}/database/migrate/gen1.csv`;
const gen2Path = `${process.cwd()}/database/migrate/gen2.csv`;
const csvtojson = require("csvtojson");
const { logging } = require("../../utils/logging");

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

const getGen1ById = async (tokenId) => {
  const result = await OppaGen1.findOne({ where: { name: tokenId } }).catch(
    (e) => console.log("getGen1ById: ", e)
  );
  return result == undefined ? null : result.dataValues;
};

const getGen2ById = async (tokenId) => {
  const result = await OppaGen2.findOne({ where: { name: tokenId } }).catch(
    (e) => console.log("getGen2ById: ", e)
  );
  return result == undefined ? null : result.dataValues;
};

const getAllUnusedGen1 = async () => {
  let results = await OppaGen1.findAll({ where: { used: false } });
  return results.length <= 0 ? [] : results.map((result) => result.dataValues);
};

const getAllUnusedGen2 = async () => {
  let results = await OppaGen2.findAll({ where: { used: false } });
  return results.length <= 0 ? [] : results.map((result) => result.dataValues);
};

const getUnusedGen1OfType = async (type) => {
  let results = await OppaGen1.findAll({ where: { used: false, body: type } });
  return results.length <= 0 ? [] : results.map((result) => result.dataValues);
};

const getUsedGen1OfRarity = async (rarity) => {
  let results = await OppaGen1.findAll({
    where: { rarity: rarity, used: true },
  });
  return results.length <= 0 ? [] : results.map((result) => result.dataValues);
};
const getUnusedGen1OfRarity = async (rarity) => {
  let results = await OppaGen1.findAll({
    where: { rarity: rarity, used: false },
  });
  return results.length <= 0 ? [] : results.map((result) => result.dataValues);
};

const getUnusedGen1OfRarityRange = async (rarity = []) => {
  let results = await OppaGen1.findAll({
    where: {
      rarity: { [Op.in]: rarity },
      [Op.and]: { used: false },
      // used: false,
    },
  });

  return results.length <= 0 ? [] : results.map((result) => result.dataValues);
};

const getUsedGen2OfRarity = async (rarity) => {
  let results = await OppaGen2.findAll({
    where: { rarity: rarity, used: true },
  });
  return results.length <= 0 ? [] : results.map((result) => result.dataValues);
};

const getUnusedGen2OfRarity = async (rarity) => {
  let results = await OppaGen2.findAll({
    where: { rarity: rarity, used: false },
  });
  return results.length <= 0 ? [] : results.map((result) => result.dataValues);
};

const getUnusedGen2OfRarityRange = async (rarity = []) => {
  let results = await OppaGen2.findAll({
    where: {
      rarity: { [Op.in]: rarity },
      [Op.and]: { used: false },
      // used: false,
    },
  });

  return results.length <= 0 ? [] : results.map((result) => result.dataValues);
};

const getUnusedGen2OfRarityWithScoreRange = async (rarity = [], score = []) => {
  let results = await OppaGen2.findAll({
    where: {
      rarity: { [Op.in]: rarity },
      score: { [Op.between]: score },
      [Op.and]: { used: false },
      // used: false,
    },
  });

  return results.length <= 0 ? [] : results.map((result) => result.dataValues);
};

const markUsedGen1 = async (tokenId) => {
  let result = await OppaGen1.update(
    { used: true },
    { where: { name: tokenId } }
  );
  return result <= 0 ? false : true;
};

const getUnusedGen2OfType = async (type) => {
  let results = await OppaGen2.findAll({ where: { used: false, body: type } });
  return results.length <= 0 ? [] : results.map((result) => result.dataValues);
};

const markUsedGen2 = async (tokenId) => {
  let result = await OppaGen2.update(
    { used: true },
    { where: { name: tokenId } }
  );
  return result <= 0 ? false : true;
};

//1 jump trait when lv2 lv3 serum
//2 level 2 -> common, rare
//3 level 3 -> common, rare, super rare
//4 lucky common could get rare
//5 rare , super rare have to be at least same rarity score or higher

const serumLv1Algorithm = async (oppabearGen1) => {
  //1 common
  // 1.1 same trait & rarity (special get rare if rand < 5)
  //2 rare ->
  // 2.1 same trait & rarity
  //3 super ->
  // 3.1 same trait & rarity
  //4 other ->
  // 4.1 same trait & rarity
  let gen1Input = oppabearGen1;
  let gen2Output = undefined;
  if (gen1Input.used) return;
  let gen1 = await getUnusedGen1OfType(gen1Input.body);
  let gen2 = await getUnusedGen2OfType(gen1Input.body);
  if (gen2.length <= 0) {
    //- in case of nothing found or minted out so random one of unused
    gen2Output = await getOneRandom();
    //Nothing to mint
    if (gen2Output == undefined) return;
    logging(
      `| ไม่มี type ที่ตรงกันแล้ว | tokenId: ${gen1Input.name} with rarity lv: ${gen1Input.rarity} หา type ตรงกันไม่ได้ random อะไรก็ได้ 1 ตัว, ได้ gen2 tokenId: ${gen2Output.name} with rarity lv: ${gen2Output.rarity} \n ipfs ${gen2Output.ipfs}\n`
    );
  } else {
    //- in case of special mint of common rarity
    const rand = Math.floor(Math.random() * 123940) % 100;

    if (rand < 1 && gen1Input.rarity == 1) {
      const gen2 = await getUnusedGen2OfRarity(2);
      mul = 0.5;
      if (gen2.length <= 0) {
        gen2Output = await getOneRandom();
        logging(
          `| เป็น common 5% แต่ ไม่มี token เหลือแล้ว (gen2.length <= 0) | tokenId: ${gen1Input.name} with rarity lv: ${gen1Input.rarity} แต่ไม่เหลือ gen2 ที่ตรง type = 2 แล้ว random อะไรก็ได้, ได้ gen2 tokenId: ${gen2Output.name} with rarity lv: ${gen2Output.rarity} \n ipfs: ${gen2Output.ipfs}\n`
        );
      } else {
        const pos = rand % gen2.length;
        gen2Output = gen2[pos];
        logging(
          `| เป็น common 5% | tokenId: ${gen1Input.name} with rarity lv: ${gen1Input.rarity} เป็น common ผู้โชคดีได้ rare, ได้ gen2 tokenId: ${gen2Output.name} with rarity lv: ${gen2Output.rarity} \n ipfs ${gen2Output.ipfs}\n`
        );
      }
      //-- random position and get one
    } else {
      //- in the normal case depen on rarity

      const { indexOfGen2 } = getGen2ComparedIndex(gen1, gen2, gen1Input);
      gen2Output = gen2[indexOfGen2];
      logging(
        `| random ปกติ | tokenId: ${gen1Input.name} with rarity lv: ${gen1Input.rarity} got gen2, tokenId: ${gen2Output.name} with rarity lv: ${gen2Output.rarity} type [${gen1Input.body}, ${gen2Output.body}] \n ipfs ${gen2Output.ipfs}\n`
      );
    }
  }
  await markUsedGen1(gen1Input.name);
  await markUsedGen2(gen2Output.name);
  return gen2Output;
};

const serumLv2Algorithm = async (oppabearGen1) => {
  //1. common
  // if get common so same type
  //1.1 common or rare trait jump
  //2. rare
  //2.1 rare or super rare jump
  //3. super rare
  //3.1 only super could be jump
  //4 legend -> legend
  let gen1Input = oppabearGen1;
  let rarity = oppabearGen1.rarity;
  // let gen1 = await getUnusedGen1OfRarity(rarity);
  let gen1 = await getUnusedGen1OfType(gen1Input.body);
  let gen2Output = undefined;
  if (gen1Input.used) return;
  let gen2 = await getGen2FromGen1RarityAndSerumLv2(rarity, gen1Input.body);
  if (gen2.length <= 0) {
    gen2Output = await getOneRandom();
    if (gen2Output == undefined) return;
    logging(
      `| ไม่มี type ที่ตรงกันแล้ว | tokenId: ${gen1Input.name} with rarity lv: ${gen1Input.rarity} หา type ตรงกันไม่ได้ random อะไรก็ได้ 1 ตัว, ได้ gen2 tokenId: ${gen2Output.name} with rarity lv: ${gen2Output.rarity} \n ipfs ${gen2Output.ipfs}\n`
    );
  } else {
    const { indexOfGen2 } = getGen2ComparedIndex(gen1, gen2, gen1Input);
    gen2Output = gen2[indexOfGen2];
    logging(
      `| random ปกติ | tokenId: ${gen1Input.name} with rarity lv: ${gen1Input.rarity} got gen2, tokenId: ${gen2Output.name} with rarity lv: ${gen2Output.rarity} type [${gen1Input.body}, ${gen2Output.body}] \n ipfs ${gen2Output.ipfs}\n`
    );
  }
  await markUsedGen1(gen1Input.name);
  await markUsedGen2(gen2Output.name);
  return gen2Output;
};

const getGen2FromGen1RarityAndSerumLv2 = async (rarity, type) => {
  switch (rarity) {
    case 1: {
      const rand = Math.floor(Math.random() * 209348) % 100;
      if (rand < 10) {
        logging(`| common + serum lv 2 | ${rand} < 10 ได้ตัว rarity lv 2\n`);
        return await getUnusedGen2OfRarity(2);
      } else {
        logging(
          `| common + serum lv 2 | ${rand} > 10 ได้ตัว rarity lv 1 สีขนตรงกัน\n`
        );
        return await getUnusedGen2OfType(type);
      }
      break;
    }
    case 2: {
      //this will be 2 or 3
      logging(`| rare + serum lv 2 |  ได้ตัว rarity lv 2 or 3\n`);
      return await getUnusedGen2OfRarityRange([rarity, rarity + 1]);
      break;
    }
    case 3: {
      logging(`| super + serum lv 2 |  ได้ตัว rarity 3\n`);
      return await getUnusedGen2OfRarity(rarity);
      break;
    }
    default: {
      return await getUnusedGen2OfRarity(rarity);
      break;
    }
  }
};

const serumLv3Algorithm = async (oppabearGen1) => {
  let gen1Input = oppabearGen1;
  let rarity = oppabearGen1.rarity;
  let gen1 = await getUnusedGen1OfRarity(rarity);
  let gen2Output = undefined;
  if (gen1Input.used) return;
  const gen2 = await getGen2FromGen1RarityAndSerumLv3(rarity, gen1Input.body);
  if (gen2.length <= 0) {
    gen2Output = await getOneRandom();
    if (gen2Output == undefined) return;
    logging(
      `| ไม่มี type ที่ตรงกันแล้ว | tokenId: ${gen1Input.name} with rarity lv: ${gen1Input.rarity} หา type ตรงกันไม่ได้ random อะไรก็ได้ 1 ตัว, ได้ gen2 tokenId: ${gen2Output.name} with rarity lv: ${gen2Output.rarity} \n ipfs: ${gen2Output.ipfs}\n`
    );
  } else {
    const { indexOfGen2 } = getGen2ComparedIndex(gen1, gen2, gen1Input);
    gen2Output = gen2[indexOfGen2];
    logging(
      `| random ปกติ | tokenId: ${gen1Input.name} with rarity lv: ${gen1Input.rarity} got gen2, tokenId: ${gen2Output.name} with rarity lv: ${gen2Output.rarity} type [${gen1Input.body}, ${gen2Output.body}] \n ipfs ${gen2Output.ipfs}\n`
    );
  }
  await markUsedGen1(gen1Input.name);
  await markUsedGen2(gen2Output.name);
  return gen2Output;
};
const getGen2FromGen1RarityAndSerumLv3 = async (rarity, type) => {
  switch (rarity) {
    case 1: {
      const rand = Math.floor(Math.random() * 882394381) % 1000;
      if (rand < 50) {
        logging(
          `| common + serum lv 3 | ${rand} < 50 ได้ตัว rarity lv 3 (super rare)\n`
        );
        return await getUnusedGen2OfRarity(3);
      } else if (rand < 500) {
        logging(
          `| common + serum lv 3 | ${rand} < 500 ได้ตัว rarity lv 2 (rare)\n`
        );
        return await getUnusedGen2OfRarity(2);
      } else {
        logging(
          `| common + serum lv 3 | ${rand} > 500 ได้ตัว rarity lv 1 สีขนตรงกัน\n`
        );
        return await getUnusedGen2OfType(type);
      }
      // const decidedRarity = random < 10 ? rarity + 1 : rarity;
      // logging(
      //   `| level 1 ใช้ serum 3 | random number < 10 ? ${random} [${
      //     random < 10
      //   }] ->  mint สูงสุดได้ที่ระดับ lv ${decidedRarity} - ${rarity + 1}\n`
      // );
      // return await getUnusedGen2OfRarityRange([decidedRarity, rarity + 1]);
      break;
    }
    case 2: {
      const rand = Math.floor(Math.random() * 882394381) % 1000;
      const decidedRarity = rand < 10 ? rarity + 1 : rarity;
      logging(
        `| rare + serum lv 3 | random number < 10 ? ${rand} [${
          rand < 10
        }] ->  mint สูงสุดได้ที่ระดับ lv ${decidedRarity} or ${rarity + 1}\n`
      );
      return await getUnusedGen2OfRarityRange([decidedRarity, rarity + 1]);
      break;
    }
    case 3: {
      logging(`| super rare + serum lv 3 |  ได้ตัว rarity lv 2 or 3\n`);
      return await getUnusedGen2OfRarity(rarity);
      break;
    }
    default: {
      return await getUnusedGen2OfRarity(rarity);
      break;
    }
  }
};

const getGen2ComparedIndex = (gen1, gen2, gen1Input, mul = 1) => {
  const indexOfGen1 = gen1.map((g) => g.name).indexOf(gen1Input.name);
  const indexOfGen2 = Math.floor(
    (gen2.length * (indexOfGen1 * mul)) / gen1.length
  );
  return {
    indexOfGen1,
    indexOfGen2,
  };
};

const getOneRandom = async () => {
  let gen2 = await getAllUnusedGen2();
  let len = gen2.length;
  let randPos = Math.floor(Math.random() * 998811) % len;
  return gen2[randPos];
};

const runV2 = async (oppaTokenId, serum) => {
  let gen1Input = await getGen1ById(oppaTokenId);
  let gen2Output = null;
  let mintedOut = (await getAllUnusedGen2()).length <= 0;
  //TODO: detect MINTED OUT and return
  if (mintedOut) {
    return "MINTED_OUT";
  }

  if (gen1Input.rarity == 4) return;

  switch (serum) {
    case 1:
      logging(`=== oppatoken ${oppaTokenId} : with serum ${serum} ===\n`);
      gen2Output = await serumLv1Algorithm(gen1Input);
      if (gen2Output) {
        return gen2Output.ipfs;
      }
      break;
    case 2:
      logging(`=== oppatoken ${oppaTokenId} : with serum ${serum} ===\n`);
      gen2Output = await serumLv2Algorithm(gen1Input);
      if (gen2Output) {
        return gen2Output.ipfs;
      }
      break;
    case 3:
      logging(`=== oppatoken ${oppaTokenId} : with serum ${serum} ===\n`);
      gen2Output = await serumLv3Algorithm(gen1Input);
      if (gen2Output) {
        return gen2Output.ipfs;
      }
  }
};

// const testV2 = async () => {
//   let len = 1501;
//   let serumV2 = [1, 2, 3];
//   let maxSerum = [600, 300, 100];
//   let lv1Count = 0;
//   let lv2Count = 0;
//   let lv3Count = 0;
//   let total = 1000;
//   let now = 0;
//   let tokenId = 1;
//   while (now < total) {
//     console.log("round: ", now);
//     let rand = Math.floor(Math.random() * 9999 + lv1Count) % 3;
//     if (rand == 0 && lv1Count < maxSerum[0]) {
//       lv1Count++;
//       await runV2(tokenId, serumV2[0]);
//       tokenId++;
//     } else if (rand == 1 && lv2Count < maxSerum[1]) {
//       lv2Count++;
//       await runV2(tokenId, serumV2[1]);
//       tokenId++;
//     } else if (rand == 2 && lv3Count < maxSerum[2]) {
//       lv3Count++;
//       await runV2(tokenId, serumV2[2]);
//       tokenId++;
//     } else {
//       tokenId++;
//       lv1Count == maxSerum[0]
//         ? await runV2(tokenId, serumV2[1])
//         : await runV2(tokenId, serumV2[0]);
//       lv2Count == maxSerum[1]
//         ? await runV2(tokenId, serumV2[2])
//         : await runV2(tokenId, serumV2[1]);

//       if (lv3Count == maxSerum[2]) {
//         lv1Count == maxSerum[0]
//           ? await runV2(tokenId, serumV2[1])
//           : await runV2(tokenId, serumV2[0]);
//       }
//     }
//     now = lv1Count + lv2Count + lv3Count;
//   }
//   // for (let i = 1; i < len; i++) {

//   // }

//   const gen1Left = await getAllUnusedGen1();
//   const gen2Left = await getAllUnusedGen2();

//   logging(
//     `gen1 ที่เหลือ : ${gen1Left.length}\n
//     gen2 ที่เหลือ : ${gen2Left.length}\n
//     ใช้ serum lv 1 ไป : ${lv1Count}/${maxSerum[0]}\n
//     ใช้ serum lv 2 ไป : ${lv2Count}/${maxSerum[1]}\n
//     ใช้ serum lv 3 ไป : ${lv3Count}/${maxSerum[2]}\n`
//   );
// };

// migrate().then(() => testV2());
// migrate().then(() => console.log("migrate successfully"));

module.exports = {
  runV2,
};
