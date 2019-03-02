const emoji = require("../emoji/emoji");

module.exports = function findGroupByHeading(strings, heading) {
  const translatedType = Object.keys(strings.headings).find(
    key => strings.headings[key] === heading
  );

  if (translatedType) {
    return emoji.list.find(e => e.type === translatedType);
  }

  return emoji.list.find(e => e.heading === heading);
};
