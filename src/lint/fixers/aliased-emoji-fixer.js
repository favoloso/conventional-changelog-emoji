const emoji = require("../../emoji/emoji");
const emojiRegex = require("emoji-regex/text")();

const aliasedRegex = new RegExp(`^(${emojiRegex.source})(\\s*)(.*)$`, "m");

/**
 * Replaces aliased emojis.
 */
module.exports = function aliasedEmojiFixer(config, message) {
  if (!config.fixAliasedEmoji) return null;

  // Make sure commit matches emojis.
  const emojiMatches = message.match(aliasedRegex);
  if (emojiMatches == null) return null;

  // Find replacement and check it is not the same as the one used.
  const commitEmoji = emojiMatches[1];
  const replace = emoji.findAliased(commitEmoji);
  if (replace === commitEmoji) return null;

  return replace + message.substr(commitEmoji.length);
};
