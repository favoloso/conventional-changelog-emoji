const fs = require("fs");
const os = require("os");
const path = require("path");
const searchConfig = require("../src/config/search-config");

describe("search config", () => {
  let root;
  let count = 0;

  function project(files) {
    const dir = path.join(root, `sub-${count++}`, "project");
    fs.mkdirSync(dir, { recursive: true });
    Object.keys(files).forEach(file => {
      fs.writeFileSync(path.join(dir, file), files[file]);
    });
    return dir;
  }

  function search(dir) {
    const result = searchConfig(dir, root);
    return result && result.config;
  }

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "favoloso-emoji-"));
  });

  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it("should read `favolosoEmoji` property in package.json", () => {
    const dir = project({
      "package.json": '{"favolosoEmoji":{"language":"it"}}'
    });
    expect(search(dir)).toEqual({ language: "it" });
  });

  it("should search in parent directories", () => {
    const dir = project({
      "package.json": '{"name":"x"}',
      "../package.json": '{"favolosoEmoji":{"language":"it"}}'
    });
    expect(search(dir)).toEqual({ language: "it" });
  });

  it("should read rc and js files", () => {
    expect(search(project({ ".favolosoEmojirc": '{"a":1}' }))).toEqual({
      a: 1
    });
    expect(search(project({ ".favolosoEmojirc.json": '{"b":2}' }))).toEqual({
      b: 2
    });
    expect(
      search(project({ "favolosoEmoji.config.js": "module.exports = {c: 3}" }))
    ).toEqual({ c: 3 });
  });

  it("should prefer package.json and skip empty files", () => {
    expect(
      search(
        project({
          "package.json": '{"favolosoEmoji":{"a":1}}',
          ".favolosoEmojirc": '{"b":2}'
        })
      )
    ).toEqual({ a: 1 });
    expect(
      search(
        project({ ".favolosoEmojirc": " \n", ".favolosoEmojirc.json": "{}" })
      )
    ).toEqual({});
  });

  it("should return null if nothing is found", () => {
    expect(searchConfig(project({}), root)).toBeNull();
  });

  it("should throw on YAML configuration", () => {
    expect(() =>
      search(project({ ".favolosoEmojirc": "language: it" }))
    ).toThrow(/YAML configuration is not supported anymore/);
  });
});
