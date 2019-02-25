const emoji = require("../../emoji/emoji");
const config = require("../../config/config");

/**
 * Factory to build conventional-changelog `writerOpts`.
 */
module.exports = function getWriterOpts() {
  let breakingHeading = emoji.list.find(e => e.type === "breaking").heading;

  return {
    transform(commit, context) {
      let issues = [];
      if (commit.emoji != null) {
        const group = emoji.findEmoji(commit.emoji);
        if (group == null || !group.inChangelog) return null;

        commit.type = group.heading;
      } else {
        // Skip without emoji
        return null;
      }

      commit.notes.forEach(note => {
        note.title = breakingHeading;
      });

      if (config.showEmojiPerCommit) {
        commit.showEmoji = commit.emoji;
      }

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
};
