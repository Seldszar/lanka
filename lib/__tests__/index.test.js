const lanka = require("../index");

describe("parse()", () => {
  test("returns a single word", () => {
    const result = lanka.parse("hello");
    const expected = {
      type: "signature",
      parameters: [{ type: "word", value: "hello" }],
    };

    expect(result).toEqual(expected);
  });

  test("returns a required parameter", () => {
    const result = lanka.parse("hello <name>");
    const expected = {
      type: "signature",
      parameters: [
        { type: "word", value: "hello" },
        {
          type: "argument",
          name: "name",
          required: true,
          variadic: false,
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  test("returns an optional parameter", () => {
    const result = lanka.parse("hello [name]");
    const expected = {
      type: "signature",
      parameters: [
        { type: "word", value: "hello" },
        {
          type: "argument",
          name: "name",
          required: false,
          variadic: false,
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  test("returns a required variadic parameter", () => {
    const result = lanka.parse("hello <names...>");
    const expected = {
      type: "signature",
      parameters: [
        { type: "word", value: "hello" },
        {
          type: "argument",
          name: "names",
          required: true,
          variadic: true,
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  test("returns an optional variadic parameter", () => {
    const result = lanka.parse("hello [names...]");
    const expected = {
      type: "signature",
      parameters: [
        { type: "word", value: "hello" },
        {
          type: "argument",
          name: "names",
          required: false,
          variadic: true,
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  test("throws if syntax error", () => {
    expect(() => lanka.parse("error {syntax}")).toThrow();
  });

  test("throws if parsing error", () => {
    expect(() => lanka.parse("error [invalid name]")).toThrow();
  });

  test("throws if an argument is after a variadic argument", () => {
    expect(() => lanka.parse("error <variadic...> <required>")).toThrow();
  });

  test("throws if a word is after an optional argument", () => {
    expect(() => lanka.parse("error [optional] word")).toThrow();
  });

  test("throws if a required argument is after an optional argument", () => {
    expect(() => lanka.parse("error [optional] <required>")).toThrow();
  });

  test("throws if two arguments have the same name", () => {
    expect(() => lanka.parse("error <same> [same]")).toThrow();
  });
});

describe("match()", () => {
  const signature = {
    type: "signature",
    parameters: [
      { type: "word", value: "settings" },
      {
        type: "argument",
        name: "key",
        required: true,
        variadic: false,
      },
      {
        type: "argument",
        name: "value",
        required: false,
        variadic: false,
      },
      {
        type: "argument",
        name: "flags",
        required: false,
        variadic: true,
      },
    ],
  };

  test("returns `null` if not matching the signature", () => {
    const argv = { _: ["hello"] };
    const expected = null;

    expect(lanka.match(signature, argv)).toEqual(expected);
  });

  test("returns `null` if no required argument", () => {
    const argv = { _: ["settings"] };
    const expected = null;

    expect(lanka.match(signature, argv)).toEqual(expected);
  });

  test("returns the `key` argument", () => {
    const argv = { _: ["settings", "username"] };
    const expected = {
      key: "username",
    };

    expect(lanka.match(signature, argv)).toEqual(expected);
  });

  test("returns the `value` argument", () => {
    const argv = { _: ["settings", "username", "seldszar"] };
    const expected = {
      key: "username",
      value: "seldszar",
    };

    expect(lanka.match(signature, argv)).toEqual(expected);
  });

  test("returns the `flags` argument", () => {
    const argv = { _: ["settings", "username", "seldszar", "space", "ninja"] };
    const expected = {
      key: "username",
      value: "seldszar",
      flags: ["space", "ninja"],
    };

    expect(lanka.match(signature, argv)).toEqual(expected);
  });
});
