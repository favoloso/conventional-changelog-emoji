"use strict";

const parserOpts = require("./src/conventional-changelog/parser-opts");
const writerOpts = require("./src/conventional-changelog/writer-opts");
const getRecommendedBumpOpts = require("./src/conventional-changelog/factory/get-recommended-bump-opts");
const gitSemverTags = require("./src/utils/git-semver-tags");

/**
 * Preset factory.
 *
 * - Modern tools (`conventional-changelog-preset-loader` v4+, i.e.
 *   `@release-it/conventional-changelog` v8+) call it and await the result,
 *   using `parser`, `writer` and `whatBump`.
 * - Legacy tools (`conventional-changelog-core`, `conventional-recommended-bump`
 *   up to v6) call it with a node-style callback, using `parserOpts`,
 *   `writerOpts`, `recommendedBumpOpts` and `conventionalChangelog`.
 */
module.exports = function createPreset(callback) {
  const preset = Promise.all([writerOpts, gitSemverTags()]).then(
    ([writerOpts, tags]) => {
      const recommendedBumpOpts = getRecommendedBumpOpts(tags);

      return {
        parser: parserOpts,
        writer: writerOpts,
        whatBump: recommendedBumpOpts.whatBump,

        conventionalChangelog: { parserOpts, writerOpts },
        parserOpts,
        recommendedBumpOpts,
        writerOpts
      };
    }
  );

  if (typeof callback === "function") {
    preset.then(result => callback(null, result), callback);
    return;
  }

  return preset;
};
