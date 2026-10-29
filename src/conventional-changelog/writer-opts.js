"use strict";

const readFile = require("util").promisify(require("fs").readFile);
const resolve = require("path").resolve;
const getWriterOpts = require("./factory/get-writer-opts");

module.exports = Promise.all([
  readFile(resolve(__dirname, "./templates/template.hbs"), "utf-8"),
  readFile(resolve(__dirname, "./templates/header.hbs"), "utf-8"),
  readFile(resolve(__dirname, "./templates/commit.hbs"), "utf-8"),
  readFile(resolve(__dirname, "./templates/footer.hbs"), "utf-8")
]).then(([template, header, commit, footer]) => {
  const opts = getWriterOpts();

  opts.mainTemplate = template;
  opts.headerPartial = header;
  opts.commitPartial = commit;
  opts.footerPartial = footer;

  return opts;
});
