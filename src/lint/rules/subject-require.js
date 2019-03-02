const linter = require("./shared/linter");

/**
 * Ensures emoji is provided.
 */
module.exports = {
  name: "subject-require",
  rule: function(ctx, options, tokens) {
    if (tokens.subject) return null;

    return linter.error(tokens.header);
  }
};
