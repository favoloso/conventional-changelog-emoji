const list = [
  ["🐛", "bug", "patch", true, "🐛 Bug Fixes"],
  ["📚", "docs", "patch", true, "📚 Documentation"],
  ["🎨", "style", "patch", false, "🎨 Style"],
  ["♻️", "refactor", "patch", true, "🛠 Improvements"],
  ["🏗", "chore", "patch", false, "🏗 Chore"],
  ["✨", "feat", "minor", true, "✨ Features"],
  ["🌟", "feat", "minor", true, "✨ Features"],
  ["🚨", "breaking", "major", true, "🚨 Breaking Changes"], // Non rimuovere
  ["🛠", "improvement", "patch", true, "🛠 Improvements"],
  ["🚦", "test", "patch", false, "🚦 Test"],
  ["🔒", "security", "patch", true, "🔒 Security"],
  ["📦", "deps", "patch", true, "📦 Dependencies"],
  ["🔖", "release", "patch", false, ""],
  ["🚧", "wip", "patch", false, ""]
];

module.exports = {
  list,
  featureEmojis: list.filter(e => e[2] === "minor").map(e => e[0]),
  breakingEmojis: list.filter(e => e[2] === "major").map(e => e[0])
};
