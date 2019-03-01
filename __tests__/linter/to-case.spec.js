const toCase = require("../../src/lint/rules/shared/to-case");

describe("toCase helper", () => {
  it("upper-case", () => {
    expect(toCase("upper-case", "abc! ✨ StRanGe")).toEqual("ABC! ✨ STRANGE");
  });

  it("lower-case", () => {
    expect(toCase("lower-case", "ABc! Demo")).toEqual("abc! demo");
  });

  it("sentence-case", () => {
    expect(toCase("sentence-case", "let 🎉 it go demo")).toEqual(
      "Let 🎉 it go demo"
    );
  });

  it("should throw on unknown case", () => {
    expect(() => toCase("abc-case", "Hello!")).toThrow();
  });
});
