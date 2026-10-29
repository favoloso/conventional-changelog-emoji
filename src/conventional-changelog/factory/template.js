/**
 * Changelog template for conventional-changelog-writer v9+ (which renders
 * templates with plain functions instead of Handlebars).
 */

function repositoryUrl(context) {
  if (!context.repository) return context.repoUrl;

  return [context.host, context.owner, context.repository]
    .filter(Boolean)
    .join("/");
}

function referenceUrl(context, reference) {
  if (!context.repository) return context.repoUrl;

  const repository = reference.repository
    ? [reference.owner, reference.repository]
    : [context.owner, context.repository];

  return [context.host, ...repository].filter(Boolean).join("/");
}

function header(context) {
  const { isPatch, linkCompare, version, title, date } = context;

  const versionText = linkCompare
    ? `[${version}](${repositoryUrl(context)}/compare/${context.previousTag}...${context.currentTag})`
    : version;

  return (
    `${isPatch ? "##" : "#"} ${versionText}` +
    (title ? ` "${title}"` : "") +
    (date ? ` (${date})\n` : "")
  );
}

function reference(context, ref) {
  const text = `${ref.owner ? `${ref.owner}/` : ""}${ref.repository || ""}#${ref.issue}`;

  return context.linkReferences
    ? `[${text}](${referenceUrl(context, ref)}/${context.issue}/${ref.issue})`
    : text;
}

function commit(context, commit) {
  const text = commit.subject
    ? `${commit.showEmoji ? `${commit.showEmoji} ` : ""}${commit.subject}`
    : commit.header;

  const hash = context.linkReferences
    ? `([${commit.hash}](${repositoryUrl(context)}/${context.commit}/${commit.hash}))`
    : commit.hash;

  const references =
    commit.references && commit.references.length > 0
      ? ", closes" +
        commit.references.map(ref => ` ${reference(context, ref)}`).join("")
      : "";

  return `* ${text} ${hash}${references}\n`;
}

function footer(context) {
  if (!context.noteGroups || context.noteGroups.length === 0) return "";

  return (
    context.noteGroups
      .map(
        group =>
          `\n### ${group.title}\n\n` +
          group.notes
            .map(note => {
              const scope =
                note.commit && note.commit.scope
                  ? `**${note.commit.scope}:** `
                  : "";
              return `* ${scope}${note.text}\n`;
            })
            .join("")
      )
      .join("") + "\n"
  );
}

module.exports = function template(context) {
  const groups = context.commitGroups
    .map(
      group =>
        "\n" +
        (group.title ? `### ${group.title}\n\n` : "") +
        group.commits.map(c => commit(context, c)).join("") +
        "\n"
    )
    .join("");

  return `${header(context)}\n${groups}${footer(context)}\n`;
};
