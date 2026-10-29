const emoji = require("../../emoji/emoji");
const config = require("../../config/config");
const translator = require("../../translation/translator")();
const commitGroupsSort = require("./commit-groups-sort");

/**
 * Factory to build conventional-changelog `writerOpts`.
 */
module.exports = function getWriterOpts() {
  let breakingHeading = emoji.list.find(e => e.type === "breaking").heading;

  return {
    /**
     * Commits are not modified (they are immutable in
     * conventional-changelog-writer v6+): a new commit is returned instead.
     */
    transform(commit, context) {
      let issues = [];

      // Skip without emoji
      if (commit.emoji == null) return null;

      const group = emoji.findEmoji(commit.emoji);
      if (group == null || !group.inChangelog) return null;

      const transformed = {
        ...commit,
        type: translator.translateHeading(group),
        notes: commit.notes.map(note => ({ ...note, title: breakingHeading }))
      };

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
    groupBy: "type",
    commitGroupsSort,
    commitsSort: ["scope", "subject"],
    noteGroupsSort: "title"
  };
};
