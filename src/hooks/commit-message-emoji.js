#!/usr/bin/env node
const fs = require("fs");
const emojis = require("../emoji");

const fixableTypes = emojis.list.map(e => e[1]).join("|");
const fixableRegex = new RegExp(`^(${fixableTypes})\\:\\s*(.*)$`, "im");

const message = fs.readFileSync(process.env.HUSKY_GIT_PARAMS, "utf8");

if (message) {
  const matches = message.match(fixableRegex);
  if (matches) {
    const type = matches[1];
    const emoji = emojis.list.find(e => e[1] === type)[0];
    const replaced = emoji + message.substr(type.length + 1);
    fs.writeFileSync(process.env.HUSKY_GIT_PARAMS, replaced, {
      encoding: "utf8"
    });
  }
}

process.exit(0);
