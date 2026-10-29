"use strict";

const parserOpts = require("./parser-opts");
const writerOpts = require("./writer-opts");

module.exports = writerOpts.then(writerOpts => {
  return {
    parserOpts,
    writerOpts
  };
});
