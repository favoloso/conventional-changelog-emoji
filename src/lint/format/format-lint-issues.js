const linter = require("../rules/shared/linter");

function formatIssue(issue) {
  switch (issue.severity) {
    case linter.Severity.error:
      return `• 🔴 [${issue.rule}] ${issue.message}`;

    case linter.Severity.warn:
      return `• ⚠️ [${issue.rule}] ${issue.message}`;
  }
}

module.exports = function formatLintIssues(linted) {
  if (linted.errors.length === 0) {
    return `✅ No issues found in commit style`;
  }

  return (
    `Commit do not lints based on your "emoji-commit-lint" rules:\n\n` +
    linted.errors.map(formatIssue).join("\n")
  );
};
