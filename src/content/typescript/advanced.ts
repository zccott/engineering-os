import type { Topic } from "../../types/content";

export const typescriptAdvancedTopics: Topic[] = [
  {
    id: "mapped-types",
    title: "Mapped Types",
    level: "advanced",
    description:
      "Building a brand-new type by looping over every property of an existing type and transforming each one the same way.",
    explanation: `
You've already used utility types like \`Partial<T>\` and \`Record<K, V>\` —
built-in helpers that take a type and produce a related one. Have you
wondered how something like \`Partial<T>\` is actually implemented? It's
not a compiler special case; it's built using a feature you can use
yourself, called a **mapped type**.

A mapped type looks like an object type, but instead of listing properties
by name, it loops over the keys of another type using a syntax similar to
a \`for...in\` loop: \`{ [K in keyof T]: ... }\`. \`keyof T\` gives you a
union of all of \`T\`'s property names, and the mapped type then produces a
new property for *each* of those names, letting you transform the type of
every property the same way — add \`?\` to make them optional, wrap them,
change their type, or even change whether they're \`readonly\`.
    `.trim(),
    analogy:
      "A mapped type is like running every item on a checklist through the same rubber stamp. Whatever properties the original type has, the stamp visits each one in turn and applies the same transformation — \"make it optional,\" \"make it read-only,\" \"wrap it in a box\" — without you ever having to name the properties by hand.",
    examples: [
      {
        title: "Reimplementing Partial and Readonly by hand",
        code: `interface Task {
  title: string;
  done: boolean;
}

// This is essentially how the built-in Partial<T> works internally
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// And how Readonly<T> works
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

type PartialTask = MyPartial<Task>;   // { title?: string; done?: boolean }
type ReadonlyTask = MyReadonly<Task>; // { readonly title: string; readonly done: boolean }`,
        explanation:
          "`[K in keyof T]` loops over every key of `Task` (`\"title\"` and `\"done\"`), and `T[K]` looks up that property's original type. Adding `?` or `readonly` in front applies that modifier to every generated property at once.",
        walkthrough: [
          { code: "type MyPartial<T> = {", explanation: "Declares a generic mapped type that will transform any type T passed in." },
          { code: "  [K in keyof T]?: T[K];", explanation: "For each key K of T, produce an optional property of the same name, with T's original type for that key." },
          { code: "type PartialTask = MyPartial<Task>;", explanation: "Substituting Task for T expands the mapped type into { title?: string; done?: boolean }." },
        ],
      },
      {
        title: "Transforming property types, not just modifiers",
        code: `interface Config {
  host: string;
  port: number;
  debug: boolean;
}

// Turn every property into a function that returns its original type
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type ConfigGetters = Getters<Config>;
// {
//   getHost: () => string;
//   getPort: () => number;
//   getDebug: () => boolean;
// }`,
        explanation:
          "Mapped types can also rename keys (using an `as` clause) and change each property's type entirely — here, every original property becomes a zero-argument function returning that property's type, with a renamed \"getX\" key.",
      },
    ],
    howItWorks: `
When the compiler encounters \`{ [K in keyof T]: ... }\`, it first resolves
\`keyof T\` to the union of \`T\`'s literal property-name types (for
\`Task\`, that's \`"title" | "done"\`). It then iterates that union once per
member, binding \`K\` to each individual key in turn, and generates one
property per iteration using whatever expression appears after the colon
(often \`T[K]\`, an **indexed access type** that looks up the type of that
specific property on \`T\`). The optional \`as\` clause lets each iteration
rename the resulting key instead of keeping the original name. All of this
happens purely at compile time — the result is a fully expanded object
type with no loop or runtime cost involved.
    `.trim(),
    whyItExists: `
Without mapped types, transforming every property of a type the same way
(making them all optional, all readonly, all wrapped in a function) would
require manually rewriting the type by hand every time the original
changed, or hard-coding a small set of transformations directly into the
compiler. Mapped types let library authors and everyday developers alike
express "apply this transformation to every property" once, generically,
for any type — which is exactly how built-in utility types like
\`Partial\`, \`Readonly\`, and \`Record\` are themselves implemented.
    `.trim(),
    whenToUse: `
Reach for a mapped type when none of the built-in utility types quite do
what you need — for example, turning every property into a getter
function, deeply changing property names in a predictable pattern, or
building a domain-specific transformation (like a "validators" object
mirroring a form's fields) that you'll reuse across multiple types.
    `.trim(),
    whenNotToUse: `
If a built-in utility type (\`Partial\`, \`Pick\`, \`Omit\`, \`Record\`,
\`Readonly\`) already does what you need, use that directly instead of
reinventing it — it's clearer to readers already familiar with the
standard set. Save custom mapped types for transformations those built-ins
genuinely don't cover.
    `.trim(),
    commonMistakes: [
      "Forgetting that `keyof T` produces a union of T's key names, not an array — you can't use array methods on it, only union-style operations.",
      "Writing `[K in keyof T]: T` instead of `[K in keyof T]: T[K]`, which repeats the same whole type for every property instead of looking up each individual property's own type.",
      "Not realizing that renaming keys requires the `as` clause — writing `[K in keyof T]: ...` alone can transform values but never changes the key names themselves.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a mapped type `Nullable<T>` that turns every property of T into `T[K] | null`, keeping the property required." },
      { difficulty: "Medium", prompt: "Write a mapped type `Stringify<T>` that turns every property of T into a `string`, regardless of its original type." },
      { difficulty: "Hard", prompt: "Write a mapped type `EventHandlers<T>` that, for an object type T describing event names mapped to payload types, produces a new type where each key is renamed to `on\\${Capitalize<key>}` and each value is a function taking that payload and returning void." },
    ],
    interviewQuestions: [
      { question: "What is a mapped type?", answer: "A type that generates a new object type by iterating over the keys of an existing type (via `[K in keyof T]`) and applying the same transformation to each resulting property." },
      { question: "What does `keyof T` produce?", answer: "A union type made up of the literal names of every property on T." },
      { question: "How are built-in utility types like `Partial<T>` implemented?", answer: "They are themselves ordinary mapped types defined in TypeScript's standard type definitions — for example, Partial<T> is `{ [K in keyof T]?: T[K] }`." },
    ],
    prerequisites: ["generics", "utility-types"],
    relatedTopics: ["utility-types", "conditional-types", "generics"],
    keywords: ["mapped types", "keyof", "indexed access type", "Partial implementation", "as clause"],
  },
  {
    id: "conditional-types",
    title: "Conditional Types",
    level: "advanced",
    description:
      "A type that resolves to one of two different types, chosen based on a check performed entirely at compile time.",
    explanation: `
Normal code can branch based on a runtime condition — an \`if\` statement
picks one path or another depending on a value known while the program is
running. Types can branch too, just at a different time: while the
compiler is checking your code, before anything runs.

A **conditional type** looks like a ternary expression, but written with
types instead of values: \`T extends U ? X : Y\`. It reads as: "if type
\`T\` is assignable to type \`U\`, resolve to type \`X\`; otherwise, resolve
to type \`Y\`." This lets a type alias produce a different result depending
on what type it's given — for example, a type that resolves to \`true\` or
\`false\` depending on whether the input is a string.

Conditional types become especially powerful combined with \`infer\`,
which lets you *extract* and name a piece of a type inside the \`extends\`
check, instead of just testing it. \`infer\` is how TypeScript can express
things like "give me the return type of this function" or "give me the
type inside this array," purely as a type-level computation.
    `.trim(),
    analogy:
      "A conditional type is like a sorting machine on an assembly line: each item that comes down the belt (a type) gets tested against a gauge, and depending on whether it fits, it's routed onto one of two different output belts — all decided automatically, before the item ever reaches the end of the line, based purely on its shape.",
    examples: [
      {
        title: "A basic conditional type",
        code: `type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>;      // false

// Conditional types are often used to build safer utility types:
type NonNullableCustom<T> = T extends null | undefined ? never : T;

type C = NonNullableCustom<string | null>; // string`,
        explanation:
          "`IsString<T>` checks, purely at the type level, whether `T` is assignable to `string`, and resolves to the literal type `true` or `false` accordingly. `NonNullableCustom` uses the same mechanism to strip `null`/`undefined` out of a type.",
        walkthrough: [
          { code: "type IsString<T> = T extends string ? true : false;", explanation: "Declares a conditional type: if T extends (is assignable to) string, resolve to true, otherwise false." },
          { code: 'type A = IsString<"hello">;', explanation: "The literal type \"hello\" is assignable to string, so A resolves to true." },
          { code: "type B = IsString<42>;", explanation: "The literal type 42 is not assignable to string, so B resolves to false instead." },
        ],
      },
      {
        title: "Extracting a type with infer",
        code: `type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<string>>; // string
type B = UnwrapPromise<number>;          // number (unchanged — not a Promise)

// TypeScript's own built-in ReturnType<T> works the same way:
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: "Ana" };
}

type User = MyReturnType<typeof getUser>; // { id: number; name: string }`,
        explanation:
          "`infer U` introduces a new type variable, U, that TypeScript fills in by matching the shape of `Promise<infer U>` against the actual type — effectively pulling out whatever was inside the Promise. The same trick, applied to a function's return position, is how the built-in `ReturnType<T>` is implemented.",
      },
    ],
    howItWorks: `
When the compiler evaluates \`T extends U ? X : Y\`, it checks — purely
structurally, at compile time — whether every value of type \`T\` would
also be a valid value of type \`U\`. If so, the whole expression resolves
to \`X\`; if not, it resolves to \`Y\`. When \`infer\` appears inside the
\`extends\` clause, the compiler doesn't just check a yes/no match — it
tries to match the overall shape (like \`Promise<...>\` or a function
signature) against \`T\`, and whatever type lines up with the \`infer\`
placeholder gets bound to that new type variable, which then becomes
available to use in the \`X\` branch. If \`T\` is itself a union, the
conditional type is checked against *each member of the union
separately* and the results are combined back into a union — this
behavior is called a **distributive conditional type**.
    `.trim(),
    whyItExists: `
Some type-level logic genuinely needs to branch on what kind of type it's
looking at — extracting the awaited value out of a Promise type, pulling a
function's return type out of its signature, or filtering a union down to
just the members that match a pattern. Conditional types (with **infer**)
give the type system a way to express that branching and extraction
directly, without which those transformations would be impossible to
describe generically.
    `.trim(),
    whenToUse: `
Reach for a conditional type when you're building a reusable, generic type
transformation whose result genuinely depends on the shape of its input —
extracting a piece of a wrapped type, building type-level utilities beyond
what's built in, or filtering a union type down based on some structural
test.
    `.trim(),
    whenNotToUse: `
For everyday application code, conditional types are rarely necessary —
they mostly show up inside library and utility-type code. If a simple
union, mapped type, or one of the built-in utility types already expresses
what you need, prefer that; conditional types (especially with **infer**)
are noticeably harder for other developers to read at a glance.
    `.trim(),
    commonMistakes: [
      "Writing a conditional type expecting it to run once, without realizing that when T is a union, the condition is checked separately against each member (distributive conditional types), which can produce a broader union than expected.",
      "Using `infer` outside of an `extends` clause, where it isn't valid — `infer` can only appear as part of a conditional type's structural check.",
      "Overusing conditional types for logic that would be clearer and easier to read as a plain union or a simpler mapped type.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a conditional type `IsArray<T>` that resolves to `true` if T is an array type, and `false` otherwise." },
      { difficulty: "Medium", prompt: "Write a conditional type `ElementType<T>` that, given an array type T, uses `infer` to extract and return the type of its elements (e.g. `ElementType<string[]>` is `string`)." },
      { difficulty: "Hard", prompt: "Write a conditional type `Flatten<T>` that, given either `T` or `T[]`, always resolves to `T` — flattening away one level of array wrapping if present, and leaving non-array types unchanged." },
    ],
    interviewQuestions: [
      { question: "What is a conditional type?", answer: "A type-level expression of the form `T extends U ? X : Y` that resolves to X if T is assignable to U, and to Y otherwise, evaluated entirely at compile time." },
      { question: "What does the `infer` keyword do inside a conditional type?", answer: "It introduces a new type variable that the compiler fills in by structurally matching the surrounding pattern (like `Promise<infer U>`) against the actual type, letting you extract a piece of that type for use in the result." },
      { question: "What is a distributive conditional type?", answer: "The behavior where, if the type being checked in a conditional type is a union, the condition is applied separately to each member of the union and the results are combined back into a union, rather than being checked once against the whole union." },
    ],
    prerequisites: ["generics", "mapped-types"],
    relatedTopics: ["mapped-types", "utility-types", "type-narrowing"],
    keywords: ["conditional types", "extends", "infer", "distributive conditional types", "ReturnType"],
  },
  {
    id: "declaration-files",
    title: "Declaration Files (.d.ts)",
    level: "advanced",
    description:
      "A file that describes the shape of existing JavaScript code, without containing any actual implementation, so TypeScript can check code that uses it.",
    explanation: `
Not all code you use is written in TypeScript. A huge amount of the
JavaScript ecosystem — older libraries, many npm packages, code your team
wrote years ago — is plain \`.js\`, with no type annotations at all. If you
import one of those into a TypeScript project, the compiler has no way to
know what shape its functions, objects, and exports actually have, so
every value coming from it effectively becomes \`any\`.

A **declaration file**, ending in \`.d.ts\`, solves this by describing the
*shape* of that JavaScript — every exported function's signature, every
exported object's structure — without containing any real logic at all.
It's pure type information, describing what's already there, so the
compiler can check code that uses that library the same way it would check
a fully-typed TypeScript module.

You'll encounter these in two common ways: many popular libraries ship
their own \`.d.ts\` files describing themselves, and for libraries that
don't, the community-maintained \`DefinitelyTyped\` project publishes
separate \`@types/<package-name>\` packages containing hand-written
declaration files for them.
    `.trim(),
    analogy:
      "A declaration file is like an appliance's spec sheet, sold separately from the appliance itself. The spec sheet tells you exactly what buttons exist, what each one accepts, and what it outputs — without containing any of the actual wiring inside. TypeScript reads the spec sheet to check that you're using the appliance correctly, even though the real appliance was built by someone else in a completely different factory.",
    examples: [
      {
        title: "Describing an existing JavaScript module",
        code: `// mathUtils.js — a plain JavaScript file, no types
function double(x) {
  return x * 2;
}

module.exports = { double };`,
        explanation:
          "This is ordinary, untyped JavaScript. Imported directly into a TypeScript project with no declaration file, `double` would be typed as `any`, and TypeScript couldn't catch a mistaken call like `double(\"5\")`.",
      },
      {
        title: "A matching declaration file",
        code: `// mathUtils.d.ts — describes mathUtils.js, contains no implementation
declare function double(x: number): number;

export { double };`,
        explanation:
          "Placing this file alongside `mathUtils.js` gives TypeScript enough information to type-check every import of `mathUtils`, as if it had been written in TypeScript from the start — even though the actual logic still lives entirely in the `.js` file.",
        walkthrough: [
          { code: "// mathUtils.d.ts", explanation: "The .d.ts extension marks this as a declaration-only file — TypeScript expects no runtime code inside it." },
          { code: "declare function double(x: number): number;", explanation: "declare tells TypeScript \"trust that this function exists somewhere at runtime, with exactly this signature\" — it does not generate or require any implementation here." },
          { code: "export { double };", explanation: "Exports the described function so other TypeScript files importing mathUtils get full type checking on it." },
        ],
      },
    ],
    howItWorks: `
A \`.d.ts\` file uses the \`declare\` keyword to describe things that exist
elsewhere at runtime — functions, variables, classes, whole modules —
without providing their actual implementation. When you import from a
\`.js\` file that has a matching \`.d.ts\` file nearby (or a separately
installed \`@types/<package>\` package), the TypeScript compiler reads
the declaration file to learn the shapes involved, and checks all your
usage against those shapes. At compile time, the \`.d.ts\` file is purely
informational for the type checker; it produces no JavaScript output of
its own, and the actual code that runs is still whatever is in the real
\`.js\` file.
    `.trim(),
    whyItExists: `
TypeScript's whole benefit — catching type mismatches before code runs —
would stop at the boundary of any untyped JavaScript dependency, forcing
every import from such a library to fall back to **any** and lose all
checking. Declaration files let type information be attached to existing
JavaScript after the fact, without rewriting that JavaScript, so
TypeScript's checking can extend across the entire dependency graph, not
just the code written in TypeScript directly.
    `.trim(),
    whenToUse: `
Write a declaration file when you're using a JavaScript library that has
no types of its own and no **@types/** package available for it — you write
a **.d.ts** describing just enough of its shape for your code to be checked
against it. You'll also encounter (and occasionally need to read or tweak)
generated declaration files when publishing your own TypeScript library,
so consumers get type checking without needing your original source.
    `.trim(),
    whenNotToUse: `
Don't hand-write a declaration file for a library that already ships its
own types or has a well-maintained **@types/** package — check first,
since duplicating or conflicting with an existing declaration causes
confusing errors. Also avoid writing one just to silence errors on code
you actually intend to migrate to TypeScript directly — converting the
source is usually better long-term than perpetually describing it from
the outside.
    `.trim(),
    commonMistakes: [
      "Writing actual implementation logic inside a `.d.ts` file — declaration files are type-only, and any executable code inside them is not what actually runs.",
      "Not realizing a library already ships its own types (check its `package.json` for a `types` or `typings` field) before writing or installing a redundant declaration.",
      "Letting a hand-written `.d.ts` drift out of sync with the real JavaScript it describes, so TypeScript ends up confidently checking against an inaccurate shape.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Given a plain JavaScript function `function add(a, b) { return a + b; }`, write a `.d.ts` declaration describing it as taking two numbers and returning a number." },
      { difficulty: "Medium", prompt: "Look up (or imagine) a small npm package with no built-in types, and write out what installing its `@types/` package via npm would look like, and why it would let you import the package with full type checking." },
      { difficulty: "Hard", prompt: "Write a declaration file describing a small JavaScript module that exports an object with a nested method (e.g. `logger.info(msg)` and `logger.error(msg)`), using a `declare module` or `declare namespace` structure." },
    ],
    interviewQuestions: [
      { question: "What is a `.d.ts` file?", answer: "A declaration file that describes the type shape of existing JavaScript code — functions, variables, classes, modules — without containing any actual implementation, so TypeScript can type-check code that uses it." },
      { question: "What is DefinitelyTyped, and what are `@types/` packages?", answer: "DefinitelyTyped is a community-maintained repository of declaration files for JavaScript libraries that don't ship their own types; those declarations are published as separate `@types/<package-name>` npm packages you can install alongside the library." },
      { question: "Does a `.d.ts` file produce any JavaScript when compiled?", answer: "No. It's purely type information for the compiler — it contains no runtime logic and produces no JavaScript output of its own." },
    ],
    prerequisites: ["interfaces", "functions-with-types"],
    relatedTopics: ["interfaces", "tsconfig-strict-mode"],
    keywords: ["declaration files", "d.ts", "declare", "DefinitelyTyped", "@types", "ambient types"],
  },
  {
    id: "tsconfig-strict-mode",
    title: "tsconfig & Strict Mode",
    level: "advanced",
    description:
      "The configuration file that controls how the TypeScript compiler behaves, and the single setting that turns on its strongest safety checks.",
    explanation: `
Every setting you've relied on so far — which files to check, which
JavaScript version to compile down to, how strict the checking should be —
has to be configured somewhere. That somewhere is a file called
\`tsconfig.json\`, placed at the root of a TypeScript project. It tells the
compiler (and your editor) which files belong to the project, where to put
the compiled output, and dozens of individual options controlling exactly
how picky the type checker should be.

Among those dozens of options, one deserves special attention: \`strict\`.
Setting \`"strict": true\` doesn't add one check — it's a single switch
that turns on a whole bundle of stricter individual settings at once
(things like requiring every variable's type to be known rather than
silently falling back to \`any\`, and requiring you to explicitly handle
the possibility that a value might be \`null\` or \`undefined\`). Most
new TypeScript projects enable it from day one, because retrofitting
strictness onto a large, already-loose codebase later is far more painful
than starting strict.
    `.trim(),
    analogy:
      "tsconfig.json is like the rulebook for a referee before a match starts — it decides which parts of the field are in play and how strictly fouls get called. `strict: true` is like telling that referee \"call every single foul, no exceptions\" instead of only stepping in for the obvious ones — it catches far more, but it also means the game gets paused more often until everyone's actually playing by the rules.",
    examples: [
      {
        title: "A minimal tsconfig.json",
        code: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}`,
        explanation:
          "`target` sets which JavaScript version the output is compiled to. `module` sets the module system used in the output. `outDir`/`rootDir` control where compiled files go. `include` tells the compiler which files are part of this project. `strict` turns on the full bundle of stricter checks.",
        walkthrough: [
          { code: '"target": "ES2020",', explanation: "Determines how modern the generated JavaScript syntax is allowed to be — older targets produce more compatible, but sometimes more verbose, output." },
          { code: '"strict": true,', explanation: "Enables the full set of stricter type-checking rules bundled under strict mode, rather than each one individually." },
          { code: '"include": ["src/**/*"],', explanation: "Tells the compiler exactly which files belong to this project, rather than scanning the entire filesystem." },
        ],
      },
      {
        title: "What strict mode actually catches",
        code: `// with "strict": false (or strictNullChecks off)
function getLength(text: string) {
  return text.length;
}
let input: string = null; // allowed without strict — a silent trap
getLength(input);          // crashes at runtime: "Cannot read properties of null"

// with "strict": true
let strictInput: string = null;
// Error: Type 'null' is not assignable to type 'string'.
// You are now forced to handle it explicitly:
let safeInput: string | null = null;
if (safeInput !== null) {
  getLength(safeInput); // only reachable once null has been ruled out
}`,
        explanation:
          "Without strict mode's `strictNullChecks`, `null` can silently masquerade as a `string`, leading to a runtime crash. With strict mode, TypeScript forces you to acknowledge and handle the possibility of `null` before using the value, at compile time instead of at a crash site in production.",
      },
    ],
    howItWorks: `
When you run the TypeScript compiler (or start your editor's TypeScript
integration), it looks for a \`tsconfig.json\` in the project and reads
every option under \`compilerOptions\` to decide how to behave — which
files to include, what JavaScript features to allow or compile away, and
which categories of type errors to report. \`"strict": true\` is
implemented as a shorthand that turns on a specific list of individual
flags together, including \`noImplicitAny\` (errors on variables the
compiler can't infer a type for, instead of quietly treating them as
\`any\`), \`strictNullChecks\` (treats \`null\` and \`undefined\` as
distinct from every other type, rather than assignable to anything), and
several others. Each of those flags can still be set individually if you
want strictness in some areas but not others, but \`strict\` is the
common, all-at-once starting point.
    `.trim(),
    diagram: `
tsconfig.json
     ↓
compilerOptions read by tsc / editor
     ↓
strict: true expands into:
  - noImplicitAny
  - strictNullChecks
  - strictFunctionTypes
  - strictBindCallApply
  - strictPropertyInitialization
  - noImplicitThis
  - alwaysStrict
  - useUnknownInCatchVariables
     ↓
every one of those checks applied while compiling
    `.trim(),
    whyItExists: `
Without a shared configuration file, every developer and every editor
touching a project could apply different rules about what counts as a type
error, making the project's guarantees inconsistent from machine to
machine. **tsconfig.json** centralizes that decision once, for the whole
project. **strict** exists on top of that because TypeScript's individual
strictness flags were added gradually over time, for backward
compatibility — bundling them under one flag gives new projects an easy,
well-tested way to opt into the full, intended level of safety at once,
rather than having to discover and enable each flag separately.
    `.trim(),
    whenToUse: `
Enable **"strict": true** on essentially every new TypeScript project — the
extra rigor pays for itself many times over by catching real bugs (like
unhandled **null** values) at compile time. Reach into individual flags
inside **compilerOptions** (like customizing **target** for the environments
you support, or **paths** for import aliases) whenever a project's specific
needs call for it.
    `.trim(),
    whenNotToUse: `
Turning on **strict** partway through a large, long-running, loosely-typed
codebase all at once will likely surface a large number of pre-existing
errors simultaneously, which can be overwhelming. In that situation it's
often more practical to enable the individual strict flags one at a time,
fixing each category of error before moving to the next, rather than
flipping the single switch and being buried in errors immediately.
    `.trim(),
    commonMistakes: [
      "Assuming `strict: true` is just one check — it's a bundle of several distinct flags (`noImplicitAny`, `strictNullChecks`, and others), each catching a different category of mistake.",
      "Starting a brand-new project with `strict` turned off \"for now,\" intending to turn it on later — retrofitting strictness onto code already written loosely is far more work than starting strict.",
      "Not realizing that changes to `tsconfig.json` may need the editor's TypeScript server restarted to take effect, leading to confusion about why new errors aren't showing up immediately.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a minimal `tsconfig.json` for a new project targeting ES2020, with `strict` enabled and source files under `src/`." },
      { difficulty: "Medium", prompt: "Write a function that assigns `null` to a `string`-typed variable, and explain what error appears once `strictNullChecks` (part of `strict`) is enabled, and how to fix it properly." },
      { difficulty: "Hard", prompt: "List three individual flags that `strict: true` turns on, and for each one, write a short code example of a mistake it would catch that plain (non-strict) TypeScript would allow through." },
    ],
    interviewQuestions: [
      { question: "What is `tsconfig.json` for?", answer: "It's the configuration file, placed at a project's root, that controls how the TypeScript compiler behaves — which files to include, what JavaScript version to compile to, and which type-checking rules to enforce." },
      { question: "What does `\"strict\": true` actually do?", answer: "It's a shorthand that enables a whole bundle of individual stricter compiler flags at once — including noImplicitAny and strictNullChecks — rather than being a single check itself." },
      { question: "What does `strictNullChecks` specifically catch?", answer: "It stops `null` and `undefined` from being silently treated as assignable to every other type, forcing code to explicitly handle the possibility that a value might be missing before using it." },
    ],
    prerequisites: ["declaration-files", "union-intersection-types"],
    relatedTopics: ["declaration-files", "type-narrowing"],
    keywords: ["tsconfig", "strict mode", "noImplicitAny", "strictNullChecks", "compiler options"],
  },
];
