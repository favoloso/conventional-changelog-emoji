const shell = require("shelljs");
const fs = require("fs");
const path = require("path");
const process = require("process");

describe("fix commit message", () => {
  beforeEach(() => {
    const root = path.resolve(__dirname, "..");
    shell.cd(root);
    jest.resetModules();
  });

  afterEach(() => {
    shell.rm("-f", ".tmp_dummy_commit");
  });

  it("should not change text by default", () => {
    jest.setMock("../src/config/config", { fixAliasedEmoji: false });
    const fixCommitMessage = require("../src/lint/fix-commit-message");
    expect(fixCommitMessage("🌠 Add feat")).toEqual(null);
  });

  it("should change text into emojis if option is provided", () => {
    jest.setMock("../src/config/config", { fixAliasedEmoji: true });
    const fixCommitMessage = require("../src/lint/fix-commit-message");
    expect(fixCommitMessage("🌟 Add feat")).toEqual("✨ Add feat");
  });

  it("should ignore fix if not emoji-style", () => {
    jest.setMock("../src/config/config", { fixAliasedEmoji: true });
    const fixCommitMessage = require("../src/lint/fix-commit-message");
    expect(fixCommitMessage("fixa: Add feat")).toBeNull();
  });

  it("should transform conventional commits into emoji", () => {
    jest.setMock("../src/config/config", { fixAliasedEmoji: true });
    const fixCommitMessage = require("../src/lint/fix-commit-message");
    expect(fixCommitMessage("fix: Correct bug")).toEqual("🐛 Correct bug");
  });

  it("should support type aliases", () => {
    jest.setMock("../src/config/config", {});
    const fixCommitMessage = require("../src/lint/fix-commit-message");
    expect(fixCommitMessage("doc: Add doc")).toEqual("📚 Add doc");
  });

  it("should ignore unrecognized type aliases", () => {
    jest.setMock("../src/config/config", {});
    const fixCommitMessage = require("../src/lint/fix-commit-message");
    expect(fixCommitMessage("docxx: Add doc")).toBeNull();
  });

  describe("cli", () => {
    it("should read HUSKY_GIT_PARAMS", () => {
      jest.spyOn(process, "exit").mockImplementation(() => {});
      process.env.HUSKY_GIT_PARAMS = ".tmp_dummy_commit";
      fs.writeFileSync(".tmp_dummy_commit", "fix: Fix bug");
      require("../src/lint/fix-commit-command")();
      expect(process.exit).toHaveBeenCalledWith(0);
      expect(fs.readFileSync(".tmp_dummy_commit", "utf8")).toEqual("🐛 Fix bug"); // prettier-ignore
      delete process.env.HUSKY_GIT_PARAMS;
    });

    it("should write error to stderr if thrown", () => {
      jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
        throw new Error("errfs");
      });
      require("../src/lint/fix-commit-command")();
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
