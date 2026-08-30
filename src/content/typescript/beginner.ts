import type { Topic } from "../../types/content";

export const typescriptBeginnerTopics: Topic[] = [
  {
    id: "what-is-typescript",
    title: "What is TypeScript?",
    level: "beginner",
    description:
      "JavaScript with an extra layer that checks the *shape* of your data before your code ever runs.",
    explanation: `
Picture a normal JavaScript function that adds two numbers:

\`function add(a, b) { return a + b; }\`

Nothing stops you from calling \`add("5", 10)\` by mistake. JavaScript won't
complain — it will just quietly turn \`"5" + 10\` into the string \`"510"\`,
and you won't find out something went wrong until the bug shows up
somewhere far downstream, maybe in production, maybe hours later.

Now imagine a tool that reads your code *before* you ever run it, and
says: "Hold on — \`add\` expects two numbers, but you're passing a string
here. This is almost certainly a mistake." That's the core idea. A layer
sits on top of JavaScript, lets you describe what *kind* of value each
variable, parameter, and return value is supposed to be, and then checks
that every part of your code is consistent with those descriptions —
catching an entire category of bugs while you're still typing, instead of
after the program runs. This is called **static typing** — "static"
because the checking happens by reading the code, not by running it.

That extra layer is **TypeScript**. It's not a separate language that
replaces JavaScript — it's JavaScript plus optional type annotations.
Because browsers and Node.js don't understand those annotations, a
TypeScript file (\`.ts\`) is run through a **compiler** that strips the
types back out and produces plain, ordinary JavaScript (\`.js\`) — the
exact same JavaScript you'd have written by hand, just checked for
mistakes first.
    `.trim(),
    analogy:
      "It's like a spell-checker for your code's data. You can still write whatever you want, but before you hit send, it underlines the parts that don't make sense — like passing a phone number where an email address was expected — so you can fix it before anyone else sees it.",
    examples: [
      {
        title: "A mistake JavaScript won't catch",
        code: `// plain JavaScript
function add(a, b) {
  return a + b;
}

add("5", 10); // returns "510", no error, no warning`,
        explanation:
          "JavaScript happily runs this. The bug is silent — it just produces a weird result and moves on.",
      },
      {
        title: "The same mistake in TypeScript",
        code: `// TypeScript
function add(a: number, b: number): number {
  return a + b;
}

add("5", 10);
// Error: Argument of type 'string' is not assignable
// to parameter of type 'number'.`,
        explanation:
          "The `: number` after each parameter is a type annotation. TypeScript reads this before running anything and flags the call as invalid — right in your editor, often as you type.",
        walkthrough: [
          { code: "function add(a: number, b: number): number {", explanation: "Declares that both parameters must be numbers, and that the function returns a number too." },
          { code: "return a + b;", explanation: "Ordinary JavaScript — TypeScript doesn't change how the code runs, only how it's checked." },
          { code: 'add("5", 10);', explanation: "Passing a string where a number is expected — TypeScript catches this mismatch before the code is ever executed." },
        ],
      },
    ],
    howItWorks: `
TypeScript code lives in \`.ts\` files. A program called the TypeScript
compiler (\`tsc\`) reads those files, checks every type annotation against
how the values are actually used, and reports any mismatches as errors.

If there are no errors (or you choose to ignore them), the compiler then
strips all the type annotations out and writes plain \`.js\` files — the
kind any browser or Node.js can run directly. The types themselves never
exist at runtime; they're purely a tool for catching mistakes ahead of
time. This is why people describe TypeScript as a "compile-time" layer: it
does its job before the program runs, then gets out of the way.
    `.trim(),
    diagram: `
you write:      app.ts (JavaScript + type annotations)
                     ↓
TypeScript compiler checks types, reports errors
                     ↓
                strips the types out
                     ↓
you get:        app.js (plain JavaScript)
                     ↓
              runs in browser / Node.js
    `.trim(),
    whyItExists: `
As JavaScript projects grow from a few hundred lines to hundreds of
thousands, small mistakes — passing the wrong kind of value, misspelling a
property name, forgetting that a value might be missing — become far more
common and far more expensive to track down. JavaScript itself has no way
to describe what a function or variable expects, so those mistakes only
surface when the code actually runs, sometimes in front of real users.

TypeScript was created (by Microsoft, first released in 2012) to let
large codebases describe those expectations explicitly, so tools and
compilers can catch violations immediately, instead of relying entirely on
tests and manual review to find them.
    `.trim(),
    whenToUse: `
Reach for TypeScript on any project that's going to grow, be touched by
more than one person, or live long enough that "what shape of data does
this function expect?" becomes hard to remember. It pays off especially in
teams, libraries other code depends on, and codebases where refactoring
needs to feel safe.
    `.trim(),
    whenNotToUse: `
For a five-minute throwaway script, a quick experiment, or a tiny snippet
where adding type annotations would take longer than writing the code
itself, plain JavaScript is often simpler and faster. TypeScript also adds
a build step — if that overhead genuinely doesn't pay for itself, it's
fine to skip it.
    `.trim(),
    commonMistakes: [
      "Thinking TypeScript is a completely different language from JavaScript — it's JavaScript with an added layer of type annotations that gets removed before the code runs.",
      "Believing TypeScript makes code run faster. It doesn't change runtime performance at all — it only catches mistakes earlier, before the code runs.",
      "Assuming type errors will stop the program from ever running. By default the compiler still produces JavaScript output even with errors, unless you configure it to refuse.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a JavaScript function `multiply(a, b)` with no types, then rewrite it in TypeScript adding `: number` annotations to both parameters and the return value." },
      { difficulty: "Medium", prompt: "In your rewritten TypeScript function, try calling it with a string argument and read the exact error TypeScript reports. Write down, in your own words, what the error is telling you." },
      { difficulty: "Hard", prompt: "Explain, without using the word \"TypeScript\", what problem static typing solves that plain JavaScript can't — as if explaining it to someone who has never programmed." },
    ],
    interviewQuestions: [
      { question: "What is TypeScript, in relation to JavaScript?", answer: "A superset of JavaScript that adds optional static type annotations, checked by a compiler before the code runs, which then strips those annotations and outputs plain JavaScript." },
      { question: "Does TypeScript code run directly in the browser?", answer: "No. It's compiled to plain JavaScript first; browsers and Node.js only ever run the resulting JavaScript, never the TypeScript source directly." },
      { question: "What is static typing, and what problem does it solve?", answer: "Checking that values match their expected types by reading the code, before it runs. It catches a whole class of mistakes — like passing the wrong kind of value to a function — at compile time instead of at runtime." },
    ],
    relatedTopics: ["basic-types", "interfaces", "type-aliases"],
    keywords: ["typescript", "static typing", "compiler", "tsc", "superset of javascript"],
  },
  {
    id: "basic-types",
    title: "Basic Types",
    level: "beginner",
    description:
      "The small set of built-in labels TypeScript uses to describe strings, numbers, booleans, arrays, and fixed-shape lists.",
    explanation: `
Once you accept that TypeScript lets you describe what kind of value a
variable holds, the next question is: what are the actual labels you use
to describe it? TypeScript ships with a handful of basic ones that map
directly onto the values JavaScript already has.

\`string\` describes text, \`number\` describes any numeric value (there's
no separate "integer" or "float" — just one number type), and \`boolean\`
describes \`true\`/\`false\`. Beyond single values, you'll often have a list
of things — an **array** — written either as \`string[]\` (an array of
strings) or \`Array<string>\` (the same thing, different notation).

Sometimes you know not just that something is a list, but exactly how
many items it has and what type each specific position holds — for
example, a pair that's always "a name, then an age." That fixed-length,
fixed-order array is called a **tuple**, written like \`[string, number]\`.

Finally, there's a type called \`any\`, which tells TypeScript "stop
checking this — it could be anything." It's tempting to reach for when
you're unsure what type something is, but doing so switches off the exact
safety net TypeScript exists to provide for that value, letting mistakes
slip through unnoticed. It's best treated as an escape hatch for rare
cases, not a default.
    `.trim(),
    analogy:
      "Think of basic types like labels on storage bins — one bin is labeled \"text only,\" another \"numbers only,\" another \"exactly one name and one age, in that order.\" The `any` bin has no label at all, so anything can go in — which is convenient, but it also means nothing stops you from mixing in something that doesn't belong.",
    examples: [
      {
        title: "The core primitive types",
        code: `let username: string = "amara";
let age: number = 29;
let isActive: boolean = true;

// TypeScript catches mismatches immediately:
age = "twenty-nine";
// Error: Type 'string' is not assignable to type 'number'.`,
        explanation:
          "Each variable is annotated with the type of value it's allowed to hold. Once declared, TypeScript enforces that annotation on every later assignment.",
        walkthrough: [
          { code: "let username: string = \"amara\";", explanation: "The `: string` annotation says this variable may only ever hold text." },
          { code: "let age: number = 29;", explanation: "`: number` covers whole numbers and decimals alike — TypeScript has just one numeric type." },
          { code: "age = \"twenty-nine\";", explanation: "Reassigning a string to a `number` variable violates its annotation, so TypeScript reports an error here." },
        ],
      },
      {
        title: "Arrays, tuples, and any",
        code: `let scores: number[] = [90, 85, 76];
let names: Array<string> = ["Sam", "Lee"];

// A tuple: always exactly [name, age], in that order
let profile: [string, number] = ["Priya", 34];

// any turns off checking for this value entirely — use sparingly
let response: any = fetchLegacyApi();
response.whatever.you.want(); // no error, even if this is wrong`,
        explanation:
          "Arrays hold any number of same-typed items. A tuple locks in both the number of items and each one's type by position. `any` opts a value out of type checking altogether, which is powerful but risky.",
      },
    ],
    howItWorks: `
When you write \`let age: number = 29\`, the compiler records that
\`age\`'s type is \`number\` and checks every later use of \`age\` against
that record — every reassignment, every place it's passed to a function,
every comparison. This checking happens purely by reading your code
(hence "static"); the compiler never actually runs \`age = "twenty-nine"\`
to discover it's wrong, it infers the mismatch just from the code's
structure.

\`any\` works by telling the compiler to skip building that record for a
given value — so no checks are ever run against it, and any mismatch
involving it slips through silently.
    `.trim(),
    whyItExists: `
JavaScript already has these kinds of values at runtime (strings, numbers,
booleans, arrays) — it just has no way to *declare in advance* which one a
variable is supposed to hold. Basic types give you that vocabulary, so the
compiler has something concrete to check your code against.
    `.trim(),
    whenToUse: `
Use explicit basic types whenever a value's type isn't obvious from
context — function parameters, empty arrays you're about to fill, and
tuples where position genuinely matters (like an \`[x, y]\` coordinate pair).
For a value initialized immediately with an obvious literal, like
\`let count = 0\`, TypeScript infers the type automatically and an
annotation is often just extra noise.
    `.trim(),
    whenNotToUse: `
Avoid reaching for \`any\` as a default whenever you're unsure of a type —
it silently disables the exact checking you added TypeScript to get.
Prefer figuring out the real type, or using \`unknown\` (a safer
alternative that still forces you to check the value before using it) when
you truly don't know what you're dealing with yet.
    `.trim(),
    commonMistakes: [
      "Reaching for `any` whenever a type is inconvenient to figure out, which quietly turns off type checking for that value and everything derived from it.",
      "Confusing a tuple with a regular array — `[string, number]` locks in exactly two items in that exact order, while `(string | number)[]` allows any number of items in any order.",
      "Over-annotating obvious values, like writing `let count: number = 0` when TypeScript would infer `number` automatically from the `0`.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Declare three variables with explicit types: a `string` for a city name, a `number` for a population, and a `boolean` for whether it's a capital city." },
      { difficulty: "Medium", prompt: "Create a tuple type representing an RGB color as `[number, number, number]`, and write a variable of that type. Then try adding a fourth number and observe the error." },
      { difficulty: "Hard", prompt: "Write a function `describe(value: any)` that logs `value.length`. Call it with a number and observe that TypeScript does not catch the runtime error. Then change the parameter type to `unknown` and see what TypeScript now requires you to do before accessing `.length`." },
    ],
    interviewQuestions: [
      { question: "What's the difference between `string[]` and `[string, number]`?", answer: "`string[]` is an array of any length where every element is a string. `[string, number]` is a tuple: exactly two elements, the first a string and the second a number, checked by position." },
      { question: "Why is overusing `any` considered bad practice?", answer: "It disables type checking for that value entirely, letting mismatches and mistakes pass through silently — defeating the purpose of using TypeScript for that part of the code." },
      { question: "Does TypeScript have separate types for integers and floating-point numbers?", answer: "No, there is just one `number` type covering all numeric values, matching how JavaScript itself represents numbers." },
    ],
    prerequisites: ["what-is-typescript"],
    relatedTopics: ["what-is-typescript", "interfaces", "type-aliases"],
    keywords: ["types", "string", "number", "boolean", "array", "tuple", "any"],
  },
  {
    id: "interfaces",
    title: "Interfaces",
    level: "beginner",
    description:
      "A named description of what properties an object must have, and what type each one holds.",
    explanation: `
A single \`string\` or \`number\` type is enough for a simple value, but
most real data is an object with several properties — a user with a name,
an email, and an age, say. Writing that shape out inline everywhere you
use it gets repetitive fast, and there's nothing tying separate inline
descriptions together as "the same shape."

An **interface** solves this by giving a shape a name, once, in one place.
You declare what properties an object of this shape must have and what
type each one is, and then you reuse that name everywhere instead of
repeating the shape. If an object is missing a required property, has one
with the wrong type, or is passed somewhere expecting that shape when it
doesn't match, TypeScript flags it immediately.
    `.trim(),
    analogy:
      "An interface is like a form template with labeled blanks: \"Name: ___, Email: ___, Age: ___.\" Anyone filling it out must provide all the required blanks with the right kind of answer — you can't hand in a form missing the email field, or write your age as \"twenty\" instead of a number.",
    examples: [
      {
        title: "Defining and using an interface",
        code: `interface User {
  name: string;
  email: string;
  age: number;
}

const user: User = {
  name: "Kai",
  email: "kai@example.com",
  age: 27,
};

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}`,
        explanation:
          "The `User` interface describes the required shape once. Both the `user` variable and the `greet` function reuse it, so any object claimed to be a `User` is checked against the exact same definition.",
        walkthrough: [
          { code: "interface User {", explanation: "Declares a new named shape called User." },
          { code: "  name: string;\n  email: string;\n  age: number;", explanation: "Each line lists a required property and the type it must hold." },
          { code: "const user: User = {...}", explanation: "This object literal is checked against User — missing a property, or giving one the wrong type, would be an error here." },
        ],
      },
      {
        title: "Optional properties and readonly",
        code: `interface Product {
  readonly id: string;
  name: string;
  discountCode?: string; // optional — may or may not be present
}

const item: Product = { id: "p-1", name: "Mug" }; // valid, discountCode omitted

item.id = "p-2";
// Error: Cannot assign to 'id' because it is a read-only property.`,
        explanation:
          "A `?` after a property name marks it optional, so objects without it are still valid. `readonly` allows a property to be set once but never reassigned afterward.",
      },
    ],
    howItWorks: `
An interface itself produces no JavaScript at all — it exists purely at
compile time, as a description the compiler checks object literals,
function parameters, and variables against. When you annotate something
with an interface name, TypeScript compares every property on the actual
value to every property the interface requires, flags anything missing or
mismatched, and then discards the interface entirely once compilation
finishes — it leaves no trace in the compiled \`.js\` output.
    `.trim(),
    whyItExists: `
Without a name for a shape, every function that expects "an object with a
name, email, and age" would have to spell that shape out inline, and
there'd be no guarantee that two inline descriptions actually mean the
same thing. Interfaces give a shape a single, reusable, checkable name,
which makes intent clearer and mistakes far easier to catch consistently
across a whole codebase.
    `.trim(),
    whenToUse: `
Use an interface any time you're describing the shape of an object —
function parameters that are objects, the data returned from an API, the
props a component accepts, or any structure you'll reuse in more than one
place.
    `.trim(),
    whenNotToUse: `
For a type that isn't fundamentally an object shape — a union of specific
string values, a function type, or a primitive alias — a type alias
(covered next) is usually the more natural fit. Interfaces are specifically
suited to describing "objects with named properties."
    `.trim(),
    commonMistakes: [
      "Forgetting the `?` on a property that's genuinely optional, forcing every object to include it even when it isn't always relevant.",
      "Assuming `readonly` protects the object at runtime — it's a compile-time-only check; plain JavaScript (or a type-unsafe cast) can still change the value.",
      "Defining the same object shape inline in multiple places instead of naming it once as an interface and reusing it.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write an interface `Book` with `title: string`, `author: string`, and `pages: number`, then create one object that satisfies it." },
      { difficulty: "Medium", prompt: "Add an optional property `isbn?: string` to `Book`, and create two valid `Book` objects — one with an ISBN and one without." },
      { difficulty: "Hard", prompt: "Write a function `printSummary(book: Book): string` that returns a formatted string, and add a `readonly` property to `Book` that would trigger a compiler error if the function tried to modify it." },
    ],
    interviewQuestions: [
      { question: "What is an interface used for in TypeScript?", answer: "Naming and reusing the description of an object's shape — which properties it must have and what type each one is — so the compiler can check objects against it consistently." },
      { question: "Does an optional property (`prop?: type`) allow the property to be `undefined`, or does it allow the property to be omitted entirely?", answer: "Both — it can be omitted from the object altogether, or included and explicitly set to `undefined`." },
      { question: "Do interfaces exist at runtime in the compiled JavaScript?", answer: "No. Interfaces are purely a compile-time construct used for type checking; they produce no runtime code at all." },
    ],
    prerequisites: ["basic-types"],
    relatedTopics: ["basic-types", "type-aliases", "functions-with-types"],
    keywords: ["interface", "object shape", "optional property", "readonly"],
  },
  {
    id: "type-aliases",
    title: "Type Aliases",
    level: "beginner",
    description:
      "Giving any type — not just object shapes — a reusable name.",
    explanation: `
Interfaces are great for naming object shapes, but not every type you want
to reuse is an object. Maybe it's a specific set of allowed strings, like
\`"pending" | "shipped" | "delivered"\`. Maybe it's a function's signature.
Maybe it's just a shorthand for a long, awkward-to-repeat type. Writing
that out in full every time it's needed is just as repetitive as repeating
an object shape.

A **type alias**, written with the \`type\` keyword, gives *any* type a
name — an object shape, a union of specific values, a tuple, a function
signature, anything. Once named, you refer to it by that name everywhere
instead of repeating the full definition.
    `.trim(),
    analogy:
      "A type alias is like giving a nickname to a long phrase you keep repeating. Instead of writing \"the delivery status, which is one of pending, shipped, or delivered\" every single time, you agree to just say \"OrderStatus\" and everyone knows exactly what that means.",
    examples: [
      {
        title: "Naming a union of specific values",
        code: `type OrderStatus = "pending" | "shipped" | "delivered";

let status: OrderStatus = "shipped";

status = "cancelled";
// Error: Type '"cancelled"' is not assignable to type 'OrderStatus'.`,
        explanation:
          "`OrderStatus` isn't an object shape at all — it's a fixed set of allowed string values. Type aliases can name this kind of type, which interfaces cannot.",
        walkthrough: [
          { code: 'type OrderStatus = "pending" | "shipped" | "delivered";', explanation: "Names the union of exactly these three string values as OrderStatus." },
          { code: 'let status: OrderStatus = "shipped";', explanation: "status may only ever hold one of the three named values." },
          { code: 'status = "cancelled";', explanation: "\"cancelled\" isn't one of the allowed values, so TypeScript rejects the assignment." },
        ],
      },
      {
        title: "A type alias for an object shape (like an interface)",
        code: `type Point = {
  x: number;
  y: number;
};

function distanceFromOrigin(p: Point): number {
  return Math.sqrt(p.x ** 2 + p.y ** 2);
}

// interface vs type, for an object shape, are nearly interchangeable:
interface PointInterface {
  x: number;
  y: number;
}`,
        explanation:
          "For plain object shapes, `type` and `interface` do almost the same job. The practical differences show up in more advanced cases: interfaces can be re-opened later to add more properties (declaration merging), and type aliases can describe unions, tuples, and other non-object types that interfaces can't.",
      },
    ],
    howItWorks: `
Like an interface, a type alias exists purely at compile time — it's a
label the compiler substitutes in wherever it's used when checking your
code, and it leaves no trace in the compiled JavaScript. The difference
from an interface is what it's allowed to name: an interface can only
describe object shapes, while a type alias can name literally any type —
including unions, tuples, function signatures, and primitives — as well
as object shapes.
    `.trim(),
    whyItExists: `
Object shapes aren't the only kind of type worth reusing — restricted sets
of string values, function signatures, and combinations of other types all
benefit from having a single readable name instead of being repeated or
inlined everywhere. Type aliases fill that gap for anything an interface
can't express.
    `.trim(),
    whenToUse: `
Reach for a type alias when you're naming a union (like a fixed set of
allowed strings), a tuple, a function signature, or any type that isn't
strictly "an object with these properties." It's also fine to use for
plain object shapes if your team's convention prefers **type** over
**interface** for consistency.
    `.trim(),
    whenNotToUse: `
If you're describing an object shape that might need to be extended later
by merging in more properties from elsewhere (common in libraries), an
interface supports that (declaration merging) and a type alias does not.
For everyday object shapes without that need, either works.
    `.trim(),
    commonMistakes: [
      "Thinking `type` and `interface` are totally interchangeable — type aliases can express unions and other non-object types that interfaces cannot.",
      "Trying to \"reopen\" a type alias later to add more properties, the way you can with an interface — type aliases can't be merged like that.",
      "Naming a type alias the same as an existing variable or another type in the same scope, causing a naming collision.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Create a type alias `Direction` that can only be \"up\", \"down\", \"left\", or \"right\", and declare a variable of that type." },
      { difficulty: "Medium", prompt: "Create a type alias `Coordinate` for a `[number, number]` tuple, and write a function `move(point: Coordinate, direction: Direction): Coordinate` that returns a new coordinate." },
      { difficulty: "Hard", prompt: "Write a type alias for a function signature, `Comparator`, that takes two numbers and returns a number, and write a function `sortNumbers(nums: number[], compare: Comparator): number[]` that uses it." },
    ],
    interviewQuestions: [
      { question: "What can a type alias describe that an interface cannot?", answer: "A type alias can name unions, tuples, function signatures, and primitive types — anything, not just object shapes, which is all an interface can describe." },
      { question: "What is declaration merging, and which of `type` or `interface` supports it?", answer: "Declaration merging is the ability to declare the same named shape more than once and have TypeScript combine the declarations into one. Only `interface` supports this; a `type` alias with the same name declared twice is an error." },
      { question: "For a simple object shape, does it matter whether you use `type` or `interface`?", answer: "In most everyday cases, no — both check objects the same way. The choice mostly comes down to team convention, unless you specifically need a feature only one of them supports." },
    ],
    prerequisites: ["interfaces"],
    relatedTopics: ["interfaces", "union-intersection-types", "functions-with-types"],
    keywords: ["type alias", "type keyword", "union", "interface vs type"],
  },
  {
    id: "functions-with-types",
    title: "Functions with Types",
    level: "beginner",
    description:
      "Annotating a function's parameters and return value so TypeScript can check every call against them.",
    explanation: `
A function is really a contract: "give me these inputs, and I'll give you
this output." In plain JavaScript, that contract only exists in comments
or in your head — nothing stops a caller from breaking it by passing the
wrong kind of argument, or too few of them.

TypeScript lets you write that contract directly into the function
signature. Each parameter gets a type annotation, and the function itself
gets a return type annotation, so both what goes in and what comes out are
checked. You can also mark a parameter **optional** with a \`?\`, meaning
callers may leave it out — and if they do, its value inside the function
is \`undefined\`.
    `.trim(),
    analogy:
      "A typed function signature is like a vending machine's slot: it's shaped to accept coins of a specific size, and clearly labeled with what it dispenses. Try to push in the wrong shaped object and it simply won't go in — you find out immediately, not after the machine jams.",
    examples: [
      {
        title: "Typed parameters and return value",
        code: `function calculateTotal(price: number, taxRate: number): number {
  return price + price * taxRate;
}

calculateTotal(100, 0.07); // 107
calculateTotal("100", 0.07);
// Error: Argument of type 'string' is not assignable to parameter of type 'number'.`,
        explanation:
          "TypeScript checks both the types passed in and the type returned. If the function's body tried to `return \"total\"` instead of a number, that would also be flagged as an error.",
        walkthrough: [
          { code: "function calculateTotal(price: number, taxRate: number): number {", explanation: "Both parameters must be numbers, and the function is promised to return a number." },
          { code: "return price + price * taxRate;", explanation: "The actual computation — ordinary arithmetic, unaffected by the type annotations." },
          { code: 'calculateTotal("100", 0.07);', explanation: "Passing a string for price violates the parameter's type, so TypeScript flags this call before it ever runs." },
        ],
      },
      {
        title: "Optional parameters and default values",
        code: `function greet(name: string, greeting?: string): string {
  return \`\${greeting ?? "Hello"}, \${name}!\`;
}

greet("Mina");              // "Hello, Mina!"
greet("Mina", "Welcome");   // "Welcome, Mina!"

// A default value makes a parameter optional automatically:
function greetWithDefault(name: string, greeting: string = "Hello"): string {
  return \`\${greeting}, \${name}!\`;
}`,
        explanation:
          "The `?` after `greeting` means callers may omit it entirely, in which case it's `undefined` inside the function. Giving a parameter a default value achieves a similar effect, while also supplying a fallback automatically.",
      },
    ],
    howItWorks: `
When the compiler checks a function call, it lines up each argument you
pass against the corresponding parameter's declared type, in order, and
flags any mismatch — including passing too many required arguments or too
few. It does the same for the return value: every \`return\` statement
inside the function body is checked against the declared return type.
Optional parameters (marked with \`?\`) must come after all required ones,
since position is how arguments are matched to parameters.
    `.trim(),
    whyItExists: `
Function signatures are one of the most common places bugs sneak in —
passing arguments in the wrong order, forgetting one, or assuming a
function returns something it doesn't. By making the contract explicit and
checkable, TypeScript catches those mistakes at the call site, immediately,
instead of only when the function actually runs with bad data.
    `.trim(),
    whenToUse: `
Annotate parameter types on essentially every function you write,
especially ones used in more than one place or exposed to other parts of a
codebase. Return type annotations are optional (TypeScript can usually
infer them), but adding them explicitly is useful for documenting intent
and catching a case where the function body accidentally returns the wrong
type.
    `.trim(),
    whenNotToUse: `
For a tiny, throwaway inline callback (like the anonymous function passed
to \`array.map(x => x * 2)\`), TypeScript is usually smart enough to infer
the parameter type from context, so an explicit annotation would just be
unnecessary noise.
    `.trim(),
    commonMistakes: [
      "Placing an optional parameter before a required one, which TypeScript doesn't allow — optional parameters must come last.",
      "Confusing an optional parameter (`name?: string`) with a parameter that has a default value (`name: string = \"Guest\"`) — the former can be `undefined` inside the function, the latter never is.",
      "Assuming a return type annotation changes what the function actually returns at runtime — it only adds a compile-time check; the function's logic still determines the real value.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a function `square(n: number): number` that returns `n` squared, and call it correctly and incorrectly to see the error." },
      { difficulty: "Medium", prompt: "Write a function `formatName(first: string, last: string, middle?: string): string` that combines the names, handling the case where `middle` is omitted." },
      { difficulty: "Hard", prompt: "Write a function `createUser(name: string, role: string = \"member\")` that returns an object matching a `User` interface you define, and explain why the `role` parameter doesn't need a `?` even though it's optional to callers." },
    ],
    interviewQuestions: [
      { question: "What happens if you call a TypeScript function with the wrong number of arguments?", answer: "The compiler reports an error at the call site — too few required arguments, or too many, are both caught before the code runs." },
      { question: "What's the difference between an optional parameter and one with a default value?", answer: "An optional parameter (`x?: T`) may be omitted, and is `undefined` inside the function if it is. A parameter with a default value (`x: T = val`) may also be omitted, but then automatically takes on the default value instead of being `undefined`." },
      { question: "Is a function's return type annotation required?", answer: "No — TypeScript can usually infer the return type from the function body. Writing it explicitly is optional but often used for clarity and as an extra safety check." },
    ],
    prerequisites: ["type-aliases"],
    relatedTopics: ["interfaces", "type-aliases", "generics"],
    keywords: ["function types", "parameters", "return type", "optional parameter", "default value"],
  },
];
