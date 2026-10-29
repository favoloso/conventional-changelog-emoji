const searchConfig = require("./search-config");

const loadedConfig = searchConfig();
const config = {
  ...require("./config-default"),
  ...(loadedConfig ? loadedConfig.config : null)
};

module.exports = config;
