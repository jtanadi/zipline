const qs = require("../utils/querystring");
const makeError = require("../utils/makeError");

describe("QueryString class", () => {
  test("parse() returns expected object", () => {
    const queryString =
      "user=john&repo=johns_repo&file=myfile.txt&user=jane&repo=janes_repo&file=yourfile.txt";
    const parsed = qs.parse(queryString);

    const expected = {
      user: ["john", "jane"],
      repo: ["johns_repo", "janes_repo"],
      file: ["myfile.txt", "yourfile.txt"],
      branch: ["master", "master"]
    };

    expect(parsed).toEqual(expected);
  });

  test("injectParam() injects parameter and value", () => {
    const inject = qs.injectParam("someParam", "someValue");

    const query = {
      user: ["john", "jane"],
      repo: ["johns_repo", "janes_repo"],
      file: ["myfile.txt", "yourfile.txt"]
    };

    const injected = inject(query);

    const expected = {
      ...query,
      someParam: ["someValue", "someValue"]
    };

    expect(injected).toEqual(expected);
  });

  test("parse() throws error when params have different lengths", () => {
    const queryString = "user=bob&repo=myrepo&file=myfile&user=jane";

    expect(() => {
      qs.parse(queryString);
    }).toThrow();
  });

  test("parse() throws error when required params are missing", () => {
    const queryString = "user=bob";

    expect(() => {
      qs.parse(queryString);
    }).toThrow();
  });
});
