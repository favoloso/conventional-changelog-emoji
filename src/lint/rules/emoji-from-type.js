const emoji = require("../../emoji/emoji");
const linter = require("./shared/linter");

const fixableRegex = new RegExp(`^([a-zA-Z]+)\\:`, "i");

/**
 * Replaces conventional commit types (i.e. `fix`) with emojis.
 */
module.exports = {
  name: "emoji-from-type",
  rule: function(ctx, options, tokens) {
    const matches = tokens.header.match(fixableRegex);
    if (!matches) return null;

    const type = matches[1].toLowerCase();
    const group = emoji.findEmojiByType(type);
    if (!group) {
      return linter.error(
        `Type Alias "${type}" is not allowed. It should be one of: "${emoji.list
          .map(e => e.type)
          .join(", ")}"`
      );
    }

    // Remove `fix` ~> `fix:` ~ `🐛`
    return group.emoji + tokens.commit.substr(type.length + 1);
  }
};
