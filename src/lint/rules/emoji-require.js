const linter = require("./shared/linter");

/**
 * Ensures emoji is provided.
 */
module.exports = {
  name: "emoji-require",
  rule: function(ctx, options, tokens) {
    if (tokens.emoji) return null;

    return linter.error(tokens.header);
  }
};
