"use strict";

const Q = require("q");
const readFile = Q.denodeify(require("fs").readFile);
const resolve = require("path").resolve;
const emoji = require("./emoji");

const SEVERITY = {
  skip: 0,
  patch: 0,
  minor: 1,
  major: 2,
  breaking: 2
};

module.exports = Q.all([
  readFile(resolve(__dirname, "./templates/template.hbs"), "utf-8"),
  readFile(resolve(__dirname, "./templates/header.hbs"), "utf-8"),
  readFile(resolve(__dirname, "./templates/commit.hbs"), "utf-8")
]).spread((template, header, commit) => {
  let groups = emoji.list.reduce((groups, record) => {
    let [emoji, type, bump, includeInChangelog, heading] = record;
    groups[emoji] = {
      heading,
      type,
      versionBump: bump,
      severity: SEVERITY[bump],
      includeInChangelog
    };
    return groups;
  }, {});

  const opts = getWriterOpts(groups);

  opts.mainTemplate = template;
  opts.headerPartial = header;
  opts.commitPartial = commit;

  return opts;
});

function getWriterOpts(groups) {
  let breakingHeading = emoji.list.find(e => e[1] === "breaking")[4];

  return {
    transform(commit, context) {
      let issues = [];

      if (commit.emoji != null) {
        const group = groups[commit.emoji];
        if (group == null || !group.includeInChangelog) return null;

        commit.type = group.heading;
      } else {
        // Skip without emoji
        return null;
      }

      commit.notes.forEach(note => {
        note.title = breakingHeading;
      });

      if (typeof commit.hash === `string`) {
        commit.hash = commit.hash.substring(0, 7);
      }

      if (typeof commit.subject === `string`) {
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl;

        if (url) {
          url = `${url}/issues/`;
          // Issue URLs.
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue);
            return `[#${issue}](${url}${issue})`;
          });
        }

        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(
            /\B@([a-z0-9](?:-?[a-z0-9]){0,38})/g,
            `[@$1](${context.host}/$1)`
          );
        }
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter(reference => {
        if (issues.indexOf(reference.issue) === -1) {
          return true;
        }

        return false;
      });

      return commit;
    },
    groupBy: "type",
    commitGroupsSort: "title",
    commitsSort: ["scope", "subject"],
    noteGroupsSort: "title"
  };
}
