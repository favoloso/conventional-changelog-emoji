"use strict";

const Q = require("q");
const readFile = Q.denodeify(require("fs").readFile);
const resolve = require("path").resolve;
const getWriterOpts = require("./factory/get-writer-opts");

module.exports = Q.all([
  readFile(resolve(__dirname, "./templates/template.hbs"), "utf-8"),
  readFile(resolve(__dirname, "./templates/header.hbs"), "utf-8"),
  readFile(resolve(__dirname, "./templates/commit.hbs"), "utf-8"),
  readFile(resolve(__dirname, "./templates/footer.hbs"), "utf-8")
]).spread((template, header, commit, footer) => {
  const opts = getWriterOpts();

  opts.mainTemplate = template;
  opts.headerPartial = header;
  opts.commitPartial = commit;
  opts.footerPartial = footer;

  return opts;
});
