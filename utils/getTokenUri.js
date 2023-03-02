const axios = require("axios");

async function getTokenUri(uri) {
  const cid = uri.split("ipfs://")[1];
  const url = `https://nftstorage.link/ipfs/${cid}`;
  const response = await axios.get(url);
  const data = response.data;
  const obj = {
    ...data,
    image: `https://nftstorage.link/ipfs/${data.image.split("ipfs://")[1]}`,
  };
  return obj;
}

module.exports = { getTokenUri };
