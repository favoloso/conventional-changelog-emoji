const emojiGroups = require("./emoji-groups");
const emojiConfigLoader = require("./emoji-config-loader");

const emojiRegex = require("emoji-regex/text")();

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
  const base = groups.find(e => e.aliases.indexOf(emoji) !== -1);
  if (base) return base.emoji;
  return null;
}

/**
 * Finds replacing emoji
 */
function findEmoji(emoji) {
  const original = groups.find(e => e.emoji === emoji);
  if (original) return original;

  const aliased = groups.find(e => e.aliases.indexOf(emoji) !== -1);
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
    e => e.emoji === emoji || e.aliases.indexOf(emoji) !== -1
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
 * in order to fix bugs with `emoji-regex` regex, atleast to be sure
 * changelog emojis are always available.
 */
const groupsEmojiRegex = groups
  .reduce((emojis, g) => {
    emojis.push(g.emoji, ...g.aliases);
    return emojis;
  }, [])
  .join("|");

const headerRegex = new RegExp(
  `^(${groupsEmojiRegex}|${emojiRegex.source})(\\s*)(.*)$`
);

module.exports = {
  list: groups,
  baseList: baseGroups,
  headerRegex,
  featureEmojis: emojisByBump("minor"),
  breakingEmojis: emojisByBump("major"),
  releaseEmoji: groups.find(g => g.type === "release"),
  findAliased,
  findType,
  findEmoji,
  findEmojiByType
};
