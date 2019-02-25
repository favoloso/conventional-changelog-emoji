const emoji = require("../emoji/emoji");
const emojiRegex = require("emoji-regex/text")();
const config = require("../config/config");

const fixableRegex = new RegExp(`^([a-zA-Z]+)\\:\\s*(.*)$`, "im");
const emojiAliasedRegex = new RegExp(
  `^(${emojiRegex.source})?(\\s*)(.*)$`,
  "m"
);

/**
 * Fix a commit message following project configuration.
 */
module.exports = function fixCommitMessage(rawMessage) {
  let message = rawMessage;

  if (message) {
    // Replaces conventional commits
    const matches = message.match(fixableRegex);

    if (matches) {
      const type = matches[1].toLowerCase();
      const replace = emoji.findEmojiByType(type);
      if (!type) return;

      message = replace.emoji + message.substr(type.length + 1);
    }

    // Replaces aliased emojis
    const emojiMatches = message.match(emojiAliasedRegex);
    if (config.fixAliasedEmoji && emojiMatches != null) {
      const commitEmoji = emojiMatches[1];
      const replace = emoji.findAliased(commitEmoji);
      if (replace !== commitEmoji) {
        message = replace + message.substr(commitEmoji.length);
      }
    }
  }

  return message === rawMessage ? null : message;
};
