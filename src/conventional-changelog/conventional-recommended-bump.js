"use strict";

const gitSemverTags = require("../utils/git-semver-tags");
const getRecommendedBumpOpts = require("./factory/get-recommended-bump-opts");

module.exports = gitSemverTags().then(getRecommendedBumpOpts);
