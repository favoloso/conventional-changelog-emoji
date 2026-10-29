const { parseSemverTags } = require("../src/utils/git-semver-tags");

describe("git semver tags", () => {
  it("should extract semver tags in order", () => {
    const log = [
      " (HEAD -> master, tag: v1.1.0, origin/master)",
      "",
      " (tag: not-a-version, tag: 1.0.0-beta.1+build.5)",
      " (tag: v1.0.0)",
      " (tag: =v0.9.0, tag: v01.0.0)"
    ].join("\n");

    expect(parseSemverTags(log)).toEqual([
      "v1.1.0",
      "1.0.0-beta.1+build.5",
      "v1.0.0"
    ]);
  });
});
