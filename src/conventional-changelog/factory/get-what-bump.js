"use strict";
const versionUtils = require("../../utils/version-utils");
const config = require("../../config/config");
const emoji = require("../../emoji/emoji");

/**
 * Factory to build conventional-recommended-bump `whatBump`,
 * given semver `tags` (most recent first).
 */
module.exports = function getWhatBump(tags) {
  // See Semver initial development spec (0.x.x): https://semver.org/#spec-item-4
  const isInitialDevelopment =
    tags.length === 0 || versionUtils.isInitialDevelopment(tags[0]);

  const breakingLevel =
    isInitialDevelopment && config.minorForBreakingInDevelopment ? 1 : 0;

  return commits => {
    let level = 2;
    let breakings = 0;
    let features = 0;

    commits.forEach(commit => {
      // Breaking changes in commit notes
      if (commit.notes.length > 0) {
        breakings += commit.notes.length;
        level = breakingLevel;
      }
      // Breaking changes in commit message (emoji)
      else if (emoji.hasEmoji(emoji.breakingEmojis, commit.emoji)) {
        breakings += 1;
        level = breakingLevel;
      }
      // Feature commit
      else if (emoji.hasEmoji(emoji.featureEmojis, commit.emoji)) {
        features += 1;
        if (level === 2) {
          level = 1;
        }
      }
    });

    return {
      tag: tags ? tags[0] : "<none>",
      level: level,
      reason: `There are ${breakings} breaking changes and ${features} features.${
        isInitialDevelopment && config.minorForBreakingInDevelopment
          ? " Breaking changes will be minor due to `minorForBreakingInDevelopment`."
          : ""
      }`
    };
  };
};
