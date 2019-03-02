const emojiRegex = require("emoji-regex")();
const translator = require("../../translation/translator")();

/**
 * Order groups by emoji configuration.
 */
module.exports = function commitGroupsSort(commitGroup, otherCommitGroup) {
  const group = translator.findGroupByHeading(commitGroup.title); //emoji.list.find(g => g.heading === commitGroup.title);
  const other = translator.findGroupByHeading(otherCommitGroup.title); // emoji.list.find(g => g.heading === otherCommitGroup.title);

  return group.index === other.index
    ? group.heading
        .replace(emojiRegex, "")
        .localeCompare(other.heading.replace(emojiRegex, ""), {
          sensitivity: "base",
          usage: "sort"
        })
    : group.index - other.index;
};
