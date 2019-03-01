const linter = require("./shared/linter");

/**
 * Force or disable full stop for the header.
 */
module.exports = {
  name: "header-full-stop",
  args: ["never"],
  rule: function(ctx, options, tokens) {
    if (tokens.type === "release") return null;

    const fullStop = tokens.header.endsWith(".");
    if (options.args.never) {
      if (fullStop) {
        return tokens.commit.replace(
          tokens.header,
          tokens.header.substring(0, tokens.header.length - 1)
        );
      }

      return null;
    } else {
      if (!fullStop) {
        return tokens.commit.replace(tokens.header, tokens.header + ".");
      }

      return null;
    }
  }
};
