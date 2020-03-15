const qs = require("querystring");
const { queryRequirements } = require("../config");

class QueryString {
  static build() {
    const customQS = new QueryString(queryRequirements);

    return new Proxy(customQS, {
      get(target, prop) {
        return target[prop] || qs[prop];
      }
    });
  }

  constructor(queryReqs) {
    this.queryReqs = queryReqs;
  }

  parse(str) {
    const q = qs.parse(str);
    const processedQuery = Object.keys(q).reduce((acc, key) => {
      if (!Array.isArray(q[key])) {
        return { ...acc, [key]: [q[key]] };
      }
      return { ...acc, [key]: [...q[key]] };
    }, {});

    this.checkQuery(processedQuery);
    return processedQuery;
  }

  checkQuery(query) {
    let len;
    for (const qReq of this.queryReqs) {
      const qLen = query[qReq].length;

      if (!query[qReq]) {
        throw makeError(400, `Missing '${qReq}' query key/value pair.`);
      }

      if (len && len !== qLen) {
        throw makeError(
          400,
          `Problem with '${qReq}'. Each query key must have the same amount of values.`
        );
      } else {
        len = qLen;
      }
    }
  }
}

module.exports = QueryString.build();
