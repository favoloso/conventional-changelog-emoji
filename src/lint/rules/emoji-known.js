const emojis = require("../../emoji/emoji");
const linter = require("./shared/linter");

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

    return linter.error(
      `Emoji "${tokens.emoji}" is not allowed. It should be one of: ${emojis.list.map(l => l.emoji).join(", ")}` // prettier-ignore
    );
  }
};
