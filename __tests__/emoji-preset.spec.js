"use strict";
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");

// Utils

function prepareRepo() {
  shell.config.silent = true;
  shell.rm("-rf", "tmp");
  shell.mkdir("tmp");
  shell.cd("tmp");
  shell.mkdir("git-templates");
  shell.exec("git init --template=./git-templates");
}

function getChangelog() {
  return new Promise((resolve, reject) => {
    const preset = require("..");
    const conventionalChangelogCore = require("conventional-changelog-core");
    let filename = path.resolve(__dirname, ".CHANGELOG.md");
    let results = new fs.createWriteStream(filename);
    conventionalChangelogCore({
      config: preset,
      warn: (...m) => console.log(...m)
    })
      .on("error", err => {
        reject(err);
      })
      .pipe(results);

    results.on("finish", () => {
      let changelog = fs.readFileSync(filename);
      fs.unlinkSync(filename);
      resolve(changelog.toString());
    });
  });
}

function gitCommit(message) {
  shell.exec(`git commit -m "${message}" --allow-empty --no-gpg-sign`);
}

expect.extend({
  toContainString(received, expected) {
    if (this.isNot) {
      expect(received).not.toEqual(expect.stringContaining(expected));
    } else {
      expect(received).toEqual(expect.stringContaining(expected));
    }

    return { pass: !this.isNot };
  }
});

// Test preset

describe("emoji preset", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.setMock("../src/config", require("../src/config-default"));
    prepareRepo();
  });

  it("should work with all kind of commits", () => {
    gitCommit("✨ Aggiunta nuova feature\n\n🚨 Breaking!");
    gitCommit("✨ Aggiunto supporto per X Y Z (#55)\nABC");
    gitCommit("🐛 Corretto un bug (#56)");
    gitCommit("* WIP temporaneo");
    gitCommit("🚧 lavori in corso temporaneo");
    gitCommit("📚 Aggiunta anche la documentazione X Y Z");

    return getChangelog().then(changelog => {
      expect(changelog).toEqual(expect.stringContaining("#56"));
      expect(changelog).toEqual(expect.stringContaining("### ✨ Features"));
      expect(changelog).toEqual(expect.stringContaining("### 🐛 Bug Fixes"));
      expect(changelog).toEqual(
        expect.stringContaining("### 🚨 Breaking Changes")
      );

      expect(changelog).not.toEqual(expect.stringContaining("WIP"));
      expect(changelog).not.toEqual(expect.stringContaining("🚧"));
      expect(changelog).not.toEqual(expect.stringContaining("Bad"));
      expect(changelog).not.toEqual(expect.stringContaining("#41"));
    });
  });

  it("should recognize BREAKING CHANGE note", () => {
    gitCommit("🐛 Fix feat\n\nBREAKING CHANGE: Xyz");
    return getChangelog().then(changelog => {
      expect(changelog).toContainString("### 🚨 Breaking Changes");
    });
  });

  it("should ignore emoji after the first one and put them in the subject", () => {
    gitCommit("🌟🛠 Multiemoji parsing");
    return getChangelog().then(changelog => {
      expect(changelog).toContainString("### ✨ Features");
      expect(changelog).toContainString("Multiemoji");
    });
  });

  it("should not print emojis for each commit by default", () => {
    gitCommit("🐛 fixed a bug");
    return getChangelog().then(changelog => {
      expect(changelog).toContainString("* fixed a bug");
    });
  });

  it("should print emojis for each commit if `showEmojiPerCommit` is provided", () => {
    gitCommit("🐛 fixed a bug");
    jest.setMock("../src/config", { showEmojiPerCommit: true });
    return getChangelog().then(changelog => {
      expect(changelog).toContainString("* 🐛 fixed a bug");
    });
  });
});
