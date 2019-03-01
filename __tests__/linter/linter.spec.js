const shell = require("shelljs");
const fs = require("fs");
const path = require("path");
const process = require("process");
const formatLintIssues = require("../../src/lint/format/format-lint-issues");

function setLintRules(rules) {
  const config = require("../../src/config/config-default");
  jest.setMock("../../src/config/config", {
    ...config,
    rules: { ...config.rules, ...rules }
  });
}

function lint(message) {
  const lintCommitMessage = require("../../src/lint/lint-commit-message")
    .lintCommitMessage;
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

  it("should throw if rules are violated", () => {
    const lintCommitMessageOrThrow = require("../../src/lint/lint-commit-message")
      .lintCommitMessageOrThrow;
    setLintRules({ "emoji-require": true });
    expect(() => lintCommitMessageOrThrow("doca: Aaaa")).toThrow();
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
      setLintRules({
        "emoji-from-type": false,
        "emoji-require": false,
        "subject-require": false
      });
      expect(lint("docxx: Add doc").errors).toHaveLength(0);
    });
  });

  describe("emoji-require", () => {
    it("should require an emoji to be set", () => {
      setLintRules({ "emoji-require": true });
      expect(lint("lol Emoji!")).toHaveError("emoji-require");
      expect(lint("🛠 Emoji!")).not.toHaveError("emoji-require");
      expect(lint("fix: Emoji!")).not.toHaveError("emoji-require");
    });
  });

  describe("spaces-between", () => {
    it("should remove multiples spaces between emoji and commit", () => {
      setLintRules();
      expect(lint("🛠   Add doc")).toHaveCommit("🛠 Add doc");
    });
  });

  describe("header-max-length", () => {
    it("should throw if max length is exceeded", () => {
      setLintRules({ "header-max-length": [2, { max: 10 }] });
      expect(lint("🛠 123445678910")).toHaveError("header-max-length");
    });

    it("should not throw if max length is respected", () => {
      setLintRules({ "header-max-length": [2, { max: 20 }] });
      expect(lint("🛠 123445678910")).not.toHaveError("header-max-length");
    });
  });

  describe("header-full-stop", () => {
    it("should add full stop if not present", () => {
      setLintRules({ "header-full-stop": true });
      expect(lint("🐛 Commit")).toHaveCommit("🐛 Commit.");
      expect(lint("🐛 Commit.")).toHaveCommit("🐛 Commit.");
    });

    it("should remove full stop if present", () => {
      setLintRules({ "header-full-stop": [2, { never: true }] });
      expect(lint("🐛 Commit")).toHaveCommit("🐛 Commit");
      expect(lint("🐛 Commit.")).toHaveCommit("🐛 Commit");
      expect(
        lint("🐛 Commit.\n\neven if it is on multiple lines\nHello!")
      ).toHaveCommit("🐛 Commit\n\neven if it is on multiple lines\nHello!");
    });

    it("should ignore release commits ", () => {
      setLintRules({ "header-full-stop": true });
      expect(lint("🔖 v0.1.0")).toHaveCommit("🔖 v0.1.0");
    });
  });

  describe("subject-case", () => {
    it("should correct case if wrong casing is provided", () => {
      setLintRules({ "subject-case": [2, { case: "sentence-case" }] });
      expect(lint("🛠 hello!\n\nmy commit")).toHaveCommit(
        "🛠 Hello!\n\nmy commit"
      );
      expect(lint("🔖 v0.1.0")).toHaveCommit("🔖 v0.1.0");
    });
  });

  describe("body-leading-blank", () => {
    it("should force leading blank line in body", () => {
      setLintRules({ "body-leading-blank": true });
      expect(lint("🛠 hello!\n\nmy commit")).not.toHaveError(
        "body-leading-blank"
      );
      expect(lint("🛠 hello!\nmy commit")).toHaveError("body-leading-blank");

      expect(lint("🛠 hello!")).not.toHaveError("body-leading-blank");
      expect(lint("🛠 hello!\n")).not.toHaveError("body-leading-blank");
    });

    it("should ignore leading blank line if disabled", () => {
      setLintRules({ "body-leading-blank": false });
      expect(lint("🛠 hello!\n\nmy commit")).not.toHaveError(
        "body-leading-blank"
      );
      expect(lint("🛠 hello!\nmy commit")).not.toHaveError("body-leading-blank");
      expect(lint("🛠 hello!")).not.toHaveError("body-leading-blank");
    });
  });

  describe("other kind of commits", () => {
    it("should allow merge commits", () => {
      setLintRules({
        "header-full-stop": true,
        "subject-require": true,
        "emoji-require": true
      });
      expect(
        lint("Merge branch 'master' into my-feat-branch").errors
      ).toHaveLength(0);
    });
  });

  describe("format", () => {
    it("should print errors", () => {
      setLintRules();
      const linted = lint("🌟 My magical commit\nleading?");
      expect(formatLintIssues(linted)).toMatchInlineSnapshot(`
"Commit do not lints based on your \\"emoji-commit-lint\\" rules:

• 🔴 [body-leading-blank] Body should begin with a leading blank line."
`);
    });

    it("should print warnings", () => {
      setLintRules({ "body-leading-blank": [1] });
      const linted = lint("🌟 My magical commit\nleading?");
      expect(formatLintIssues(linted)).toMatchInlineSnapshot(`
"Commit do not lints based on your \\"emoji-commit-lint\\" rules:

• ⚠️ [body-leading-blank] Body should begin with a leading blank line."
`);
    });

    it("should provide a clean success message", () => {
      setLintRules();
      const linted = lint("🐛 A fix");
      expect(formatLintIssues(linted)).toMatchInlineSnapshot(
        `"✅ No issues found in commit style"`
      );
    });
  });

  describe("cli", () => {
    it("should read HUSKY_GIT_PARAMS", () => {
      setLintRules();
      jest.spyOn(process, "exit").mockImplementationOnce(() => {});
      process.env.HUSKY_GIT_PARAMS = ".tmp_dummy_commit";
      fs.writeFileSync(".tmp_dummy_commit", "fix: Fix bug");
      require("../../src/lint/lint-commit-command")();
      expect(process.exit).toHaveBeenCalledWith(0);
      expect(fs.readFileSync(".tmp_dummy_commit", "utf8")).toEqual("🐛 Fix bug"); // prettier-ignore
      delete process.env.HUSKY_GIT_PARAMS;
    });

    it("should not write file if not changed", () => {
      setLintRules();
      fs.writeFileSync(".tmp_dummy_commit", "🐛 Fix bug");
      jest.spyOn(process, "exit").mockImplementationOnce(() => {});
      process.env.HUSKY_GIT_PARAMS = ".tmp_dummy_commit";
      require("../../src/lint/lint-commit-command")();
      expect(process.exit).toHaveBeenCalledWith(0);
      delete process.env.HUSKY_GIT_PARAMS;
    });

    it("should write error to stderr if thrown", () => {
      jest.spyOn(process, "exit").mockImplementationOnce(() => {});
      jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
        throw new Error("errfs");
      });
      require("../../src/lint/lint-commit-command")();
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
