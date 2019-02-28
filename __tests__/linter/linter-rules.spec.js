function lint(message) {
  const lintCommitMessage = require("../../src/lint/lint-commit-message");
  return lintCommitMessage(message);
}

expect.extend({
  toHaveError(received, expected) {
    if (this.isNot) {
      expect(received).not.toContainEqual(
        expect.objectContaining({ rule: expected })
      );
    } else {
      expect(received).toContainEqual(
        expect.objectContaining({ rule: expected })
      );
    }

    return { pass: !this.isNot };
  }
});

describe("linter rules", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("only-known", () => {
    it("should not allow an unknown emoji", () => {
      expect(lint("📽 cinema!")).toHaveError("only-known");
    });

    it("should allow normal emoji", () => {
      expect(lint("🐛 fix it")).not.toHaveError("only-known");
    });

    it("should allow emoji aliases", () => {
      expect(lint("🐞 fix it")).not.toHaveError("only-known");
    });

    it("should allow different style of commit", () => {
      expect(lint("fix: fix it")).not.toHaveError("only-known");
    });
  });
});
