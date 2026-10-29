"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const runner = path.resolve(__dirname, "utils/run-preset.mjs");

let repo;

// Utils

function git(...args) {
  execFileSync("git", args, { cwd: repo, stdio: "ignore" });
}

function prepareRepo() {
  repo = fs.mkdtempSync(path.join(os.tmpdir(), "favoloso-emoji-"));
  setConfig({});
  git("init");
  git("config", "user.name", "Test");
  git("config", "user.email", "test@example.com");
  git("config", "core.hooksPath", "/dev/null");
  gitCommit("initial commit");
}

/**
 * Configuration is read from `package.json` in the repository, like in
 * real projects.
 */
function setConfig(favolosoEmoji) {
  fs.writeFileSync(
    path.join(repo, "package.json"),
    JSON.stringify({
      name: "test",
      version: "99.0.0",
      repository: "https://github.com/favoloso/test",
      favolosoEmoji
    })
  );
}

function gitCommit(message) {
  git("commit", "--allow-empty", "--no-gpg-sign", "-m", message);
}

function gitTag(tag) {
  git("tag", "-a", tag, "-m", `version ${tag}`);
}

function run() {
  return JSON.parse(
    execFileSync(process.execPath, [runner], {
      cwd: repo,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    })
  );
}

function getChangelog() {
  return run().changelog;
}

function getBump() {
  return run().releaseType;
}

