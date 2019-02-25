const getWriterOpts = require("../src/conventional-changelog/factory/get-writer-opts");

describe("writer opts", () => {
  const opts = getWriterOpts();

  it("should allow empty repository field (without linking issues and peoples)", () => {
    expect(
      opts.transform(
        {
          emoji: "🌟",
          subject: "add feature #231 @mario",
          notes: [],
          references: []
        },
        {}
      )
    ).toHaveProperty("subject", "add feature #231 @mario");
  });
});
