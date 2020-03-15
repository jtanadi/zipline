const archiver = require("archiver");
const { send } = require("micro");

const { downloadFileName } = require("./config");
const qs = require("./utils/querystring");
const makeError = require("./utils/makeError");
const fetchAndZip = require("./utils/fetchAndZip");

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${downloadFileName}`
  );

  try {
    if (req.method !== "GET") {
      throw makeError(400, "Only 'GET' is supported.");
    }

    // Will throw Error if check fails
    const query = qs.parse(req.url.split("?")[1]);

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    for (let i = 0; i < query["user"].length; i++) {
      const user = query["user"][i];
      const repo = query["repo"][i];
      const file = query["file"][i];
      const url = `https://raw.githubusercontent.com/${user}/${repo}/master/${file}`;
      await fetchAndZip(url, archive, file);
    }
    archive.finalize();
  } catch (e) {
    send(res, e.statusCode, e.message);
  }
};
