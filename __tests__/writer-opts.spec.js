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

describe("writer opts transform", () => {
  const opts = getWriterOpts();

  function deepFreeze(object) {
    Object.values(object).forEach(value => {
      if (typeof value === "object" && value !== null) deepFreeze(value);
    });
    return Object.freeze(object);
  }

  it("should not modify the commit (immutable in conventional-changelog-writer v6+)", () => {
    const commit = deepFreeze({
      emoji: "🛠",
      hash: "1234567890abcdef",
      subject: "fix #12 for @mario",
      notes: [{ title: "BREAKING CHANGE", text: "xyz" }],
      references: [{ issue: "12" }, { issue: "13" }]
    });

    const transformed = opts.transform(commit, {
      host: "https://github.com",
      owner: "favoloso",
      repository: "repo"
    });

    expect(transformed).toMatchObject({
      type: "🛠️ Improvements",
      hash: "1234567",
      subject:
        "fix [#12](https://github.com/favoloso/repo/issues/12) for [@mario](https://github.com/mario)",
      notes: [{ title: "🚨 Breaking Changes", text: "xyz" }],
      references: [{ issue: "13" }]
    });
  });

  it("should skip commits without emoji or not in changelog", () => {
    const commit = { notes: [], references: [] };
    expect(opts.transform({ ...commit, emoji: null }, {})).toBeNull();
    expect(opts.transform({ ...commit, emoji: "🚧" }, {})).toBeNull();
  });
});
