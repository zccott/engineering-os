# EngineeringWiki

[![CI](https://github.com/zccott/engineeringwiki/actions/workflows/ci.yml/badge.svg)](https://github.com/zccott/engineeringwiki/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/zccott/engineeringwiki/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/zccott/engineeringwiki/blob/main/CONTRIBUTING.md)

> Learn once. Understand deeply. Never start from zero again.

Website: https://engineeringwiki.vercel.app

An open-source software-engineering knowledge base with structured,
beginner-friendly lessons covering JavaScript, DSA, web fundamentals, backend
development, databases, design patterns, software architecture, and system
design — from beginner to advanced.

It started as a personal learning project and is now open source.
Contributions to topics, corrections, and features are welcome.

## Subjects

EngineeringWiki is organized around connected engineering subjects rather
than isolated technologies — the goal is for topics within and across
subjects to build on each other.

Currently available (see `src/content/`):

- JavaScript
- TypeScript
- DSA
- Web Fundamentals
- Backend
- Databases
- System Design
- Software Architecture

Long-term target structure for the core learning path:

- JavaScript
- DSA
- Web Fundamentals
- Backend
- Databases
- Design Patterns
- Software Architecture
- System Design

Design Patterns doesn't exist as content yet. TypeScript is available today
in addition to that core path.

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
  content/      All lesson data, organized by subject (see Subjects above)
  hooks/        useProgress, useBookmarks, useSearch (all localStorage-backed)
  theme/        MUI theme (light/dark)
  types/        Shared content + progress types
  router/       Route definitions
```

Content lives entirely in `src/content/` as plain TypeScript data, organized
by subject and level. Each topic follows the same structured learning
format, and adding a new topic should not require changes to UI components.

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

[MIT](https://github.com/zccott/engineeringwiki/blob/main/LICENSE) — covers
this project's own code and content. Contributions
are expected to be original (see
[Content licensing](CONTRIBUTING.md#content-licensing)); anything adapted
from a third-party source (docs, books, courses, etc.) keeps that source's
own license/attribution rather than being folded into this project's MIT
grant.
