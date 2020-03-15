const https = require("https");
const makeError = require("./makeError");

module.exports = (url, zipArchive, fileName) => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, res => {
      if (res.statusCode !== 200) {
        zipArchive.append(`Error ${res.statusCode} downloading from ${url}`, {
          name: fileName
        });
      } else {
        zipArchive.append(res, { name: fileName });
      }

      zipArchive.on("entry", () => {
        resolve(fileName);
      });

      zipArchive.on("warning", e => {
        if (e.code === "ENOENT") {
          console.err(e);
        } else {
          throw makeError(500, e);
        }
      });

      zipArchive.on("error", e => {
        throw makeError(500, e);
      });
    });

    req.on("error", err => {
      reject(err);
    });

    req.end();
  });
};
