const config = require("../config/config");
const aliasedEmojiFixer = require("./fixers/aliased-emoji-fixer");
const conventionalTypeFixer = require("./fixers/conventional-type-fixer");

const fixers = [conventionalTypeFixer, aliasedEmojiFixer];

/**
 * Fix a commit message following project configuration.
 */
module.exports = function fixCommitMessage(rawMessage) {
  let message = rawMessage;

  if (!message) return rawMessage;

  // Apply Fixers
  message = fixers.reduce(
    (fixed, fixer) => fixer(config, fixed) || fixed,
    message
  );

  return message === rawMessage ? null : message;
};
