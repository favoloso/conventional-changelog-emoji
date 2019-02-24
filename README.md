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

## Available Emojis

| Emoji | Type        | Version Bump | In Changelog? | Header              |
| ----- | ----------- | ------------ | ------------- | ------------------- |
| 🐛    | bug         | patch        | true          | 🐛 Bug Fixes        |
| 📚    | docs        | patch        | true          | 📚 Documentation    |
| 🎨    | style       | patch        | false         | 🎨 Style            |
| ♻️    | refactor    | patch        | true          | 🛠 Improvements      |
| 🏗     | chore       | patch        | true          | 🏗 Chore             |
| ✨    | feat        | minor        | true          | ✨ Features         |
| 🌟    | feat        | minor        | true          | ✨ Features         |
| 🚨    | breaking    | major        | true          | 🚨 Breaking Changes |
| 🛠     | improvement | patch        | true          | 🛠 Improvements      |
| 🚦    | test        | patch        | false         | 🚦 Test             |
| 🔒    | security    | patch        | true          | 🔒 Security         |
| 📦    | deps        | patch        | true          | 📦 Dependencies     |
| 🔖    | release     | patch        | false         |                     |
| 🚧    | wip         | patch        | false         |                     |
