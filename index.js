"use strict";

const Q = require("q");
const conventionalChangelog = require("./src/conventional-changelog/conventional-changelog");
const recommendedBumpOpts = require("./src/conventional-changelog/conventional-recommended-bump");
const parserOpts = require("./src/conventional-changelog/parser-opts");
const writerOpts = require("./src/conventional-changelog/writer-opts");

module.exports = Q.all([
  conventionalChangelog,
  parserOpts,
  recommendedBumpOpts,
  writerOpts
]).spread(
  (conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts) => {
    return {
      conventionalChangelog,
      parserOpts,
      recommendedBumpOpts,
      writerOpts
    };
  }
);
