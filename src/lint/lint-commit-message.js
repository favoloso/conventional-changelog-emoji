const config = require("../config/config");
const linter = require("./rules/shared/linter");
const onlyKnown = require("./rules/only-known");

const rules = [onlyKnown];

/**
 * Lint a commit message following project configuration.
 * Returns list of errors.
 */
module.exports = function lintCommitMessage(message) {
  if (!message) return null;

  // Apply Linters
  const exceptions = rules
    .map(rule => {
      const result = rule.rule(
        linter.resolveRuleOptions(config, rule.name),
        message
      );
      return result == null ? null : { ...result, rule: rule.name };
    })
    .filter(exception => exception != null);

  const errors = exceptions.filter(e => e.severity === linter.Severity.error);
  return errors;

  // if (errors.length > 0) {
  //   throw new Error(
  //     `Commit does not match required rules:\n\n${errors
  //       .map(e => `- ${e.message}`)
  //       .join("\n")}`
  //   );
  // }
};
