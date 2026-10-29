/**
 * Native replacement for `emoji-regex`, based on Unicode property escapes.
 *
 * A single emoji may be followed by a skin tone modifier, a variation selector
 * (U+FE0E / U+FE0F), a keycap (U+20E3) or a tag sequence (i.e. flags of
 * subdivisions). Emojis may be joined with ZWJ (i.e. `👨‍💻`).
 */
const SINGLE_EMOJI =
  "\\p{Emoji}(?:\\p{Emoji_Modifier}|\\uFE0F?\\u20E3|[\\uFE0E\\uFE0F]|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?";

// `#`, `*` and digits are emojis only when followed by a keycap.
const NOT_BARE_KEYCAP_BASE = "(?![#*0-9](?!\\uFE0F?\\u20E3))";

/**
 * Creates an emoji regex (with `u` flag).
 *
 * - By default it behaves like `emoji-regex/text`: it matches text-presentation
 *   emojis too (i.e. `🛠` without U+FE0F), and bare `#`, `*`, `0-9`.
 * - With `strict`, bare `#`, `*` and digits are not matched, so it can be used
 *   to strip emojis from plain text (like `emoji-regex`).
 */
function createEmojiRegex({ strict = false, global = false } = {}) {
  const single = (strict ? NOT_BARE_KEYCAP_BASE : "") + SINGLE_EMOJI;
  const source = `\\p{Regional_Indicator}{2}|${single}(?:\\u200D${SINGLE_EMOJI})*`;

  return new RegExp(source, global ? "gu" : "u");
}

module.exports = {
  createEmojiRegex
};
