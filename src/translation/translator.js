const getLanguageStrings = require("./get-language-strings");
const translateHeading = require("./translate-heading");
const translateRule = require("./translate-rule");
const findGroupByHeading = require("./find-group-by-heading");

module.exports = function() {
  const strings = getLanguageStrings();

  return {
    translateHeading: group => translateHeading(strings, group),
    translateRule: (rule, args) => translateRule(strings, rule, args),
    findGroupByHeading: heading => findGroupByHeading(strings, heading)
  };
};
