const conventionalCommitsParser = require("conventional-commits-parser");
const parserOpts = require("../../conventional-changelog/parser-opts");
const ignoreCommit = require("./ignore-commit");
const emoji = require("../../emoji/emoji");

module.exports = function(commit) {
  if (ignoreCommit(commit)) return null;

  const parsed = conventionalCommitsParser.sync(commit, {
    ...parserOpts,
    warn: console.warn.bind(console)
  });

  return {
    ...parsed,
    commit,
    type: emoji.findType(parsed.emoji)
  };
};
