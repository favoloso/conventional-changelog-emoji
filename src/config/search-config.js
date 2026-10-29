const fs = require("fs");
const os = require("os");
const path = require("path");

const MODULE_NAME = "favolosoEmoji";

/**
 * Same search places used by `cosmiconfig` v5 (previously used to load
 * configuration), so that existing configurations keep working.
 */
const SEARCH_PLACES = [
  "package.json",
  `.${MODULE_NAME}rc`,
  `.${MODULE_NAME}rc.json`,
  `.${MODULE_NAME}rc.yaml`,
  `.${MODULE_NAME}rc.yml`,
  `.${MODULE_NAME}rc.js`,
  `${MODULE_NAME}.config.js`
];

function readFile(filepath) {
  try {
    return fs.readFileSync(filepath, "utf8");
  } catch (err) {
    if (err.code === "ENOENT" || err.code === "EISDIR") return null;
    throw err;
  }
}

function parseJson(filepath, content) {
  try {
    return JSON.parse(content);
  } catch (err) {
    const yaml =
      path.extname(filepath) !== ".json" &&
      path.basename(filepath) !== "package.json"
        ? "\nYAML configuration is not supported anymore, please use JSON."
        : "";
    err.message = `JSON Error in ${filepath}:\n${err.message}${yaml}`;
    throw err;
  }
}

/**
 * Loads configuration from a search place. Returns `null` if the file does
 * not exist or it's empty (and so search should continue).
 */
function loadSearchPlace(dir, place) {
  const filepath = path.join(dir, place);
  const content = readFile(filepath);
  if (content == null || content.trim() === "") return null;

  let config;
  if (place === "package.json") {
    config = parseJson(filepath, content)[MODULE_NAME] || null;
  } else if (path.extname(place) === ".js") {
    config = require(filepath);
  } else {
    config = parseJson(filepath, content);
  }

  return config == null ? null : { config, filepath };
}

/**
 * Searches configuration starting from `searchFrom` directory, going up
 * until `stopDir` (user home by default) or filesystem root.
 */
module.exports = function searchConfig(
  searchFrom = process.cwd(),
  stopDir = os.homedir()
) {
  let dir = path.resolve(searchFrom);

  while (true) {
    for (const place of SEARCH_PLACES) {
      const result = loadSearchPlace(dir, place);
      if (result) return result;
    }

    const parentDir = path.dirname(dir);
    if (parentDir === dir || dir === stopDir) return null;
    dir = parentDir;
  }
};
