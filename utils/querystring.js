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

  injectParam(param, defaultVal = "") {
    // This method needs to be curried
    return query => {
      // Work with an actual JS object
      const q = { ...query };

      if (query[param]) return q;

      q[param] = q.user.map(() => defaultVal);
      return q;
    };
  }

  parse(str) {
    const q = qs.parse(str);

    // Make sure all required params are there in the first place
    this.checkParams(q);

    const processedQuery = this.injectParam(
      "branch",
      "master"
    )(
      Object.keys(q).reduce((acc, param) => {
        if (param === "id") {
          return { ...acc, [param]: q[param] };
        } else if (!Array.isArray(q[param])) {
          return { ...acc, [param]: [q[param]] };
        }
        return { ...acc, [param]: [...q[param]] };
      }, {})
    );

    // Make sure we have the same number of values per param
    this.checkValueLengths(processedQuery);

    return processedQuery;
  }

  checkParams(query) {
    for (const qReq of this.queryReqs) {
      if (qReq !== "branch" && !query[qReq]) {
        throw makeError(400, `Missing '${qReq}' query parameter/value pair.`);
      }
    }
  }

  checkValueLengths(query) {
    let len;
    for (const qReq of this.queryReqs) {
      const qLen = query[qReq].length;
      if (len && len !== qLen) {
        throw makeError(
          400,
          `Problem with '${qReq}'. Each query parameter must have the same amount of values.`
        );
      } else {
        len = qLen;
      }
    }
  }
}

module.exports = QueryString.build();
