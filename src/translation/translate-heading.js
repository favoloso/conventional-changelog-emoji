/**
 * Provides heading translation based on config locale
 */
module.exports = function translateHeading(strings, group) {
  return strings.headings[group.type]
    ? strings.headings[group.type]
    : group.heading;
};
