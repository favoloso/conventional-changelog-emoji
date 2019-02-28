const Severity = {
  error: 2,
  ignore: 0
};

function createResult(options, failed, message) {
  return (failed && options.applicable === "always") ||
    (!failed && options.applicable === "never")
    ? {
        severity: options.severity,
        message
      }
    : null;
}

function resolveRuleOptions(config, rule) {
  if (!config || !config.rules || !config.rules[rule]) {
    throw new Error("missing configuration for rule " + rule);
  }
  const [severity, applicable, ...args] = config.rules[rule];
  return {
    severity,
    applicable,
    args
  };
}

module.exports = {
  Severity,
  createResult,
  resolveRuleOptions
};
