const emojiGroups = require("./emoji-groups");
const emojiConfigLoader = require("./emoji-config-loader");

const { createEmojiRegex } = require("./emoji-regex");

const emojiRegex = createEmojiRegex();

/**
 * Removes variation selectors (U+FE0E / U+FE0F), so that i.e. `🛠` and `🛠️`
 * are considered the same emoji. Some systems (i.e. Windows) render the first
 * one as text, so both are commonly found in commits.
 */
function normalizeEmoji(emoji) {
  return typeof emoji === "string"
    ? emoji.replace(/[\uFE0E\uFE0F]/g, "")
    : emoji;
}

function isSameEmoji(emoji, other) {
  return emoji != null && normalizeEmoji(emoji) === normalizeEmoji(other);
}

function hasEmoji(emojis, emoji) {
  return emojis.some(e => isSameEmoji(e, emoji));
}

/**
 * Escapes regex syntax characters (valid even with `u` flag).
 */
function escapeRegex(text) {
  return text.replace(/[\^$\\.*+?()[\]{}|\/]/g, "\\$&");
}

/**
 * Finds all emojis (i.e. all features by `minor`, or all breakings by `major`)
 */
function emojisByBump(bump) {
  const types = groups.filter(e => e.bump === bump);
  return types.reduce((emojis, type) => {
    emojis.push(type.emoji, ...type.aliases);
    return emojis;
  }, []);
}

/**
 * Finds original emoji starting from aliased `emoji` provided
 */
function findAliased(emoji) {
  const base = groups.find(e => hasEmoji(e.aliases, emoji));
  if (base) return base.emoji;
  return null;
}

/**
 * Finds replacing emoji
 */
function findEmoji(emoji) {
  const original = groups.find(e => isSameEmoji(e.emoji, emoji));
  if (original) return original;

  const aliased = groups.find(e => hasEmoji(e.aliases, emoji));
  if (aliased) return aliased;

  return null;
}

/**
 * Finds emoji by type. Support type-aliases.
 */
function findEmojiByType(type) {
  return groups.find(
    e => e.type === type || e.typeAliases.indexOf(type) !== -1
  );
}

/**
 * Finds type by emoji.
 */
function findType(emoji) {
  const group = groups.find(
    e => isSameEmoji(e.emoji, emoji) || hasEmoji(e.aliases, emoji)
  );
  if (group) return group.type;
  return null;
}

/**
 * Adds missing fields to emojis.
 */
function normalizeEmojiGroup(group) {
  if (!group.emoji || !group.type) {
    throw new Error(
      `Cannot process emoji:\n
      "${JSON.stringify(group)}".\n
      Make sure you are including at least an "emoji" and a "type" property.`
    );
  }

  return {
    ...group,
    heading:
      group.heading ||
      `${group.emoji} ${group.type[0].toUpperCase() + group.type.substr(1)}`,
    bump: group.bump || "patch",
    aliases: group.aliases || [],
    typeAliases: group.typeAliases || [],
    inChangelog: group.inChangelog == null ? false : group.inChangelog
  };
}

const baseGroups = emojiGroups.map(normalizeEmojiGroup);
const groups = emojiConfigLoader(baseGroups).map(normalizeEmojiGroup);

/**
 * We create a regex based on provided Emoji (and their Emoji Aliases)
 * in order to be sure changelog emojis are always available, even if
 * they are not recognized by the generic emoji regex.
 * Variation selectors are optional (i.e. both `🛠` and `🛠️` are matched).
 */
const groupsEmojiRegex = groups
  .reduce((emojis, g) => {
    emojis.push(g.emoji, ...g.aliases);
    return emojis;
  }, [])
  .map(emoji => `${escapeRegex(normalizeEmoji(emoji))}[\\uFE0E\\uFE0F]?`)
  .join("|");

const headerRegex = new RegExp(
  `^(${groupsEmojiRegex}|${emojiRegex.source})(\\s*)(.*)$`,
  "u"
);

module.exports = {
  list: groups,
  baseList: baseGroups,
  headerRegex,
  featureEmojis: emojisByBump("minor"),
  breakingEmojis: emojisByBump("major"),
  releaseEmoji: groups.find(g => g.type === "release"),
  findAliased,
  isSameEmoji,
  hasEmoji,
  findType,
  findEmoji,
  findEmojiByType
};
