"use strict";

const emojiRegex = require("emoji-regex/text")();
const emoji = require("../emoji/emoji");

const pattern = new RegExp(`^(${emojiRegex.source})(\\s*)(.*)$`);

module.exports = {
  headerPattern: pattern,
  headerCorrespondence: ["emoji", "spaces", "subject"],
  noteKeywords: [
    "BREAKING CHANGE",
    "BREAKING CHANGES",
    ...emoji.breakingEmojis
  ],
  revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
  revertCorrespondence: ["header", "hash"]
};
