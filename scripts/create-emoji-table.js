#!/usr/bin/env node
const emoji = require("../src/emoji/emoji");
const fs = require("fs");
const path = require("path");

const table = [
  "\n",
  " Emoji | Aliases | Type | Type Aliases | Version Bump | In Changelog? | Heading  | Order",
  " ----- | ------- | ---- | ------------ | ------------ | ------------- | -------  | -----",
  ...emoji.baseList.map(group =>
    [
      group.emoji,
      group.aliases.join(", "),
      `\`${group.type}\``,
      group.typeAliases.map(type => `\`${type}\``).join(", "),
      group.bump,
      group.inChangelog ? "✅" : "",
      group.heading,
      group.index
    ].join(" | ")
  ),
  "\n"
].join("\n");

const readme = fs.readFileSync(path.join(__dirname, "../README.md"), "utf8");
fs.writeFileSync(
  path.join(__dirname, "../README.md"),
  readme.replace(
    /(<!-- emoji-table -->)([\w\W]*)(<!-- emoji-table -->)/g,
    `$1${table}$3`
  )
);
