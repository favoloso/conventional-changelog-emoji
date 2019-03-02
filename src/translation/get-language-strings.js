const fs = require("fs");
const config = require("../config/config");

const stringFiles = fs.readdirSync(__dirname + "/strings");
const languages = stringFiles.map(f => f.replace(".js", ""));

module.exports = function getLanguageStrings() {
  const language = config.language || "en";

  if (languages.indexOf(language) === -1) {
    throw new Error(
      `Language "${language}" is not available. Please use on of: ${languages.join(
        ", "
      )}`
    );
  }

  return require(`${__dirname}/strings/${language}.js`);
};
