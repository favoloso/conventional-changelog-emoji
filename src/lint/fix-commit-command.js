const fs = require("fs");
const lintCommitMessage = require("./lint-commit-message");

module.exports = function fixCommitCommand() {
  try {
    // const message = fixCommitMessage(
    //   fs.readFileSync(process.env.HUSKY_GIT_PARAMS, "utf8")
    // );
    const linted = lintCommitMessage(
      fs.readFileSync(process.env.HUSKY_GIT_PARAMS, "utf8")
    );

    if (linted.changed) {
      fs.writeFileSync(process.env.HUSKY_GIT_PARAMS, linted.commit, {
        encoding: "utf8"
      });
    }

    process.exit(0);
  } catch (err) {
    process.stderr.write(err);
    process.exit(1);
  }
};
