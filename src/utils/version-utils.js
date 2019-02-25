/**
 * @todo Make configurable with `tagPrefix`
 */
const initialDevelopmentRegex = /^(=)?(v)?0\.(.*)$/;

/**
 * Checks if a tag (version tag) is in initial development (0.x.x).
 */
function isInitialDevelopment(tag) {
  return initialDevelopmentRegex.test(tag);
}

module.exports = {
  isInitialDevelopment
};
