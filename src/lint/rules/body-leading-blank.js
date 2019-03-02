const linter = require("./shared/linter");

const BODY_LEADING_BLANK_REGEX = /^([^\n]*)(\n|\n\n([\s\S]+))?$/;

/**
 * Body should begin with a leading blank line as of conventional commits
 * spec.
 */
module.exports = {
  name: "body-leading-blank",
  rule: function(ctx, options, tokens) {
    // console.log(tokens.commit.match(BODY_LEADING_BLANK_REGEX));
    if (BODY_LEADING_BLANK_REGEX.test(tokens.commit)) return null;

    return linter.error();
  }
};
