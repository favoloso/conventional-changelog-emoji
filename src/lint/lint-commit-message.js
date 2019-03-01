const config = require("../config/config");
const parseCommit = require("./parse-commit");
const linter = require("./rules/shared/linter");

const rules = [
  require("./rules/emoji-from-type"),
  require("./rules/emoji-known"),
  require("./rules/spaces-between"),
  require("./rules/subject-case")
];

/**
 * Lint a commit message following project configuration.
 * Returns list of errors.
 */
module.exports = function lintCommitMessage(commit) {
  if (!commit) {
    throw new Error('You should pass a message to "lintCommitMessage".');
  }

  // Parse
  let tokens = parseCommit(commit);

  // Apply Linters
  const linted = rules.reduce(
    (result, rule) => {
      const options = linter.resolveRuleOptions(config, rule);

      // Skip.
      if (options.severity === linter.Severity.ignore) return result;

      const partial = rule.rule({}, options, tokens);

      // No results, everything's fine.
      if (partial == null) return result;

      // Replace commit (fixed).
      if (typeof partial === "string") {
        console.log(
          `[${rule.name}] Replace commit "${result.commit}" with "${partial}"`
        );
        result.commit = partial;
        tokens = parseCommit(result.commit);
        return result;
      }

      // An error occurred.
      result.lints.push({ ...partial, rule: rule.name });
      return result;
    },
    {
      commit,
      lints: []
    }
  );

  const errors = linted.lints.filter(e => e.severity === linter.Severity.error);
  return {
    errors,
    commit: linted.commit,
    changed: linted.commit !== commit
  };

  // if (errors.length > 0) {
  //   throw new Error(
  //     `Commit does not match required rules:\n\n${errors
  //       .map(e => `- ${e.message}`)
  //       .join("\n")}`
  //   );
  // }
};
