"use strict";
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");

const root = path.resolve(__dirname, "..");
const tmp = path.resolve(root, "tmp");

// Utils

function prepareRepo() {
  shell.config.silent = true;
  shell.cd(root);
  shell.rm("-rf", "tmp");
  shell.mkdir("tmp");
  shell.cd("tmp");
  shell.mkdir("git-templates");
  shell.exec("git init --template=./git-templates");
  shell.exec(`git commit -m "initial commit" --allow-empty --no-gpg-sign`);
}

function getChangelog() {
  return new Promise((resolve, reject) => {
    try {
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
    } catch (e) {
      reject(e);
    }
  });
}

function getBump() {
  return new Promise((resolve, reject) => {
    const preset = require("..");
    const conventionalRecommendedBump = require("conventional-recommended-bump");
    conventionalRecommendedBump(
      {
        config: preset,
        warn: (...m) => console.log(...m)
      },
      (error, recommendation) => {
        if (error) {
          reject(error);
        } else {
          resolve(recommendation);
        }
      }
    );
  });
}

function gitCommit(message) {
  shell.cd(tmp);
  shell.exec(`git commit -m "${message}" --allow-empty --no-gpg-sign`);
}

function gitTag(tag) {
  shell.cd(tmp);
  shell.exec(`git tag -a ${tag} -m "version ${tag}"`);
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
    jest.setMock(
      "../src/config/config",
      require("../src/config/config-default")
    );
    prepareRepo();
  });

  afterEach(() => {
    shell.cd("..");
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

  it("should recognize breaking change emoji", () => {
    gitCommit("🚨 Breaking commit");
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
    jest.setMock("../src/config/config", { showEmojiPerCommit: true });
    return getChangelog().then(changelog => {
      expect(changelog).toContainString("* 🐛 fixed a bug");
    });
  });

  describe("version bump", () => {
    it("should recommend patch for fixes only", () => {
      gitCommit("🐛 fixed a bug");
      return getBump().then(recommendation => {
        expect(recommendation.releaseType).toEqual("patch");
      });
    });

    it("should recommend patch for other kind of small tasks", () => {
      gitCommit("⚙️ chore something");
      gitCommit("♻️ refactor a b c");
      return getBump().then(recommendation => {
        expect(recommendation.releaseType).toEqual("patch");
      });
    });

    it("should recommend minor for features", () => {
      gitCommit("🐛 fixed a bug");
      gitCommit("✨ sparkles joy with new feat");
      return getBump().then(recommendation => {
        expect(recommendation.releaseType).toEqual("minor");
      });
    });

    it("should recommend major for breaking changes", () => {
      gitTag("v1.0.0");
      gitCommit("🐛 fixed a bug");
      gitCommit("✨ sparkles joy with new feat\n\nBREAKING CHANGE xyz");
      return getBump().then(recommendation => {
        expect(recommendation.releaseType).toEqual("major");
      });
    });

    it("should allow 🚨 for breaking changes", () => {
      gitTag("v1.0.0");
      gitCommit("🐛 fixed a bug");
      gitCommit("✨ sparkles joy with new feat\n\n🚨 xyz");
      return getBump().then(recommendation => {
        expect(recommendation.releaseType).toEqual("major");
      });
    });

    it("should put breaking changes into a minor in development", () => {
      gitTag("v0.3.2");
      gitCommit("✨ sparkles joy with new feat\n\n🚨 breaking");
      jest.setMock("../src/config/config", {
        minorForBreakingInDevelopment: true
      });
      return getBump().then(recommendation => {
        expect(recommendation.releaseType).toEqual("minor");
      });
    });

    it("should put breaking changes into a major if configured", () => {
      gitTag("v0.3.2");
      gitCommit("✨ sparkles joy with new feat\n\n🚨 breaking");
      jest.setMock("../src/config/config", {
        minorForBreakingInDevelopment: false
      });
      return getBump().then(recommendation => {
        expect(recommendation.releaseType).toEqual("major");
      });
    });

    it("should allow breaking changes directly from commits", () => {
      gitTag("v1.0.0");
      gitCommit("🚨 breaking!");
      return getBump().then(recommendation => {
        expect(recommendation.releaseType).toEqual("major");
      });
    });
  });

  describe("changelog groups order", () => {
    it("should place groups in correct order", () => {
      gitCommit("🐛 fix 1");
      gitCommit("✨ feat");
      gitCommit("🚨 breaking");
      gitCommit("📚 docs");
      gitCommit("🛠 improvement");
      return getChangelog().then(changelog => {
        expect(changelog.indexOf("🚨")).toBeLessThan(changelog.indexOf("✨"));
        expect(changelog.indexOf("✨")).toBeLessThan(changelog.indexOf("🛠"));
        expect(changelog.indexOf("🛠")).toBeLessThan(changelog.indexOf("🐛"));
        expect(changelog.indexOf("🐛")).toBeLessThan(changelog.indexOf("📚"));
      });
    });

    it("should apply lexical sort to heading when index is the same", () => {
      gitCommit("🚦 test");
      gitCommit("✨ feat");
      gitCommit("📦 build");
      gitCommit("🛠 improvement");
      jest.setMock("../src/config/config", {
        emojis: {
          build: {
            inChangelog: true
          },
          test: {
            inChangelog: true
          }
        }
      });
      return getChangelog().then(changelog => {
        // console.log(changelog);
        expect(changelog.indexOf("📦")).toBeLessThan(changelog.indexOf("🚦"));
        expect(changelog.indexOf("✨")).toBeLessThan(changelog.indexOf("📦"));
      });
    });
  });

  describe("custom emoji configuration", () => {
    it("should allow to override emoji configuration", () => {
      jest.setMock("../src/config/config", {
        emojis: {
          fix: {
            emoji: "🐞",
            heading: "🐞 Fiiix!"
          }
        }
      });
      gitCommit("🐞 A bug fixed");
      return getChangelog().then(changelog => {
        expect(changelog).toContainString("🐞 Fiiix!");
        expect(changelog).not.toContainString("🐛");
      });
    });

    it("should allow to add other kinds of emoji commits", () => {
      jest.setMock("../src/config/config", {
        emojis: {
          change: {
            emoji: "💼",
            inChangelog: true,
            heading: "💼 Changes"
          }
        }
      });
      gitCommit("💼 Business change");
      return getChangelog().then(changelog => {
        expect(changelog).toContainString("* Business change");
        expect(changelog).toContainString("### 💼 Changes");
      });
    });

    it("should throw if emoji group misses type or emoji", () => {
      jest.setMock("../src/config/config", {
        emojis: {
          change: {
            inChangelog: true,
            heading: "💼 Changes"
          }
        }
      });
      gitCommit("💼 Business change");
      return getChangelog().catch(e => {
        expect(e).toMatchInlineSnapshot(`
[Error: Cannot process emoji:

      "{"type":"change","inChangelog":true,"heading":"💼 Changes"}".

      Make sure you are including at least an "emoji" and a "type" property.]
`);
      });
    });

    it("should allow to remove existing groups", () => {
      jest.setMock("../src/config/config", {
        emojis: {
          chore: false
        }
      });
      gitCommit("🏗 a chore");
      return getChangelog().then(changelog => {
        expect(changelog).not.toContainString("* a chore");
        expect(changelog).not.toContainString("### 🏗 Chores");
      });
    });

    it("should provide helpful warning if trying to remove undefined emoji", () => {
      jest.setMock("../src/config/config", {
        emojis: {
          choree: false
        }
      });
      gitCommit("🏗 a chore");
      return getChangelog().catch(e => {
        expect(e).toMatchObject(
          new Error(
            'Cannot remove emoji group "choree" since it is not defined.'
          )
        );
      });
    });
  });

  describe("heading translations", () => {
    it("should allow to translate headings", () => {
      gitCommit("🚦 test");
      gitCommit("✨ feat");
      gitCommit("📦 build");
      gitCommit("⚡️ perfo");
      gitCommit("🛠 improvement");
      jest.setMock("../src/config/config", {
        language: "it"
      });
      return getChangelog().then(changelog => {
        expect(changelog).toContainString("### ⚡️ Performance");
        expect(changelog).toContainString("### ✨ Nuove Funzionalità");
        expect(changelog).toContainString("### 🛠 Migliorie");
        expect(changelog).not.toContainString("### ✨ Features");
      });
    });
  });
});
