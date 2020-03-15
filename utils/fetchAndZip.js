const https = require("https");

module.exports = (url, zipArchive, fileName) => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, res => {
      if (res.statusCode && res.statusCode === 200) {
        zipArchive.append(res, { name: fileName });
        zipArchive.on("entry", () => {
          resolve(fileName);
        });
      } else {
        resolve();
      }
    });

    req.on("error", err => {
      reject(err);
    });

    req.end();
  });
};
