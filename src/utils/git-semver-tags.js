const { execFile } = require("child_process");

const TAG_REGEX = /tag:\s*(.+?)[,)]/gi;

/**
 * Same validation of `semver.valid` (not loose): optional `v` prefix,
 * prerelease and build metadata.
 */
const SEMVER_REGEX =
  /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[a-zA-Z-][a-zA-Z0-9-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][a-zA-Z0-9-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function isSemver(tag) {
  if (tag.length > 256) return false;

  const match = tag.match(SEMVER_REGEX);
  return (
    match != null &&
    match.slice(1, 4).every(n => Number(n) <= Number.MAX_SAFE_INTEGER)
  );
}

/**
 * Extracts semver tags from `git log --decorate` output, most recent first.
 */
function parseSemverTags(log) {
  const tags = [];
  log.split("\n").forEach(decorations => {
    let match;
    TAG_REGEX.lastIndex = 0;
    while ((match = TAG_REGEX.exec(decorations))) {
      if (isSemver(match[1])) tags.push(match[1]);
    }
  });
  return tags;
}

/**
 * Lists semver tags reachable from HEAD, most recent first
 * (replaces `git-semver-tags`).
 */
function gitSemverTags() {
  return new Promise((resolve, reject) => {
    execFile(
      "git",
      ["log", "--decorate", "--no-color", "--format=%d"],
      { maxBuffer: Infinity },
      (err, stdout) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(parseSemverTags(stdout));
      }
    );
  });
}

module.exports = gitSemverTags;
module.exports.parseSemverTags = parseSemverTags;
