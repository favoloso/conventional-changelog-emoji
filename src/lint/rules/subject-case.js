const toCase = require("./shared/to-case");

/**
 * Check and eventually replace commit message words case, as configured.
 */
module.exports = {
  name: "subject-case",
  args: ["case"],
  rule: function(ctx, options, tokens) {
    if (!tokens.subject) return null;
    if (tokens.type === "release") return null;

    const subject = toCase(options.args.case, tokens.subject);
    if (subject === tokens.subject) return null;

    return tokens.commit.replace(tokens.subject, subject);
  }
};
