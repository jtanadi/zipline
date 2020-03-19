const archiver = require("archiver");
const { send } = require("micro");

const qs = require("./utils/querystring");
const makeError = require("./utils/makeError");
const fetchAndZip = require("./utils/fetchAndZip");
const getDateTime = require("./utils/getDateTime");

module.exports = async (req, res) => {
  try {
    if (req.method !== "GET") {
      throw makeError(400, "Only 'GET' is supported.");
    }

    const [baseURL, qString] = req.url.split("?");
    if (baseURL !== "/get") {
      throw makeError(
        404,
        `Endpoint '${baseURL}' unavailable. Must use '/get'.`
      );
    } else if (!qString) {
      throw makeError(400, "Must pass in query string.");
    }

    // Will throw Error if check fails
    const query = qs.parse(qString);
    const { user, repo, branch, file, id } = query;

    const fileID = id || getDateTime();
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=download-${fileID}.zip`
    );

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    for (let i = 0; i < user.length; i++) {
      const _user = user[i];
      const _repo = repo[i];
      const _branch = branch[i];
      const _file = file[i];
      const url = `https://raw.githubusercontent.com/${_user}/${_repo}/${_branch}/${_file}`;
      await fetchAndZip(url, archive, _file);
    }

    archive.finalize();
  } catch (e) {
    res.setHeader("Content-Type", "application/json");
    send(res, e.statusCode, e.message);
  }
};
