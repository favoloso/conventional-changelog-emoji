const linter = require("./shared/linter");

/**
 * Limits max header length.
 */
module.exports = {
  name: "header-max-length",
  args: ["max"],
  rule: function(ctx, options, tokens) {
    if (tokens.header.length <= options.args.max) {
      return null;
    }

    return linter.error(options.args.max, tokens.header.length);
  }
};
