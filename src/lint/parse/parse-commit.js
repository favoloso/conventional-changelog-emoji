const parserOpts = require("../../conventional-changelog/parser-opts");
const ignoreCommit = require("./ignore-commit");
const emoji = require("../../emoji/emoji");

const SCISSOR = "# ------------------------ >8 ------------------------";

/**
 * Extracts the header (first line) of a commit message, as
 * `conventional-commits-parser` does: surrounding newlines are trimmed and
 * everything after the scissor line is ignored.
 */
function getHeader(commit) {
  if (!commit || !commit.trim()) {
    throw new TypeError("Expected a raw commit");
  }

  const lines = commit.replace(/^[\r\n]+|[\r\n]+$/g, "").split(/\r?\n/);
  const scissorIndex = lines.indexOf(SCISSOR);
  if (scissorIndex === 0) return null;

  return lines[0];
}

module.exports = function (commit) {
  if (ignoreCommit(commit)) return null;

  const header = getHeader(commit);
  const headerMatch =
    header == null ? null : header.match(parserOpts.headerPattern);
  const parsed = { header };
  parserOpts.headerCorrespondence.forEach((part, index) => {
    parsed[part] = (headerMatch && headerMatch[index + 1]) || null;
  });

  return {
    ...parsed,
    commit,
    type: emoji.findType(parsed.emoji)
  };
};
