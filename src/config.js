const cosmiconfig = require("cosmiconfig");

const explorer = cosmiconfig("favoloso-emoji");
const loadedConfig = explorer.searchSync();
const config = {
  ...require("./config-default"),
  ...(loadedConfig ? loadedConfig.config : null)
};

module.exports = config;
