const config = require("../config/config");
const parseCommit = require("./parse/parse-commit");
const linter = require("./rules/shared/linter");
const translator = require("../translation/translator")();
const formatLintIssues = require("./format/format-lint-issues");

const rules = [
  require("./rules/emoji-from-type"),
  require("./rules/emoji-require"),
  require("./rules/emoji-known"),
  require("./rules/spaces-between"),
  require("./rules/header-full-stop"),
  require("./rules/header-max-length"),
  require("./rules/subject-case"),
  require("./rules/subject-require"),
  require("./rules/body-leading-blank")
];

/**
 * Lint a commit message following project configuration.
 * Returns list of errors.
 */

function lintCommitMessage(commit) {
  if (!commit) {
    throw new Error('You should pass a message to "lintCommitMessage".');
  }

  // Parse and ignore if `parseCommit` ignores the commit.
  let tokens = parseCommit(commit);
  if (tokens == null) {
    return {
      errors: [],
      commit,
      changed: false
    };
  }

  // console.log(tokens);

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
        // console.log(
        //   `[${rule.name}] Replace commit "${result.commit}" with "${partial}"`
        // );
        result.commit = partial;
        tokens = parseCommit(result.commit);
        return result;
      }

      // An error occurred.
      result.errors.push({
        message: translator.translateRule(rule.name, ...partial.args),
        severity: options.severity,
        rule: rule.name
      });
      return result;
    },
    {
      commit,
      errors: []
    }
  );

  return {
    errors: linted.errors,
    commit: linted.commit,
    changed: linted.commit !== commit
  };
}

/**
 * Lints the commit and throws if errors are found.
 */
function lintCommitMessageOrThrow(commit) {
  const linted = lintCommitMessage(commit);

  const formatted = formatLintIssues(linted) + "\n";
  if (linted.errors.length > 0) {
    throw new Error(formatted);
  }

  process.stdout.write(formatted);
  return linted;
}

module.exports = {
  lintCommitMessage,
  lintCommitMessageOrThrow
};