function getError() {
  try {
    run();
  } catch (e) {
    return e.stderr;
  }
  throw new Error("Preset should have failed");
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
    prepareRepo();
  });

  afterEach(() => {
    fs.rmSync(repo, { recursive: true, force: true });
  });

  it("should export a function returning parser, writer and whatBump", () => {
    const createPreset = require("..");
    expect(typeof createPreset).toBe("function");
    return createPreset().then(preset => {
      expect(Object.keys(preset)).toEqual(["parser", "writer", "whatBump"]);
      expect(preset.writer.template).toBeInstanceOf(Function);
      expect(preset.whatBump).toBeInstanceOf(Function);
    });
  });

  it("should work with all kind of commits", () => {
    gitCommit("✨ Aggiunta nuova feature\n\n🚨 Breaking!");
    gitCommit("✨ Aggiunto supporto per X Y Z (#55)\nABC");
    gitCommit("🐛 Corretto un bug (#56)");
    gitCommit("* WIP temporaneo");
    gitCommit("🚧 lavori in corso temporaneo");
    gitCommit("📚 Aggiunta anche la documentazione X Y Z");

    const changelog = getChangelog();
    expect(changelog).toContainString(
      "* Corretto un bug ([#56](https://github.com/favoloso/test/issues/56))"
    );
    expect(changelog).toContainString("### ✨ Features");
    expect(changelog).toContainString("### 🐛 Bug Fixes");
    expect(changelog).toContainString("### 🚨 Breaking Changes");

    expect(changelog).not.toContainString("WIP");
    expect(changelog).not.toContainString("🚧");
  });

  it("should render header, commits and links", () => {
    gitTag("v1.0.0");
    gitCommit("🐛 Fix @mario issue\n\nCloses #12");

    const changelog = getChangelog();
    expect(changelog).toMatch(
      /^# \[99\.0\.0\]\(https:\/\/github\.com\/favoloso\/test\/compare\/v1\.0\.0\.\.\.v99\.0\.0\) \(\d{4}-\d{2}-\d{2}\)\n\n\n### 🐛 Bug Fixes\n\n\* Fix \[@mario\]\(https:\/\/github\.com\/mario\) issue \(\[[0-9a-f]{7}\]\(https:\/\/github\.com\/favoloso\/test\/commit\/[0-9a-f]{7}\)\), closes \[#12\]\(https:\/\/github\.com\/favoloso\/test\/issues\/12\)\n$/
    );
  });

  it("should recognize BREAKING CHANGE note", () => {
    gitCommit("🐛 Fix feat\n\nBREAKING CHANGE: Xyz");
    const changelog = getChangelog();
    expect(changelog).toContainString("### 🚨 Breaking Changes\n\n* Xyz\n");
  });

  it("should recognize breaking change emoji", () => {
    gitCommit("🚨 Breaking commit");
    expect(getChangelog()).toContainString("### 🚨 Breaking Changes");
  });

  it("should ignore emoji after the first one and put them in the subject", () => {
    gitCommit("🌟🛠 Multiemoji parsing");
    const changelog = getChangelog();
    expect(changelog).toContainString("### ✨ Features");
    expect(changelog).toContainString("Multiemoji");
  });

  it("should group emojis with or without variation selector together", () => {
    gitCommit("🛠 senza selettore");
    gitCommit("🛠️ con selettore");
    gitCommit("🏗 chore senza selettore");
    const changelog = getChangelog();
    expect(changelog.match(/### 🛠️ Improvements/g)).toHaveLength(1);
    expect(changelog).toContainString("* senza selettore");
    expect(changelog).toContainString("* con selettore");
    expect(changelog).toContainString("* chore senza selettore");
  });

  it("should not print emojis for each commit by default", () => {
    gitCommit("🐛 fixed a bug");
    expect(getChangelog()).toContainString("* fixed a bug");
  });

  it("should print emojis for each commit if `showEmojiPerCommit` is provided", () => {
    gitCommit("🐛 fixed a bug");
    setConfig({ showEmojiPerCommit: true });
    expect(getChangelog()).toContainString("* 🐛 fixed a bug");
  });

  describe("version bump", () => {
    it("should recommend patch for fixes only", () => {
      gitCommit("🐛 fixed a bug");
      expect(getBump()).toEqual("patch");
    });

    it("should recommend patch for other kind of small tasks", () => {
      gitCommit("⚙️ chore something");
      gitCommit("♻️ refactor a b c");
      expect(getBump()).toEqual("patch");
    });

    it("should recommend minor for features", () => {
      gitCommit("🐛 fixed a bug");
      gitCommit("✨ sparkles joy with new feat");
      expect(getBump()).toEqual("minor");
    });

    it("should recommend major for breaking changes", () => {
      gitTag("v1.0.0");
      gitCommit("🐛 fixed a bug");
      gitCommit("✨ sparkles joy with new feat\n\nBREAKING CHANGE xyz");
      expect(getBump()).toEqual("major");
    });

    it("should allow 🚨 for breaking changes", () => {
      gitTag("v1.0.0");
      gitCommit("🐛 fixed a bug");
      gitCommit("✨ sparkles joy with new feat\n\n🚨 xyz");
      expect(getBump()).toEqual("major");
    });

    it("should put breaking changes into a minor in development", () => {
      gitTag("v0.3.2");
      gitCommit("✨ sparkles joy with new feat\n\n🚨 breaking");
      setConfig({ minorForBreakingInDevelopment: true });
      expect(getBump()).toEqual("minor");
    });

    it("should put breaking changes into a major if configured", () => {
      gitTag("v0.3.2");
      gitCommit("✨ sparkles joy with new feat\n\n🚨 breaking");
      setConfig({ minorForBreakingInDevelopment: false });
      expect(getBump()).toEqual("major");
    });

    it("should allow breaking changes directly from commits", () => {
      gitTag("v1.0.0");
      gitCommit("🚨 breaking!");
      expect(getBump()).toEqual("major");
    });
  });

  describe("changelog groups order", () => {
    it("should place groups in correct order", () => {
      gitCommit("🐛 fix 1");
      gitCommit("✨ feat");
      gitCommit("🚨 breaking");
      gitCommit("📚 docs");
      gitCommit("🛠 improvement");
      const changelog = getChangelog();
      expect(changelog.indexOf("🚨")).toBeLessThan(changelog.indexOf("✨"));
      expect(changelog.indexOf("✨")).toBeLessThan(changelog.indexOf("🛠"));
      expect(changelog.indexOf("🛠")).toBeLessThan(changelog.indexOf("🐛"));
      expect(changelog.indexOf("🐛")).toBeLessThan(changelog.indexOf("📚"));
    });

    it("should apply lexical sort to heading when index is the same", () => {
      gitCommit("🚦 test");
      gitCommit("✨ feat");
      gitCommit("📦 build");
      gitCommit("🛠 improvement");
      setConfig({
        emojis: {
          build: {
            inChangelog: true
          },
          test: {
            inChangelog: true
          }
        }
      });
      const changelog = getChangelog();
      expect(changelog.indexOf("📦")).toBeLessThan(changelog.indexOf("🚦"));
      expect(changelog.indexOf("✨")).toBeLessThan(changelog.indexOf("📦"));
    });
  });

  describe("custom emoji configuration", () => {
    it("should allow to override emoji configuration", () => {
      setConfig({
        emojis: {
          fix: {
            emoji: "🐞",
            heading: "🐞 Fiiix!"
          }
        }
      });
      gitCommit("🐞 A bug fixed");
      const changelog = getChangelog();
      expect(changelog).toContainString("🐞 Fiiix!");
      expect(changelog).not.toContainString("🐛");
    });

    it("should allow to add other kinds of emoji commits", () => {
      setConfig({
        emojis: {
          change: {
            emoji: "💼",
            inChangelog: true,
            heading: "💼 Changes"
          }
        }
      });
      gitCommit("💼 Business change");
      const changelog = getChangelog();
      expect(changelog).toContainString("* Business change");
      expect(changelog).toContainString("### 💼 Changes");
    });

    it("should throw if emoji group misses type or emoji", () => {
      setConfig({
        emojis: {
          change: {
            inChangelog: true,
            heading: "💼 Changes"
          }
        }
      });
      gitCommit("💼 Business change");
      expect(getError()).toContainString(
        'Make sure you are including at least an "emoji" and a "type" property.'
      );
    });

    it("should allow to remove existing groups", () => {
      setConfig({
        emojis: {
          chore: false
        }
      });
      gitCommit("🏗 a chore");
      const changelog = getChangelog();
      expect(changelog).not.toContainString("* a chore");
      expect(changelog).not.toContainString("### 🏗 Chore");
    });

    it("should provide helpful warning if trying to remove undefined emoji", () => {
      setConfig({
        emojis: {
          choree: false
        }
      });
      gitCommit("🏗 a chore");
      expect(getError()).toContainString(
        'Cannot remove emoji group "choree" since it is not defined.'
      );
    });
  });

  describe("heading translations", () => {
    it("should allow to translate headings", () => {
      gitCommit("🚦 test");
      gitCommit("✨ feat");
      gitCommit("📦 build");
      gitCommit("⚡️ perfo");
      gitCommit("🛠 improvement");
      setConfig({
        language: "it"
      });
      const changelog = getChangelog();
      expect(changelog).toContainString("### ⚡️ Performance");
      expect(changelog).toContainString("### ✨ Nuove Funzionalità");
      expect(changelog).toContainString("### 🛠 Migliorie");
      expect(changelog).not.toContainString("### ✨ Features");
    });
  });
});
