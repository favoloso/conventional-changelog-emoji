const emojis = require("../../emoji/emoji");
const linter = require("./shared/linter");

/**
 * Allows only known emojis from `emojis` configuration.
 * When aliases are available, we replace them with base emoji
 * instead of throwing.
 */
module.exports = {
  name: "emoji-known",
  rule: function(ctx, options, tokens) {
    if (!tokens.emoji) return null;

    // Allows for aliases, so find replacement and if available use it.
    const alias = emojis.findAliased(tokens.emoji);
    if (!options.args.disallowAliases && alias != null) {
      return alias + tokens.commit.substr(tokens.emoji.length);
    }

    if (emojis.findEmoji(tokens.emoji)) return null;

    return linter.error(tokens.emoji, emojis.list.map(l => l.emoji).join(", "));
  }
};
