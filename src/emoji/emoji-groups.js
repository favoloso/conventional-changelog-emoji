module.exports = [
  {
    emoji: "🐛",
    type: "fix",
    inChangelog: true,
    heading: "🐛 Bug Fixes",
    aliases: ["🐞"]
  },
  {
    emoji: "📚",
    type: "docs",
    inChangelog: true,
    heading: "📚 Documentation",
    aliases: ["📖"],
    typeAliases: ["doc"]
  },
  {
    emoji: "🎨",
    type: "style",
    heading: "🎨 Style",
    aliases: ["💄"],
    typeAliases: ["cleanup"]
  },
  {
    emoji: "♻️",
    type: "refactor",
    heading: "🛠 Improvements"
  },
  {
    emoji: "🛠",
    type: "improvement",
    inChangelog: true,
    heading: "🛠 Improvements",
    typeAliases: ["imp"]
  },
  {
    emoji: "⚡️",
    type: "perf",
    inChangelog: true,
    heading: "⚡️ Performance",
    typeAliases: ["performance"]
  },
  {
    emoji: "🏗",
    type: "chore",
    inChangelog: true,
    heading: "🏗 Chore",
    aliases: ["⚙️"],
    typeAliases: ["chores"]
  },
  {
    emoji: "✨",
    type: "feat",
    bump: "minor",
    inChangelog: true,
    heading: "✨ Features",
    aliases: ["🌟", "💫", "🌠"]
  },
  {
    emoji: "🚨",
    type: "breaking",
    bump: "major",
    inChangelog: true,
    heading: "🚨 Breaking Changes"
  }, // Non rimuovee
  {
    emoji: "🚦",
    type: "test",
    heading: "🚦 Test",
    aliases: ["✅"]
  },
  {
    emoji: "🔒",
    type: "security",
    inChangelog: true,
    heading: "🔒 Security",
    alisases: ["🔑"]
  },
  {
    emoji: "📦",
    type: "build",
    heading: "📦 Build",
    aliases: [],
    typeAliases: ["deps"]
  },
  {
    emoji: "🔖",
    type: "release"
  },
  { emoji: "🚧", type: "wip", bump: "patch", inChangelog: false }
];
