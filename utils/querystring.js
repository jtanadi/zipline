const qs = require("querystring");

const makeError = require("./makeError");
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

  injectProp(key, defaultVal = "") {
    // This method needs to be curried
    return query => {
      // Work with an actual JS object
      const q = { ...query };

      if (query[key]) return q;

      // Use arbitrary key as counter
      const k = Object.keys(q)[0];
      q[key] = q[k].map(() => defaultVal);
      return q;
    };
  }

  parse(str) {
    const q = qs.parse(str);

    // Make sure all required keys are there in the first place
    this.checkKeys(q);

    const processedQuery = this.injectProp(
      "branch",
      "master"
    )(
      Object.keys(q).reduce((acc, key) => {
        if (key === "time") {
          return { ...acc, time };
        } else if (!Array.isArray(q[key])) {
          return { ...acc, [key]: [q[key]] };
        }
        return { ...acc, [key]: [...q[key]] };
      }, {})
    );

    // Make sure we have the same number of values per key
    this.checkValueLenghts(processedQuery);

    return processedQuery;
  }

  checkKeys(query) {
    for (const qReq of this.queryReqs) {
      if (qReq !== "branch" && !query[qReq]) {
        throw makeError(400, `Missing '${qReq}' query key/value pair.`);
      }
    }
  }

  checkValueLenghts(query) {
    let len;
    for (const qReq of this.queryReqs) {
      const qLen = query[qReq].length;
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
