const cosmiconfig = require("cosmiconfig");

const explorer = cosmiconfig("favoloso-emoji");
const loadedConfig = explorer.searchSync();
const config = {
  fixAliasedEmoji: false,
  ...(loadedConfig ? loadedConfig.config : null)
};

module.exports = config;
