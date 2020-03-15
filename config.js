const getDateTime = require("./utils/getDateTime");

module.exports = {
  queryRequirements: ["user", "repo", "branch", "file"],
  downloadFileName: `download-${getDateTime()}.zip`
};
