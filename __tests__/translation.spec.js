function translator() {
  return require("../src/translation/translator")();
}

function setConfig(other) {
  const config = require("../src/config/config-default");
  jest.setMock("../src/config/config", {
    ...config,
    ...other
  });
}

describe("translator", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should throw if language is not found", () => {
    setConfig({ language: "xyz-hello" });
    expect(() => translator().translateRule("abc")).toThrowError(
      /^Language "xyz-hello" is not available\./
    );
  });

  describe("linter rules", () => {
    it("should translate correctly in english", () => {
      setConfig({ language: "en" });
      expect(
        translator().translateRule("body-leading-blank")
      ).toMatchInlineSnapshot(`"Body should begin with a leading blank line."`);
    });

    it("should translate in another language", () => {
      setConfig({ language: "it" });
      expect(
        translator().translateRule("body-leading-blank")
      ).toMatchInlineSnapshot(
        `"Il <body> del commit deve iniziare con una nuova linea (\\\\n)"`
      );
    });

    it("should replace arguments", () => {
      expect(
        translator().translateRule("emoji-from-type", "fi", "fix, feat")
      ).toMatchInlineSnapshot(
        `"Il tipo \\"fi\\" non è permesso. Deve essere uno fra: fix, feat."`
      );
    });
  });
});
