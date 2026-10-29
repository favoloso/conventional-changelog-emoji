const emoji = require("../../emoji/emoji");
const config = require("../../config/config");
const translator = require("../../translation/translator")();
const commitGroupsSort = require("./commit-groups-sort");
const template = require("./template");

/**
 * Factory to build conventional-changelog-writer (v9+) options.
 */
module.exports = function getWriterOpts() {
  let breakingHeading = emoji.list.find(e => e.type === "breaking").heading;

  return {
    /**
     * Commits are immutable: only changed fields are returned, and they
     * are merged into the commit by conventional-changelog-writer.
     */
    transform(commit, context, options) {
      let issues = [];

      // Skip without emoji
      if (commit.emoji == null) return null;

      const group = emoji.findEmoji(commit.emoji);
      if (group == null || !group.inChangelog) return null;

      const transformed = {
        type: translator.translateHeading(group),
        notes: commit.notes.map(note => ({ ...note, title: breakingHeading }))
      };

      if (commit.committerDate) {
        transformed.committerDate = options.formatDate(commit.committerDate);
      }

      if (config.showEmojiPerCommit) {
        transformed.showEmoji = commit.emoji;
      }

      if (typeof commit.hash === `string`) {
        transformed.hash = commit.hash.substring(0, 7);
      }

      if (typeof commit.subject === `string`) {
        let subject = commit.subject;
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl;

        if (url) {
          url = `${url}/issues/`;
          // Issue URLs.
          subject = subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue);
            return `[#${issue}](${url}${issue})`;
          });
        }

        if (context.host) {
          // User URLs.
          subject = subject.replace(
            /\B@([a-z0-9](?:-?[a-z0-9]){0,38})/g,
            `[@$1](${context.host}/$1)`
          );
        }

        transformed.subject = subject;
      }

      // remove references that already appear in the subject
      transformed.references = commit.references.filter(reference => {
        if (issues.indexOf(reference.issue) === -1) {
          return true;
        }

        return false;
      });

      return transformed;
    },
    template,
    groupBy: "type",
    commitGroupsSort,
    commitsSort: ["scope", "subject"],
    noteGroupsSort: "title"
  };
};
