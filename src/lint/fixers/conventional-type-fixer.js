const emoji = require("../../emoji/emoji");
const fixableRegex = new RegExp(`^([a-zA-Z]+)\\:\\s*(.*)$`, "im");

/**
 * Replaces conventional commit types (i.e. `fix`) with emojis.
 */
module.exports = function(config, message) {
  const matches = message.match(fixableRegex);
  if (!matches) return null;

  const type = matches[1].toLowerCase();
  const group = emoji.findEmojiByType(type);
  if (!group) return null;

  // Remove `fix` ~> `fix:` ~ `🐛`
  return group.emoji + message.substr(type.length + 1);
};
