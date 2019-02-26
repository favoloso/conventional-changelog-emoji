const emojiRegex = require("emoji-regex")();
const emoji = require("../../emoji/emoji");

/**
 * Order groups by emoji configuration.
 */
module.exports = function commitGroupsSort(commitGroup, otherCommitGroup) {
  const group = emoji.list.find(g => g.heading === commitGroup.title);
  const other = emoji.list.find(g => g.heading === otherCommitGroup.title);

  return group.index === other.index
    ? group.heading
        .replace(emojiRegex, "")
        .localeCompare(other.heading.replace(emojiRegex, ""), {
          sensitivity: "base",
          usage: "sort"
        })
    : group.index - other.index;
};
