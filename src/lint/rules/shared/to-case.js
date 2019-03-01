const _ = require("lodash");

module.exports = function toCase(wanted, message) {
  switch (wanted) {
    case "upper-case":
      return message.toUpperCase();

    case "lower-case":
      return message.toLowerCase();

    case "sentence-case":
      return message.charAt(0).toUpperCase() + message.slice(1);

    default:
      throw new Error(`Case "${wanted}" not recognized.`);
  }
};
