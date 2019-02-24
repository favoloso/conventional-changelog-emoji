function emoji(
  emoji,
  type,
  bump,
  inChangelog,
  heading,
  aliases = [],
  typeAliases = []
) {
  return {
    emoji,
    type,
    bump,
    inChangelog,
    heading,
    aliases,
    typeAliases
  };
}

/**
 * Finds all emojis (i.e. all features by `minor`, or all breakings by `major`)
 */
function emojisByBump(bump) {
  const types = list.filter(e => e.bump === bump);
  return types.reduce((emojis, type) => {
    emojis.push(type.emoji, ...type.aliases);
    return emojis;
  }, []);
}

/**
 * Finds original emoji starting from aliased `emoji` provided
 */
function findAliased(emoji) {
  const base = list.find(e => e.aliases.indexOf(emoji) !== -1);
  if (base) return base.emoji;
  return emoji;
}

/**
 * Finds replacing emoji
 */
function findEmoji(emoji) {
  const original = list.find(e => e.emoji === emoji);
  if (original) return original;

  const aliased = list.find(e => e.aliases.indexOf(emoji) !== -1);
  if (aliased) return aliased;

  return null;
}

/**
 * Finds emoji by type. Support type-aliases.
 */
function findEmojiByType(type) {
  return list.find(e => e.type === type || e.typeAliases.indexOf(type) !== -1);
}

const list = [
  emoji("🐛", "fix", "patch", true, "🐛 Bug Fixes", ["🐞"]),
  emoji("📚", "docs", "patch", true, "📚 Documentation", ["📖"], ["doc"]),
  emoji("🎨", "style", "patch", false, "🎨 Style", ["💄"], ["cleanup"]),
  emoji("♻️", "refactor", "patch", true, "🛠 Improvements"),
  emoji("🏗", "chore", "patch", true, "🏗 Chore"),
  emoji("✨", "feat", "minor", true, "✨ Features", ["🌟", "💫", "🌠"]),
  emoji("🚨", "breaking", "major", true, "🚨 Breaking Changes"), // Non rimuovere
  emoji("🛠", "improvement", "patch", true, "🛠 Improvements"),
  emoji("🚦", "test", "patch", false, "🚦 Test", ["✅"]),
  emoji("🔒", "security", "patch", true, "🔒 Security", ["🔑"]),
  emoji("📦", "build", "patch", true, "📦 Build"),
  emoji("🔖", "release", "patch", false, ""),
  emoji("🚧", "wip", "patch", false, "")
];

module.exports = {
  list,
  featureEmojis: emojisByBump("minor"),
  breakingEmojis: emojisByBump("major"),
  findAliased,
  findEmoji,
  findEmojiByType
};
