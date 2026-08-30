# AGENTS.md

Instructions for AI coding agents working in this repo.

## What this is

**EngineeringWiki** — a personal software-engineering learning site. Purpose:
"Learn once. Understand deeply. Never start from zero again." It's a
content-driven React app, not a product with business logic — most of the
value lives in `src/content/`, not in components.

## Stack

React 19 + TypeScript + Vite + Material UI (MUI) v9 + React Router v7. No
other UI/state libraries — don't add one without a strong reason.

## Setup & commands

This repo requires **Node 22** (see `.nvmrc`). If the active Node version is
older (check `node -v`), switch before installing or running anything:

```bash
source ~/.nvm/nvm.sh && nvm use 22
```

```bash
npm install        # first time, or after switching Node versions —
                    # oxlint's native binding is platform/Node-specific
                    # and needs a fresh install if it fails to load
npm run dev         # vite dev server
npm run build       # tsc -b && vite build — treat both steps as required checks
npm run lint        # oxlint
```

There is no test suite. Before calling a change done, run `npm run build`
(typecheck + build) and `npm run lint` — both must be clean.

## Architecture

```text
src/
  content/      Pure data. One file per subject/level (e.g. content/javascript/beginner.ts).
                Each subject has an index.ts that assembles it into a Subject,
                and src/content/index.ts wires all subjects together plus
                lookup helpers (getSubject, getTopic, findTopicAnywhere).
                subjectMeta.tsx maps subject id -> icon + route (UI concern,
                kept out of the content data on purpose).
  types/        content.ts (Topic/Subject/CodeExample/... shapes) and
                progress.ts (localStorage keys + progress types).
  hooks/        useProgress, useBookmarks — localStorage-backed, shared
                app-wide via a module-level store + useSyncExternalStore
                (NOT local useState — multiple components must see the same
                state, e.g. Sidebar progress and a Topic page's "mark
                complete" button). useSearch — in-memory client-side search.
  components/   Layout/Header/Sidebar (app shell), TopicList (subject page
                topic rows), TopicPage + RichText (renders the full topic
                template), CodeBlock, InterviewQuestions, RelatedTopics,
                ProgressBar, Search/SearchDialog.
  pages/        Home, Subject, Topic, Progress, Bookmarks — thin route
                components that pull data from content/ and hooks/ and hand
                it to the components above.
  router/       Route table (react-router v6/v7 Routes/Route, not a data router).
  theme/        Single MUI theme (createTheme with colorSchemes for light/dark).
```

**No path aliases.** Imports are relative throughout — keep new files
consistent with that rather than introducing a `@/` alias.

## Content conventions (read this before adding/editing a topic)

Every `Topic` (see `src/types/content.ts`) follows a fixed template — What is
it? / Explain Like I'm 10 / Simple Example / How It Works / Why Does This
Exist? / Common Mistakes / Practice / Interview Questions / Related Topics.
Keep new topics in that shape.

- **Explain first, name the concept second.** Don't open with "Lexical
  scoping is..." — open with the plain-language behavior, then introduce the
  term.
- **Assume no prior knowledge.** Avoid unexplained jargon in the "What is
  it?" section specifically.
- Long-form fields (`explanation`, `howItWorks`, `whyItExists`) are plain
  strings with light markup, rendered by `RichText`/`InlineText`
  (`src/components/TopicPage/RichText.tsx`):
  - Blank line = new paragraph.
  - A block where every line starts with `"- "` renders as a bullet list.
  - Inline `**bold**`, `` `code` ``, and `*italic*` are supported — nothing
    else (no headings, links, etc. inside these strings).
- `relatedTopics` are resolved **within the same subject only**
  (`RelatedTopics` looks up `getTopic(subjectId, id)` and silently skips
  anything that doesn't resolve) — don't reference a topic id from a
  different subject expecting it to link there.
- `commonMistakes`, `exercises[].prompt`, `interviewQuestions[].question/answer`,
  and `examples[].title/explanation` also go through the same inline
  `**bold**`/`` `code` ``/`*italic*` parser (via `InlineText`) — use that
  markup rather than raw HTML or literal backticks-as-decoration.
- Adding a topic = adding an entry to `content/<subject>/<level>.ts` and
  nothing else. Don't hardcode content into components.

## MUI version notes (this repo pins `@mui/material` v9)

Several props from older MUI versions/tutorials are gone in this version —
don't reach for them out of habit:

- `ListItemText`: no `primaryTypographyProps`/`secondaryTypographyProps` —
  use `slotProps={{ primary: {...} }}` / `slotProps={{ secondary: {...} }}`.
- `Dialog`: no `PaperProps` in the new slots API — use
  `slotProps={{ paper: {...} }}`.
- Icon names are exact — check
  `node_modules/@mui/icons-material` if unsure (e.g. it's
  `CheckCircleOutlineOutlined`, not `CheckCircleOutline`).
- Dark mode uses `useColorScheme()` from `@mui/material/styles` (the theme
  is created with `colorSchemes: { light, dark }` + `cssVariables`), not a
  manually-managed boolean + two theme objects.

## Known environment quirk

`oxlint`'s native binding is installed per-Node-version/platform. If
`npx oxlint` fails with "Cannot find native binding", it almost always means
`npm install` ran under a different Node version than the one currently
active — switch to Node 22 (`nvm use 22`) and re-run `npm install`.
