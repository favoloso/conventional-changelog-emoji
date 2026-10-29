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
  // Keywords may be followed by `:` or by spaces only (i.e. `🚨 Breaking`)
  notesPattern: keywords =>
    new RegExp(`^[\\s|*]*(${keywords})[:\\s]+(.*)`, "i"),
  revertPattern: /^(R|r)evert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
  revertCorrespondence: ["header", "hash"]
};
