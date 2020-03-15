const getDateTime = require("./utils/getDateTime");

module.exports = {
  queryRequirements: ["user", "repo", "file"],
  downloadFileName: `download-${getDateTime()}.zip`
};
