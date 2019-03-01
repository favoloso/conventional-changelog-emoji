const Severity = {
  error: 2,
  warn: 1,
  ignore: 0
};

function resolveRuleOptions(config, rule) {
  if (!config || !config.rules || config.rules[rule.name] == null) {
    throw new Error("missing configuration for rule " + rule.name);
  }
  const options = config.rules[rule.name];

  const [severity, args] =
    options === true
      ? [Severity.error]
      : options === false
      ? [Severity.ignore]
      : options;

  return {
    severity,
    args: args || []
  };
}

function error(message) {
  return {
    message: message
  };
}

module.exports = {
  Severity,
  resolveRuleOptions,
  error
};
