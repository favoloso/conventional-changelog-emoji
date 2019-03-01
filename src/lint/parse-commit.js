const conventionalCommitsParser = require("conventional-commits-parser");
const parserOpts = require("../conventional-changelog/parser-opts");
const emoji = require("../emoji/emoji");

module.exports = function(commit) {
  const parsed = conventionalCommitsParser.sync(commit, {
    ...parserOpts,
    warn: console.warn.bind(console)
  });

  return {
    ...parsed,
    commit
  };
};
