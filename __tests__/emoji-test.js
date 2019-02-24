"use strict";
var conventionalChangelogCore = require("conventional-changelog-core");
var gitDummyCommit = require("git-dummy-commit");
var preset = require("../");
var fs = require("fs");
var path = require("path");
var shell = require("shelljs");

describe("emoji preset", () => {
  it("should work if there is no semver tag", () => {
    shell.config.silent = true;
    shell.rm("-rf", "tmp");
    shell.mkdir("tmp");
    shell.cd("tmp");
    shell.mkdir("git-templates");
    shell.exec("git init --template=./git-templates");

    gitDummyCommit(["✨ Aggiunta nuova feature\n\n🚨 Breaking!"]);
    gitDummyCommit(["✨ Aggiunto supporto per X Y Z (#55)\nABC"]);
    gitDummyCommit(["🐛 Corretto un bug (#56)"]);
    gitDummyCommit(["* WIP temporaneo"]);
    gitDummyCommit(["🚧 lavori in corso temporaneo"]);
    gitDummyCommit(["📚 Aggiunta anche la documentazione X Y Z"]);
    // shell.exec(
    //   `git commit -m "✨📈 Multi emoji supportate" --allow-empty --no-gpg-sign`
    // );

    return new Promise((resolve, reject) => {
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
    }).then(changelog => {
      console.log(changelog);
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
});
