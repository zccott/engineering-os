# Contributing

Engineering OS started as a personal learning knowledge base and is now open
source. The process below applies whether that's you-in-six-months or
someone else picking it up.

By participating, you're expected to follow the
[Code of Conduct](CODE_OF_CONDUCT.md).

- **Found a bug or something inaccurate?** Open an issue using the bug
  report or content-request template.
- **Want to add a topic or fix one?** See the section below, then open a PR
  — the PR template has a checklist.

## Setup

Requires **Node 22** (see `.nvmrc`).

```bash
nvm use 22          # or: source ~/.nvm/nvm.sh && nvm use 22
npm install
npm run dev
```

Before opening a PR / committing, both of these must be clean:

```bash
npm run build        # tsc -b && vite build
npm run lint          # oxlint
```

There's no test suite yet — the build + lint pass is the bar.

## The most common contribution: adding or editing a topic

Content lives entirely in `src/content/<subject>/<level>.ts` as plain data
(see `src/types/content.ts` for the `Topic` shape) — you should never need
to touch a component to add a topic.

1. Add a `Topic` object to the right `content/<subject>/<level>.ts` file (or
   create a new `<level>.ts` + wire it into that subject's `index.ts` if
   you're introducing a new level).
2. Follow the fixed template every topic uses: **What is it? → Explain Like
   I'm 10 → Simple Example → How It Works → Why Does This Exist? → Common
   Mistakes → Practice → Interview Questions → Related Topics.**
3. Write for a complete beginner: explain the behavior first, name the
   technical term second. Don't open with "X is..." — open with what a
   reader would observe or need, then introduce the term.
4. Long text fields (`explanation`, `howItWorks`, `whyItExists`) support
   blank-line paragraphs, `"- "` bullet blocks, and inline `**bold**` /
   `` `code` `` / `*italic*` — nothing else. The same inline markup works in
   `commonMistakes`, `exercises`, and `interviewQuestions`.
5. `relatedTopics` only resolves within the same subject — don't point at a
   topic id that lives in a different subject.
6. Run `npm run dev` and actually look at the topic page before committing —
   this is a reading-heavy app; broken formatting is easy to miss by
   skimming the source.

Full conventions (architecture, MUI version quirks, etc.) are documented in
[AGENTS.md](AGENTS.md) — read it before making structural changes.

## Code style

- TypeScript, strict — no `any` without a good reason.
- Relative imports only; there's no path alias configured.
- Match the existing component structure: one component per folder under
  `src/components/`, pages stay thin and delegate to `content/`/`hooks/`.
- Keep content and presentation separate — icons, routes, and other UI
  concerns for a subject belong in `src/content/subjectMeta.tsx`, not mixed
  into the content data itself.

## Commit / PR

- Small, focused commits/PRs — a batch of new topics, or one component
  change, not both at once.
- Branch off `main`; don't commit directly to it.
