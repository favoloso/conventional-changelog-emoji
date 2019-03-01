const fs = require("fs");
const lintCommitMessageOrThrow = require("./lint-commit-message")
  .lintCommitMessageOrThrow;

module.exports = function lintCommitCommand() {
  try {
    const linted = lintCommitMessageOrThrow(
      fs.readFileSync(process.env.HUSKY_GIT_PARAMS, "utf8")
    );

    if (linted.changed) {
      fs.writeFileSync(process.env.HUSKY_GIT_PARAMS, linted.commit, {
        encoding: "utf8"
      });
    }

    process.exit(0);
  } catch (err) {
    process.stderr.write(typeof err === "object" ? err.message : err);
    process.exit(1);
  }
};
