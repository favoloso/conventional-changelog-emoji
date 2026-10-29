const { createEmojiRegex } = require("../src/emoji/emoji-regex");

function emoji() {
  return require("../src/emoji/emoji");
}

function parseHeader(header) {
  const match = header.match(emoji().headerRegex);
  return match && { emoji: match[1], spaces: match[2], subject: match[3] };
}

describe("emoji regex", () => {
  const regex = new RegExp(`^(?:${createEmojiRegex().source})`, "u");
  const first = text => (text.match(regex) || [null])[0];

  it("should match single emojis, with or without variation selector", () => {
    expect(first("🐛 x")).toEqual("🐛");
    expect(first("🛠 x")).toEqual("🛠");
    expect(first("🛠️ x")).toEqual("🛠️");
    expect(first("© x")).toEqual("©");
  });

  it("should match sequences", () => {
    expect(first("👍🏽 x")).toEqual("👍🏽");
    expect(first("👨‍👩‍👧 x")).toEqual("👨‍👩‍👧");
    expect(first("🏳️‍🌈 x")).toEqual("🏳️‍🌈");
    expect(first("🇮🇹 x")).toEqual("🇮🇹");
    expect(first("1️⃣ x")).toEqual("1️⃣");
  });

  it("should match recent emojis", () => {
    expect(first("🫠 x")).toEqual("🫠");
  });

  it("should not match plain text", () => {
    expect(first("a b")).toBeNull();
    expect(first("ⓘ b")).toBeNull();
  });

  it("should match bare keycap bases like `emoji-regex/text`, unless strict", () => {
    expect(first("1 thing")).toEqual("1");
    const strict = createEmojiRegex({ strict: true, global: true });
    expect("1️⃣ Top 10 ✨".replace(strict, "")).toEqual(" Top 10 ");
  });
});

describe("emoji", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.setMock(
      "../src/config/config",
      require("../src/config/config-default")
    );
  });

  it("should ignore variation selectors when finding emojis", () => {
    expect(emoji().findEmoji("🛠").type).toEqual("improvement");
    expect(emoji().findEmoji("🛠️").type).toEqual("improvement");
    expect(emoji().findType("🏗")).toEqual("chore");
    expect(emoji().findAliased("⚙")).toEqual("🏗️");
    expect(emoji().isSameEmoji("✨️", "✨")).toBe(true);
  });

  it("should parse header emoji, spaces and subject", () => {
    expect(parseHeader("🏗️ Chore")).toEqual({
      emoji: "🏗️",
      spaces: " ",
      subject: "Chore"
    });
    expect(parseHeader("🛠  Improvement")).toEqual({
      emoji: "🛠",
      spaces: "  ",
      subject: "Improvement"
    });
    expect(parseHeader("✨️ Feat").emoji).toEqual("✨️");
    expect(parseHeader("🫠 Unknown").emoji).toEqual("🫠");
    expect(parseHeader("fix: no emoji")).toBeNull();
  });

  it("should escape custom emojis in header regex", () => {
    jest.setMock("../src/config/config", {
      ...require("../src/config/config-default"),
      emojis: { custom: { emoji: "+1" } }
    });
    expect(parseHeader("+1 Custom").emoji).toEqual("+1");
  });
});
