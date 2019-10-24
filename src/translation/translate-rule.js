/**
 * Given a string, translate rule message passing arguments and replacing
 * theme inside the string given their index, i.e. `$0` for the first arg, etc.
 */
module.exports = function translateRule(strings, rule, ...args) {
  return strings.rules[rule].replace(
    /\$([0-9]+)/g,
    (match, index) => args[parseInt(index, 10)]
  );
};
