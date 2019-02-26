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

## Automatically fix commit messages

This package provides an additional bin script `favoloso-emoji-fix-commit`.

The scripts **changes commit messages**, from traditional conventional changelog
format (i.e. `feat: Add a magic feature`), to corresponding emoji (i.e. `✨ Add a magic feature`).

To use it, install [husky](https://github.com/typicode/husky)

```sh
yarn add --dev husky
```

Now in your package.json add:

```json
{
  "husky": {
    "commit-msg": "favoloso-emoji-fix-commit"
  }
}
```

Now any commit like `<type>: <msg>` will be automatically transformed with related
emoji. See _Available Emojis_ to see available **types**.

## Configuration

The package works as-is, but its behaviour may be customized with the following options.

> _Note:_ This package supports [`cosmiconfig`](https://github.com/davidtheclark/cosmiconfig#readme) to provide configuration options with `favolosoEmoji` module name.

- **`emojis`** (default: `{}`)

  An object allowing you to customize conventional-changelog types used (as _Available Emojis_ table).

  You should provide an object, where the key is the `type` you want to edit (or add), and the value is the
  updated configuration. Configurations will be merged with originals if existing.

  See the [wiki page](https://github.com/favoloso/conventional-changelog-emoji/wiki/Custom-Emojis) for further details.

- **`fixAliasedEmoji`** (default: `false`)

  Replaces aliased emojis (like 🌠) with default one (like ✨)

- **`showEmojiPerCommit`** (default: `false`)

  In the changelog, shows emoji for each commit. In the default mode (`false`), emojis are omitted from commits and only the heading contains them (i.e. `🐛 Bug Fixes`)

- **`minorForBreakingInDevelopment`** (default: `true`)

  Breaking changes during development will be considered as _minor_ instead of _major_ bumps (see [semver spec](https://semver.org/#spec-item-4)).

  > 4.  Major version zero (0.y.z) is for initial development. Anything may change at any time. The public API should not be considered stable.

### Example config in package.json

```json
{
  "favolosoEmoji": {
    "fixAliasedEmoji": true,
    "showEmojiPerCommit": false
  }
}
```

## Available Emojis

| Emoji | Type        | Version Bump | In Changelog? | Header              | Aliases  |
| ----- | ----------- | ------------ | ------------- | ------------------- | -------- |
| 🐛    | fix         | patch        | true          | 🐛 Bug Fixes        | 🐞       |
| 📚    | docs        | patch        | true          | 📚 Documentation    | 📖       |
| 🎨    | style       | patch        | false         | 🎨 Style            | 💄       |
| ♻️    | refactor    | patch        | true          | 🛠 Improvements      |
| 🏗     | chore       | patch        | true          | 🏗 Chore             |
| ✨    | feat        | minor        | true          | ✨ Features         | 🌟,🌠,💫 |
| 🚨    | breaking    | major        | true          | 🚨 Breaking Changes |
| 🛠     | improvement | patch        | true          | 🛠 Improvements      |
| 🚦    | test        | patch        | false         | 🚦 Test             | ✅       |
| 🔒    | security    | patch        | true          | 🔒 Security         | 🔑       |
| 📦    | build       | patch        | true          | 📦 Build            |
| 🔖    | release     | patch        | false         |                     |
| 🚧    | wip         | patch        | false         |                     |
