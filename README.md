# @favoloso/conventional-changelog-emoji

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

This package provides an additional bin script `favoloso-emoji-fix-commit` that may
be used in order to fix commits using traditional conventional changelog
format (i.e. `feat: Add a magic feature`) and transform them in corresponding
emoji (i.e. `✨ Add a magic feature`).

Install [husky](https://github.com/typicode/husky)

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

### Additional configuration

> This package supports [`cosmiconfig`](https://github.com/davidtheclark/cosmiconfig#readme) to provide configuration options with `favoloso-emoji` module name.

- **`fixAliasedEmoji`** (default: `false`)

  Replaces aliased emojis (like 🌠) with default one (like ✨)

#### Example config in package.json

```json
{
  "favoloso-emoji": {
    "fixAliasedEmoji": true
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
