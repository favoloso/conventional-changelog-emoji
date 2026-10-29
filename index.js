"use strict";

const parserOpts = require("./src/conventional-changelog/parser-opts");
const getWriterOpts = require("./src/conventional-changelog/factory/get-writer-opts");
const getWhatBump = require("./src/conventional-changelog/factory/get-what-bump");
const gitSemverTags = require("./src/utils/git-semver-tags");

/**
 * Preset factory for `conventional-changelog` v8+ and
 * `conventional-recommended-bump` v12+
 * (i.e. `@release-it/conventional-changelog` v12+).
 */
module.exports = async function createPreset() {
  const tags = await gitSemverTags();

  return {
    parser: parserOpts,
    writer: getWriterOpts(),
    whatBump: getWhatBump(tags)
  };
};
