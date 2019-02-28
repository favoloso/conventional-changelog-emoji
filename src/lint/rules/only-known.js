const emoji = require("../../emoji/emoji");
const linter = require("./shared/linter");

module.exports = {
  name: "only-known",
  rule: function(options, message) {
    console.log(options, message);
    const tokens = message.match(emoji.commitRegex);
    if (!tokens) return null;

    return linter.createResult(
      options,
      emoji.findEmoji(tokens[1]) == null,
      `Emoji "${
        tokens[1]
      }" is not allowed. It should be one of: ${emoji.list
        .map(l => l.emoji)
        .join(", ")}`
    );
  }
};
