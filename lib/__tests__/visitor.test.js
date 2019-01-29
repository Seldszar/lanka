const Visitor = require("../visitor");

describe("visit()", () => {
  const visitor = new Visitor();

  test("throws if empty parameter", () => {
    const cst = {
      name: "signature",
      children: {
        parameter: [
          {
            name: "parameter",
            children: {},
          },
        ],
      },
    };

    expect(() => visitor.visit(cst)).toThrow();
  });
});
