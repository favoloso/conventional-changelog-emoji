const cosmiconfig = require("cosmiconfig");

const explorer = cosmiconfig("favolosoEmoji");
const loadedConfig = explorer.searchSync();
const config = {
  ...require("./config-default"),
  ...(loadedConfig ? loadedConfig.config : null)
};

module.exports = config;
