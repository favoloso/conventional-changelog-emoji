"use strict";
const fs = require("fs");
const path = require("path");
const emoji = require("./emoji");

const parserOpts = require("./parser-opts");

module.exports = {
  whatBump: commits => {
    let level = 2;
    let breakings = 0;
    let features = 0;

    commits.forEach(commit => {
      if (commit.notes.length > 0) {
        breakings += commit.notes.length;
        level = 0;
      } else if (
        commit.emoji &&
        emoji.featureEmojis.some(emoji => emoji === commit.emoji)
      ) {
        features += 1;
        if (level === 2) {
          level = 1;
        }
      }
    });

    return {
      level: level,
      reason: `There are ${breakings} breaking changes and ${features} features`
    };
  },

  parserOpts: parserOpts
};
