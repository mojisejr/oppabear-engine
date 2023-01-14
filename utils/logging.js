const fs = require("fs");
module.exports.logging = (msg) => {
  fs.appendFileSync(`logs.txt`, msg);
};
