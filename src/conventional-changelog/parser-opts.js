"use strict";

const emoji = require("../emoji/emoji");

const pattern = emoji.headerRegex;

module.exports = {
  headerPattern: pattern,
  headerCorrespondence: ["emoji", "spaces", "subject"],
  noteKeywords: [
    "BREAKING CHANGE",
    "BREAKING CHANGES",
    ...emoji.breakingEmojis
  ],
  revertPattern: /^(R|r)evert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
  revertCorrespondence: ["header", "hash"]
};
