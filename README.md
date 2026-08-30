# Engineering OS

[![CI](https://github.com/rahul-aot/engineering-os/actions/workflows/ci.yml/badge.svg)](https://github.com/rahul-aot/engineering-os/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> Learn once. Understand deeply. Never start from zero again.

A minimal, community-driven software-engineering knowledge base — structured
lessons in JavaScript, DSA, and System Design, from beginner to advanced.

It started as a personal project and is now open source — contributions of
new topics, corrections, and features are welcome.

## Stack

React + TypeScript + Vite + Material UI + React Router.

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```text
src/
  components/   Layout, Sidebar, Header, TopicList, TopicPage, CodeBlock, ...
  pages/        Home, Subject, Topic, Progress, Bookmarks
  content/      All lesson data (javascript/, dsa/, system-design/)
  hooks/        useProgress, useBookmarks, useSearch (all localStorage-backed)
  theme/        MUI theme (light/dark)
  types/        Shared content + progress types
  router/       Route definitions
```

Content lives entirely in `src/content/` as plain TypeScript data, organized
by subject and level. Adding a new topic means adding an entry to the
relevant `content/<subject>/<level>.ts` file — no component changes needed.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — typecheck and build for production
- `npm run lint` — run oxlint

## Contributing

Contributions are welcome — especially new topics and corrections to
existing ones. See [CONTRIBUTING.md](CONTRIBUTING.md) for the setup steps and
content conventions, and [AGENTS.md](AGENTS.md) for the fuller architecture
notes (also used by AI coding agents working in this repo). Please also read
the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE)
