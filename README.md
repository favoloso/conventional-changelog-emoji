# @favoloso/conventional-changelog-emoji

[![Travis CI](https://img.shields.io/travis/com/favoloso/conventional-changelog-emoji.svg)](https://travis-ci.com/favoloso/conventional-changelog-emoji)
[![Coveralls](https://img.shields.io/coveralls/github/favoloso/conventional-changelog-emoji/master.svg)](https://coveralls.io/github/favoloso/conventional-changelog-emoji)
[![npm](https://img.shields.io/npm/v/@favoloso/conventional-changelog-emoji.svg)](https://www.npmjs.com/package/@favoloso/conventional-changelog-emoji)

Conventional Changelog with Emojis support 🎉

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

## Lint (and fix) commit messages

This package provides an additional bin script `emoji-commit-lint`.

The scripts **lints and eventually changes commit messages**, from traditional conventional changelog
format (i.e. `feat: Add a magic feature`) to corresponding emoji (i.e. `✨ Add a magic feature`),
checks and applies correct casing (i.e. `lower-case`) and many more, as configured
by [**Linter Rules**](https://github.com/favoloso/conventional-changelog-emoji/wiki/Linter-Rules).

To use it, install [husky](https://github.com/typicode/husky)

```sh
yarn add --dev husky
```

Now in your package.json add:

```json
{
  "husky": {
    "hooks": {
      "commit-msg": "emoji-commit-lint"
    }
  }
}
```

Now linter will check your commits. Any commit like `<type>: <msg>` will be automatically
transformed with related emoji. See _Available Emojis_ to see available **types**.

## Configuration

The package works as-is, but its behaviour may be customized with the following options.

> _Note:_ This package supports [`cosmiconfig`](https://github.com/davidtheclark/cosmiconfig#readme) to provide configuration options with `favolosoEmoji` module name.

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
🛠 |  | `improvement` | `imp` | patch | ✅ | 🛠 Improvements | 30
⚡️ |  | `perf` | `performance` | patch | ✅ | ⚡️ Performance | 35
🐛 | 🐞 | `fix` |  | patch | ✅ | 🐛 Bug Fixes | 40
📚 | 📖 | `docs` | `doc` | patch | ✅ | 📚 Documentation | 50
🏗 | ⚙️ | `chore` | `chores` | patch | ✅ | 🏗 Chore | 60
♻️ |  | `refactor` |  | patch |  | ♻️ Refactoring | 90
🚦 | ✅ | `test` |  | patch |  | 🚦 Test | 90
🎨 | 💄 | `style` | `cleanup` | patch |  | 🎨 Style | 90
📦 |  | `build` | `deps` | patch |  | 📦 Build | 90
🔖 |  | `release` |  | patch |  | 🔖 Release | 90
🚧 |  | `wip` |  | patch |  | 🚧 Wip | 90

<!-- emoji-table -->
<!-- prettier-ignore-end -->
