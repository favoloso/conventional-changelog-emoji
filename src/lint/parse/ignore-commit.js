const emoji = require("../../emoji/emoji");

/**
 * Thanks to @commitlint (https://github.com/conventional-changelog/commitlint)
 * for their ignore algorithm.
 * Slightly adapted to emojis.
 */
const IGNORE_COMMITS = [
  c =>
    c.match(
      /^((Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?)))(?:\r?\n)*$)/m
    ),
  c => c.match(/^(R|r)evert (.*)/),
  c => c.match(/^(fixup|squash)!/),
  c => c.startsWith(emoji.releaseEmoji),
  c => c.match(/^Merged (.*?)(in|into) (.*)/),
  c => c.match(/^Merge remote-tracking branch (.*)/),
  c => c.match(/^Automatic merge(.*)/),
  c => c.match(/^Auto-merged (.*?) into (.*)/)
];

module.exports = function ignoreCommit(commit) {
  return IGNORE_COMMITS.some(ignore => ignore(commit));
};
