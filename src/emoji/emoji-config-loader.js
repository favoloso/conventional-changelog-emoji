const config = require("../config/config");

/**
 * Allows for custom emoji configuration with `cosmiconfig`.
 *
 * Existing emoji groups may be edited or deleted (passing `false` as value),
 * while new types may be added.
 */
module.exports = function emojiConfigLoader(originalGroups) {
  const custom = config.emojis;

  if (!custom || Object.keys(custom).length === 0) return originalGroups;

  // Deep clone
  const groups = [...originalGroups.map(o => ({ ...o }))];

  Object.keys(custom).forEach(type => {
    const customGroup = custom[type];
    const group = groups.find(e => e.type === type);

    if (group == null && customGroup === false) {
      throw new Error(
        `Cannot remove emoji group "${type}" since it is not defined.`
      );
    }

    if (group == null) {
      groups.push({ type, ...customGroup });
      return;
    }

    if (customGroup === false) {
      groups.splice(groups.indexOf(group), 1);
      return;
    }

    Object.assign(group, customGroup);
  });

  return groups;
};
