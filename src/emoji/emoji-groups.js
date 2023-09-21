module.exports = [
  {
    emoji: "🐛",
    type: "fix",
    inChangelog: true,
    heading: "🐛 Bug Fixes",
    aliases: ["🐞"],
    index: 40
  },
  {
    emoji: "📚",
    type: "docs",
    inChangelog: true,
    heading: "📚 Documentation",
    aliases: ["📖"],
    typeAliases: ["doc"],
    index: 50
  },
  {
    emoji: "🎨",
    type: "style",
    heading: "🎨 Style",
    aliases: ["💄"],
    typeAliases: ["cleanup"],
    index: 90
  },
  {
    emoji: "♻️",
    type: "refactor",
    heading: "♻️ Refactoring",
    index: 90
  },
  {
    emoji: "🛠️",
    type: "improvement",
    inChangelog: true,
    heading: "🛠️ Improvements",
    typeAliases: ["imp"],
    index: 30
  },
  {
    emoji: "⚡️",
    type: "perf",
    inChangelog: true,
    heading: "⚡️ Performance",
    typeAliases: ["performance"],
    index: 35
  },
  {
    emoji: "🏗️",
    type: "chore",
    inChangelog: true,
    heading: "🏗️ Chore",
    aliases: ["⚙️"],
    typeAliases: ["chores"],
    index: 60
  },
  {
    emoji: "✨",
    type: "feat",
    bump: "minor",
    inChangelog: true,
    heading: "✨ Features",
    aliases: ["🌟", "💫", "🌠"],
    index: 20
  },
  {
    emoji: "🚨",
    type: "breaking",
    bump: "major",
    inChangelog: true,
    heading: "🚨 Breaking Changes",
    index: 10
  }, // Non rimuovee
  {
    emoji: "🚦",
    type: "test",
    heading: "🚦 Test",
    aliases: ["✅"],
    index: 90
  },
  {
    emoji: "🔒",
    type: "security",
    inChangelog: true,
    heading: "🔒 Security",
    alisases: ["🔑"],
    index: 25
  },
  {
    emoji: "📦",
    type: "build",
    heading: "📦 Build",
    aliases: [],
    typeAliases: ["deps"],
    index: 90
  },
  {
    emoji: "🔖",
    type: "release",
    index: 90
  },
  { emoji: "🚧", type: "wip", bump: "patch", inChangelog: false, index: 90 }
].sort((g, o) => g.index - o.index);
