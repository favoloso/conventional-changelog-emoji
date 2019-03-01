const shell = require("shelljs");
const fs = require("fs");
const path = require("path");
const process = require("process");

function setLintRules(rules) {
  const config = require("../../src/config/config-default");
  jest.setMock("../../src/config/config", {
    ...config,
    rules: { ...config.rules, ...rules }
  });
}

function lint(message) {
  const lintCommitMessage = require("../../src/lint/lint-commit-message");
  return lintCommitMessage(message);
}

expect.extend({
  toHaveError(received, expected) {
    if (this.isNot) {
      expect(received.errors).not.toContainEqual(
        expect.objectContaining({ rule: expected })
      );
    } else {
      expect(received.errors).toContainEqual(
        expect.objectContaining({ rule: expected })
      );
    }

    return { pass: !this.isNot };
  },
  toHaveCommit(received, expected) {
    if (this.isNot) {
      expect(received.commit).not.toEqual(expected);
    } else {
      expect(received.commit).toEqual(expected);
      expect(received.errors).toHaveLength(0);
    }

    return { pass: !this.isNot };
  }
});

describe("linter", () => {
  beforeEach(() => {
    const root = path.resolve(__dirname, "..", "..");
    shell.cd(root);
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
    shell.rm("-f", ".tmp_dummy_commit");
  });

  it("should requires a message", () => {
    setLintRules();
    expect(() => lint()).toThrow();
  });

  describe("config", () => {
    it("should require options configured", () => {
      const linter = require("../../src/lint/rules/shared/linter");
      expect(() => linter.resolveRuleOptions({}, "emoji-from-type")).toThrow();
    });
  });

  describe("emoji-known", () => {
    it("should replace emoji with base one by default", () => {
      setLintRules();
      expect(lint("🌟 Add feat")).toHaveCommit("✨ Add feat");
    });

    it("should throw if emoji is not allowed", () => {
      setLintRules();
      expect(lint("📽 Add feat")).toHaveError("emoji-known");
    });

    it("should not replace aliased emoji if disabled", () => {
      setLintRules({ "emoji-known": [2, { disallowAliases: true }] });
      expect(lint("🌠 Add feat")).toHaveCommit("🌠 Add feat");
    });

    it("should allow different style of commit", () => {
      setLintRules();
      expect(lint("fix: fix it")).not.toHaveError("emoji-known");
    });
  });

  describe("emoji-from-type", () => {
    it("should throw error if type alias not recognized", () => {
      expect(lint("fixa: Add feat")).toHaveError("emoji-from-type");
    });

    it("should transform conventional commits into emoji", () => {
      setLintRules();
      expect(lint("fix: Correct bug")).toHaveCommit("🐛 Correct bug");
    });

    it("should support type aliases", () => {
      setLintRules();
      expect(lint("doc: Add doc")).toHaveCommit("📚 Add doc");
    });

    it("should ignore unrecognized type aliases if disabled", () => {
      setLintRules({ "emoji-from-type": false });
      expect(lint("docxx: Add doc").errors).toHaveLength(0);
    });
  });

  describe("spaces-between", () => {
    it("should remove multiples spaces between emoji and commit", () => {
      setLintRules();
      expect(lint("🛠   Add doc")).toHaveCommit("🛠 Add doc");
    });
  });

  describe("cli", () => {
    it("should read HUSKY_GIT_PARAMS", () => {
      setLintRules();
      jest.spyOn(process, "exit").mockImplementation(() => {});
      process.env.HUSKY_GIT_PARAMS = ".tmp_dummy_commit";
      fs.writeFileSync(".tmp_dummy_commit", "fix: Fix bug");
      require("../../src/lint/fix-commit-command")();
      expect(process.exit).toHaveBeenCalledWith(0);
      expect(fs.readFileSync(".tmp_dummy_commit", "utf8")).toEqual("🐛 Fix bug"); // prettier-ignore
      delete process.env.HUSKY_GIT_PARAMS;
    });

    it("should not write file if not changed", () => {
      setLintRules();
      fs.writeFileSync(".tmp_dummy_commit", "🐛 Fix bug");
      jest.spyOn(process, "exit").mockName("exit");
      process.env.HUSKY_GIT_PARAMS = ".tmp_dummy_commit";
      require("../../src/lint/fix-commit-command")();
      expect(process.exit).toHaveBeenCalledWith(0);
      delete process.env.HUSKY_GIT_PARAMS;
    });

    it("should write error to stderr if thrown", () => {
      jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
        throw new Error("errfs");
      });
      require("../../src/lint/fix-commit-command")();
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
