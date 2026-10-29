# @favoloso/conventional-changelog-emoji

[![CI](https://github.com/favoloso/conventional-changelog-emoji/actions/workflows/ci.yml/badge.svg)](https://github.com/favoloso/conventional-changelog-emoji/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@favoloso/conventional-changelog-emoji.svg)](https://www.npmjs.com/package/@favoloso/conventional-changelog-emoji)

Conventional Changelog with Emojis support 🎉

The package has no runtime dependencies.

## Requirements

- `conventional-changelog` v8+ and `conventional-recommended-bump` v12+
  (i.e. [`@release-it/conventional-changelog`](https://github.com/release-it/conventional-changelog) v12+ and `release-it` v21+).
- Node.js v22+ (required by the tools above).

> Older tools (Handlebars-based `conventional-changelog-writer` v8 and below) are supported by v0.10.x.

## Installation

```sh
yarn add --dev @favoloso/conventional-changelog-emoji
```

or

```sh
npm install --save-dev @favoloso/conventional-changelog-emoji
```

## Usage

```sh
conventional-changelog -p @favoloso/emoji -i CHANGELOG.md -s
```

### Usage with `release-it`

You can use [conventional-changelog
plugin](https://github.com/release-it/conventional-changelog) with the
`@favoloso/emoji` preset.

```json
"release-it": {
  "plugins": {
    "@release-it/conventional-changelog": {
      "preset": "@favoloso/emoji",
      "infile": "CHANGELOG.md"
    }
  }
}
```

## Lint (and fix) commit messages

This package provides an additional bin script `emoji-commit-lint`.

The scripts **lints and eventually changes commit messages**, from traditional conventional changelog
format (i.e. `feat: Add a magic feature`) to corresponding emoji (i.e. `✨ Add a magic feature`),
checks and applies correct casing (i.e. `lower-case`) and many more, as configured
by [**Linter Rules**](https://github.com/favoloso/conventional-changelog-emoji/wiki/Linter-Rules).

To use it, install and initialize [husky](https://github.com/typicode/husky)

```sh
yarn add --dev husky
yarn husky init
```

Now add the `.husky/commit-msg` hook:

```sh
HUSKY_GIT_PARAMS="$1" npx emoji-commit-lint
```

Now linter will check your commits. Any commit like `<type>: <msg>` will be automatically
transformed with related emoji. See _Available Emojis_ to see available **types**.

## Configuration

The package works as-is, but its behaviour may be customized with the following options.

> _Note:_ Configuration is searched starting from the current directory up to the user home, in the following places (the first found wins):
> `favolosoEmoji` property in `package.json`, `.favolosoEmojirc` (JSON), `.favolosoEmojirc.json`, `.favolosoEmojirc.js`, `favolosoEmoji.config.js`.
> YAML files (`.favolosoEmojirc`, `.favolosoEmojirc.yaml`, `.favolosoEmojirc.yml`) are not supported anymore: please convert them to JSON.

- **`emojis`** (default: `{}`)

  An object allowing you to customize conventional-changelog types used (as _Available Emojis_ table).

  You should provide an object, where the key is the `type` you want to edit (or add), and the value is the
  updated configuration. Configurations will be merged with originals if existing.

  See the [**Custom Emoji** wiki page](https://github.com/favoloso/conventional-changelog-emoji/wiki/Custom-Emojis) for further details.

- **`rules`** (default: `{}`)

  Allows to customize linter rules.
  See the [**Linter Rules** wiki page](https://github.com/favoloso/conventional-changelog-emoji/wiki/Linter-Rules) for further details.

- **`showEmojiPerCommit`** (default: `false`)

  In the changelog, shows emoji for each commit. In the default mode (`false`), emojis are omitted from commits and only the heading contains them (i.e. `🐛 Bug Fixes`)

- **`minorForBreakingInDevelopment`** (default: `true`)

  Breaking changes during development will be considered as _minor_ instead of _major_ bumps (see [semver spec](https://semver.org/#spec-item-4)).

  > 4.  Major version zero (0.y.z) is for initial development. Anything may change at any time. The public API should not be considered stable.

- **`language`** (default: `en`)

  Allows to translate commits group heading in `CHANGELOG.md` (i.e. `🐛 Bug Fixes`) and in linter messages.
  Languages available: `en`, `it`

### Example config in package.json

```json
{
  "favolosoEmoji": {
    "showEmojiPerCommit": false
  }
}
```

## Available Emojis

<!-- prettier-ignore-start -->
<!-- emoji-table -->

 Emoji | Aliases | Type | Type Aliases | Version Bump | In Changelog? | Heading  | Order
 ----- | ------- | ---- | ------------ | ------------ | ------------- | -------  | -----
🚨 |  | `breaking` |  | major | ✅ | 🚨 Breaking Changes | 10
✨ | 🌟, 💫, 🌠 | `feat` |  | minor | ✅ | ✨ Features | 20
🔒 |  | `security` |  | patch | ✅ | 🔒 Security | 25
🛠️ |  | `improvement` | `imp` | patch | ✅ | 🛠️ Improvements | 30
⚡️ |  | `perf` | `performance` | patch | ✅ | ⚡️ Performance | 35
🐛 | 🐞 | `fix` |  | patch | ✅ | 🐛 Bug Fixes | 40
📚 | 📖 | `docs` | `doc` | patch | ✅ | 📚 Documentation | 50
🏗️ | ⚙️ | `chore` | `chores` | patch | ✅ | 🏗️ Chore | 60
🎨 | 💄 | `style` | `cleanup` | patch |  | 🎨 Style | 90
♻️ |  | `refactor` |  | patch |  | ♻️ Refactoring | 90
🚦 | ✅ | `test` |  | patch |  | 🚦 Test | 90
📦 |  | `build` | `deps` | patch |  | 📦 Build | 90
🔖 |  | `release` |  | patch |  | 🔖 Release | 90
🚧 |  | `wip` |  | patch |  | 🚧 Wip | 90

<!-- emoji-table -->
<!-- prettier-ignore-end -->
