describe("fix commit message", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should not change text by default", () => {
    jest.setMock("../src/config", { fixAliasedEmoji: false });
    const fixCommitMessage = require("../src/lint/fix-commit-message");
    expect(fixCommitMessage("🌠 Add feat")).toEqual(null);
  });

  it("should change text into emojis if option is provided", () => {
    jest.setMock("../src/config", { fixAliasedEmoji: true });
    const fixCommitMessage = require("../src/lint/fix-commit-message");
    expect(fixCommitMessage("🌟 Add feat")).toEqual("✨ Add feat");
  });

  it("should transform conventional commits into emoji", () => {
    jest.setMock("../src/config", { fixAliasedEmoji: true });
    const fixCommitMessage = require("../src/lint/fix-commit-message");
    expect(fixCommitMessage("fix: Correct bug")).toEqual("🐛 Correct bug");
  });

  it("should support type aliases", () => {
    jest.setMock("../src/config", {});
    const fixCommitMessage = require("../src/lint/fix-commit-message");
    expect(fixCommitMessage("doc: Add doc")).toEqual("📚 Add doc");
  });
});
