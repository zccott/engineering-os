import type { Topic } from "../../types/content";

export const typescriptIntermediateTopics: Topic[] = [
  {
    id: "union-intersection-types",
    title: "Union & Intersection Types",
    level: "intermediate",
    description:
      "Combining types with `|` to mean \"one of these\" and with `&` to mean \"all of these, merged.\"",
    explanation: `
So far, every type you've seen describes one specific shape. But plenty of
real values are more flexible than that. A function that accepts either an
\`id\` (a number) or a \`slug\` (a string) to look up a record can't be
described by a single basic type — it genuinely accepts *either* one.

A **union type**, written \`A | B\`, describes exactly that: a value that
is one of several possible types. \`string | number\` means "a string, or
a number — could be either." TypeScript then requires you to check *which*
one you actually got before doing something that only makes sense for one
of them (this checking is covered in the next topic, narrowing).

Going the other direction, sometimes you want a value that satisfies
*multiple* shapes **at once** — it has to combine all of their properties
together, not just be one or the other. That's an **intersection type**,
written \`A & B\`. If \`A\` has a \`name\` property and \`B\` has an \`age\`
property, then \`A & B\` requires *both* — a single object with both
\`name\` and \`age\`.
    `.trim(),
    analogy:
      "A union is like a form field that accepts \"either a phone number or an email\" — one or the other, your choice. An intersection is like a job application that requires both a resume AND a cover letter — you need every piece, combined into one submission, not just one of them.",
    examples: [
      {
        title: "A union type for flexible input",
        code: `function lookup(idOrSlug: number | string): void {
  console.log(\`Looking up: \${idOrSlug}\`);
}

lookup(42);        // OK — it's a number
lookup("my-post"); // OK — it's a string
lookup(true);
// Error: Argument of type 'boolean' is not assignable
// to parameter of type 'string | number'.`,
        explanation:
          "`idOrSlug` may be a number or a string — nothing else. TypeScript accepts either, but rejects any value that's neither.",
        walkthrough: [
          { code: "function lookup(idOrSlug: number | string): void {", explanation: "The union `number | string` means this parameter must be one of exactly these two types." },
          { code: "lookup(42);", explanation: "A number matches the union, so this call is valid." },
          { code: "lookup(true);", explanation: "A boolean is neither a number nor a string, so it fails to satisfy the union and is rejected." },
        ],
      },
      {
        title: "An intersection type combining two shapes",
        code: `interface HasName {
  name: string;
}

interface HasAge {
  age: number;
}

type Person = HasName & HasAge;

const p: Person = { name: "Tariq", age: 41 }; // must have both

const invalid: Person = { name: "Tariq" };
// Error: Property 'age' is missing in type
// '{ name: string; }' but required in type 'HasAge'.`,
        explanation:
          "`Person` is the intersection of `HasName` and `HasAge`, so a valid `Person` must satisfy both interfaces at once — it needs every property from each.",
      },
    ],
    howItWorks: `
For a union type \`A | B\`, the compiler only lets you do things with the
value that are safe for *both* \`A\` and \`B\` — anything specific to just
one of them requires narrowing the type first (checking which one you
actually have at runtime).

For an intersection type \`A & B\`, the compiler merges the member lists of
both types and requires an object to satisfy every member from both —
effectively unioning the *requirements*, even though the type itself is
called an intersection.
    `.trim(),
    whyItExists: `
Real-world data often genuinely varies in shape — an API response might be
a success object or an error object, a function might accept a couple of
different input forms. Union types let you describe that variability
precisely, instead of falling back to **any** and losing all checking.
Intersection types let you build up a bigger shape by combining smaller,
reusable pieces instead of repeating properties across several similar
interfaces.
    `.trim(),
    whenToUse: `
Use a union whenever a value can genuinely be more than one type — the
result of an operation that can succeed or fail, a parameter accepting a
couple of related input shapes, or a value read from an external, less
predictable source. Use an intersection when you want to combine several
smaller, independently useful shapes into one composite type, especially
if those shapes are reused elsewhere on their own.
    `.trim(),
    whenNotToUse: `
Avoid piling more than a handful of types into a single union — beyond
that, the code handling every case tends to get unreadable, and it may be
a sign the values should share a common structure instead (see
discriminated unions). Avoid intersections that combine incompatible
types (like **string & number**, which produces the unusable **never** type)
— intersections only make sense between compatible object shapes.
    `.trim(),
    commonMistakes: [
      "Trying to access a property on a union type that only exists on one branch of it, before narrowing which branch you actually have.",
      "Confusing `|` and `&` — a union (`|`) means \"could be either,\" while an intersection (`&`) means \"must be both, combined.\"",
      "Intersecting two types that have the same property name with conflicting types (like `string` in one and `number` in the other), which silently collapses that property to `never`.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a type alias `Id` as `string | number`, and a function `printId(id: Id): void` that logs it." },
      { difficulty: "Medium", prompt: "Define two interfaces, `Timestamped` (`createdAt: Date`) and `Named` (`name: string`), and create an intersection type `NamedEvent` combining both. Create a valid object of that type." },
      { difficulty: "Hard", prompt: "Write a function that accepts `string | string[]` and always returns a `string[]` — wrapping a single string in an array, or returning the array as-is." },
    ],
    interviewQuestions: [
      { question: "What does the `|` operator mean in a TypeScript type?", answer: "It creates a union type — a value that may be any one of the listed types, but the compiler only allows operations valid for every member until the type is narrowed." },
      { question: "What does the `&` operator mean in a TypeScript type?", answer: "It creates an intersection type — a value that must satisfy all of the combined types simultaneously, having every property required by each." },
      { question: "What happens if you intersect two types that assign incompatible types to the same property name?", answer: "That property's type collapses to `never`, meaning no real value can ever satisfy it — effectively making the intersection unusable for that property." },
    ],
    prerequisites: ["interfaces", "type-aliases"],
    relatedTopics: ["type-narrowing", "generics", "enums"],
    keywords: ["union type", "intersection type", "or", "and", "combining types"],
  },
  {
    id: "generics",
    title: "Generics",
    level: "intermediate",
    description:
      "Writing a function or type once so it works with whatever type you feed it, while still keeping that type checked.",
    explanation: `
Suppose you write a function that just hands back whatever you gave it:

\`function identity(value: number): number { return value; }\`

That works for numbers, but not for strings — you'd have to write a nearly
identical \`identity\` function for every type you want to support, or give
up and type the parameter as \`any\`, which throws away all type checking
in the process (a caller could pass a number in and get a string out, and
TypeScript wouldn't complain).

What you actually want is: "whatever type you pass in, give me that exact
same type back" — without giving up checking altogether. TypeScript lets
you express that with a **type variable**, conventionally named \`T\`,
written in angle brackets before the parameter list:

\`function identity<T>(value: T): T { return value; }\`

Now \`identity(5)\` is known to return a \`number\`, and \`identity("hi")\`
is known to return a \`string\` — TypeScript figures out \`T\` fresh for
each call, based on what you actually passed in. This pattern — writing
code once that works across many types while keeping each specific use
fully checked — is called a **generic**.
    `.trim(),
    analogy:
      "A generic function is like a mold for making boxes that's adjustable to whatever you put in it — put in a small ball, get a small box back; put in a large book, get a large box back. It's one mold, but it never mixes up sizes: you always get back a box that fits exactly what went in.",
    examples: [
      {
        title: "A generic identity function",
        code: `function identity<T>(value: T): T {
  return value;
}

const num = identity(5);        // T is inferred as number
const str = identity("hello");  // T is inferred as string

const wrong: string = identity(5);
// Error: Type 'number' is not assignable to type 'string'.`,
        explanation:
          "`T` is a placeholder for \"whatever type is passed in.\" TypeScript figures out `T` separately for each call and uses it to check both the argument and how the result is used.",
        walkthrough: [
          { code: "function identity<T>(value: T): T {", explanation: "`<T>` declares a type variable; `value: T` and the return type `T` both refer to the same, yet-to-be-determined type." },
          { code: 'const num = identity(5);', explanation: "TypeScript infers T as number here, purely from the argument 5, so `num` is known to be a number." },
          { code: "const wrong: string = identity(5);", explanation: "identity(5) returns a number, so assigning it to a string-typed variable is an error." },
        ],
      },
      {
        title: "A generic function over arrays",
        code: `function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNum = firstItem([1, 2, 3]);         // number | undefined
const firstName = firstItem(["Ana", "Bo"]);    // string | undefined

// Generics can also be constrained:
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("hi", "hello"); // works — strings have .length
longest(3, 4);
// Error: number doesn't satisfy the constraint '{ length: number }'.`,
        explanation:
          "`firstItem` works for an array of any type. The `extends` clause on `longest` restricts T to types that actually have a `.length` property, so calling it with plain numbers is rejected.",
      },
    ],
    howItWorks: `
When you call a generic function, the compiler looks at the actual
argument(s) you pass and works backward to figure out what \`T\` must be —
this is called **type inference** for generics. It then substitutes that
inferred type everywhere \`T\` appears in the signature, and checks the
rest of the call as if you'd written that specific type by hand. You can
also specify \`T\` explicitly, like \`identity<string>("hi")\`, if you want
to be precise or if inference can't figure it out on its own. A
**constraint** (\`T extends SomeShape\`) narrows what \`T\` is allowed to be,
so the function body can safely rely on \`T\` having certain properties.
    `.trim(),
    whyItExists: `
Without generics, you'd face a trade-off: either duplicate the same logic
for every type you need to support (a **numberIdentity**, **stringIdentity**,
and so on), or use **any** and lose type checking entirely. Generics let you
write the logic exactly once, while still getting full, specific type
checking for every individual call.
    `.trim(),
    whenToUse: `
Reach for generics whenever a function or type's logic doesn't actually
depend on a specific type — a function that stores, returns, wraps, or
transforms whatever it's given (arrays, containers, caches, API wrappers)
is a natural fit. Also reach for them when writing a reusable interface,
like a generic \`ApiResponse<T>\` that wraps different kinds of data.
    `.trim(),
    whenNotToUse: `
If a function only ever needs to work with one specific type, adding a
type variable is unnecessary complexity — just write the concrete type
directly. Generics are for genuinely type-independent logic, not a default
to sprinkle onto every function.
    `.trim(),
    commonMistakes: [
      "Adding a generic `<T>` to a function that never actually uses `T` in its parameters or return type — if `T` isn't tied to anything, it isn't doing any useful checking.",
      "Reaching for `any` instead of a generic when the goal is really \"any type, but consistently the same type throughout,\" which a generic captures and `any` doesn't.",
      "Forgetting a constraint (`extends`) and then trying to use a property inside the function body that not every possible `T` actually has.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a generic function `wrapInArray<T>(value: T): T[]` that returns a one-element array containing the value." },
      { difficulty: "Medium", prompt: "Write a generic function `pluck<T>(items: T[], index: number): T | undefined` that safely returns the item at a given index." },
      { difficulty: "Hard", prompt: "Write a generic function `merge<T extends object, U extends object>(a: T, b: U): T & U` that merges two objects and returns their intersection type." },
    ],
    interviewQuestions: [
      { question: "What problem do generics solve?", answer: "They let you write a single function or type that works across many types, without either duplicating the logic per type or giving up type checking with `any`." },
      { question: "How does TypeScript decide what a generic type variable like `T` actually is for a given call?", answer: "It infers `T` from the arguments passed to the function, unless the caller explicitly specifies it (e.g. `identity<string>(...)`)." },
      { question: "What does `T extends SomeShape` mean in a generic function signature?", answer: "It constrains T to only types that satisfy SomeShape, letting the function body safely use properties from SomeShape while still supporting any type that qualifies." },
    ],
    prerequisites: ["functions-with-types", "union-intersection-types"],
    relatedTopics: ["union-intersection-types", "utility-types", "mapped-types"],
    keywords: ["generics", "type variable", "type inference", "constraint", "extends"],
  },
  {
    id: "enums",
    title: "Enums",
    level: "intermediate",
    description:
      "A named set of related constant values, grouped under one type so you can refer to them by name instead of a raw value.",
    explanation: `
Sometimes a value is really one of a small, fixed set of related options —
a direction, a status, a day of the week. You could represent each option
as a plain string or number scattered through your code (\`"UP"\`, \`0\`,
\`1\`), but then nothing groups those related values together, and typos
like \`"Up"\` instead of \`"UP"\` are easy to make and hard to catch.

An **enum** (short for "enumeration") groups a related set of named
constants under one type. You declare the names once, and TypeScript
treats each name as a distinct, valid value of that enum — while rejecting
any string or number that isn't one of them.
    `.trim(),
    analogy:
      "An enum is like the settings on a washing machine dial — Delicate, Normal, Heavy Duty. There's no in-between setting and no typing your own; you pick one of the fixed, clearly labeled positions the dial actually has.",
    examples: [
      {
        title: "A basic numeric enum",
        code: `enum Direction {
  Up,
  Down,
  Left,
  Right,
}

let move: Direction = Direction.Up;
console.log(move); // 0 — enum members auto-number from 0 by default

function walk(direction: Direction) {
  console.log(\`Walking \${Direction[direction]}\`);
}

walk(Direction.Left);`,
        explanation:
          "Each member of `Direction` automatically gets a number, starting at 0. `Direction[direction]` looks the name back up from its numeric value — a feature specific to numeric enums.",
        walkthrough: [
          { code: "enum Direction {\n  Up,\n  Down,\n  Left,\n  Right,\n}", explanation: "Declares four related named constants as one type, numbered 0 through 3 by default." },
          { code: "let move: Direction = Direction.Up;", explanation: "move can only hold one of the four Direction values — nothing else is valid." },
          { code: "walk(Direction.Left);", explanation: "Passing a named member instead of a raw number makes the call self-explanatory at the call site." },
        ],
      },
      {
        title: "A string enum",
        code: `enum OrderStatus {
  Pending = "PENDING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
}

function ship(status: OrderStatus) {
  if (status === OrderStatus.Pending) {
    console.log("Preparing shipment...");
  }
}

ship(OrderStatus.Pending);
ship("PENDING" as OrderStatus); // works, but requires an explicit cast`,
        explanation:
          "A string enum assigns an explicit, readable string to each member instead of an auto-incrementing number, which makes debugging output and logs much clearer than seeing a bare number.",
      },
    ],
    howItWorks: `
Unlike an interface or type alias, an enum is not purely a compile-time
construct — it actually generates real JavaScript code, typically an
object mapping each member name to its value (and, for numeric enums,
back the other way too). When you write \`Direction.Up\`, that compiles
down to reading a property off that generated object at runtime. This is
why enums are one of the few TypeScript-only features that produce actual
runtime code, unlike interfaces and type aliases.
    `.trim(),
    whyItExists: `
Enums give a name to each option in a small, fixed set of related values,
so code that uses them reads clearly (**OrderStatus.Shipped** instead of a
bare **"SHIPPED"** string scattered everywhere) and typos are caught by the
compiler instead of only showing up as a silent bug at runtime.
    `.trim(),
    whenToUse: `
Use an enum when you have a genuinely fixed, small set of related named
options that the rest of the code will refer to by name — status codes,
categories, directions, modes. String enums are usually preferable to
numeric ones when the value might be logged, displayed, or sent over the
network, since the string is self-explanatory on its own.
    `.trim(),
    whenNotToUse: `
For a simple set of string literals, many teams prefer a union of string
literal types (\`type Status = "pending" | "shipped" | "delivered"\`)
instead of an enum — it needs no import, generates no runtime code, and
works more naturally with plain JavaScript values coming from APIs. Reach
for an enum specifically when you want the grouping and reverse lookup
behavior an enum provides.
    `.trim(),
    commonMistakes: [
      "Forgetting that numeric enum members auto-increment starting at 0, and being surprised when inserting a new member in the middle shifts every later member's underlying number.",
      "Assuming an enum is purely a compile-time construct like an interface — it actually generates a real JavaScript object at runtime.",
      "Casting a raw string to a string enum (`\"PENDING\" as OrderStatus`) as a habit, instead of using the enum member directly, which defeats some of the safety enums are meant to provide.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Create a numeric enum `TrafficLight` with `Red`, `Yellow`, and `Green`, and write a function that logs a message for each value." },
      { difficulty: "Medium", prompt: "Convert `TrafficLight` into a string enum with explicit values (\"RED\", \"YELLOW\", \"GREEN\"), and explain in a comment why that might be preferable for logging." },
      { difficulty: "Hard", prompt: "Rewrite the `TrafficLight` string enum as a union of string literal types instead, and write a function that works identically with both versions. Note what changes and what stays the same at the call sites." },
    ],
    interviewQuestions: [
      { question: "What is a TypeScript enum?", answer: "A named set of related constant values, grouped under one type, so code can refer to each option by a readable name instead of a raw literal value." },
      { question: "Do enums exist at runtime, unlike interfaces?", answer: "Yes — unlike interfaces and type aliases, which are erased during compilation, enums generate a real JavaScript object at runtime that the compiled code reads from." },
      { question: "What's a common alternative to enums for a simple set of string options?", answer: "A union of string literal types, like `type Status = \"pending\" | \"shipped\"`, which needs no import, produces no runtime code, and works naturally with plain string values." },
    ],
    prerequisites: ["union-intersection-types"],
    relatedTopics: ["union-intersection-types", "type-narrowing"],
    keywords: ["enum", "enumeration", "string enum", "numeric enum", "constants"],
  },
  {
    id: "type-narrowing",
    title: "Type Narrowing",
    level: "intermediate",
    description:
      "How TypeScript figures out, step by step, which specific branch of a union type you're actually holding at a given point in the code.",
    explanation: `
When a value has a union type like \`string | number\`, TypeScript won't
let you use it as if it were definitely one or the other — calling
\`.toUpperCase()\` on it is rejected, because that method only exists on
strings, and the value might be a number.

But once you write a runtime check that only makes sense for one branch —
like \`typeof value === "string"\` — TypeScript is smart enough to notice,
and inside the block where that check passed, it treats \`value\` as
definitely a \`string\`, unlocking string-only methods without any extra
casting or annotation. This automatic, check-by-check narrowing of a wider
type down to a more specific one is called **type narrowing**.

TypeScript recognizes several common narrowing checks: \`typeof\` (for
primitives like \`string\`, \`number\`, \`boolean\`), \`instanceof\` (for
checking if something is an instance of a particular class), plain
truthy/falsy checks (\`if (value)\`), and checking for a specific property
that only exists on one branch of the union.
    `.trim(),
    analogy:
      "It's like sorting mail before opening it. You can't read a letter's contents until you check what kind of envelope it's in — but once you notice it's the 'electric bill' envelope specifically, you now know exactly what's inside and can act on it directly, without guessing.",
    examples: [
      {
        title: "Narrowing with typeof",
        code: `function printLength(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // value is narrowed to string here
  } else {
    console.log(value.toFixed(2));    // value is narrowed to number here
  }
}`,
        explanation:
          "Inside the `if` block, TypeScript treats `value` as a `string` because that's the only way the `typeof` check could have passed. Inside the `else`, it's narrowed to `number` instead — the only remaining possibility.",
        walkthrough: [
          { code: "function printLength(value: string | number) {", explanation: "value starts out as the full union — string or number, unknown which." },
          { code: 'if (typeof value === "string") {', explanation: "This runtime check is one TypeScript specifically recognizes for narrowing a union." },
          { code: "console.log(value.toUpperCase());", explanation: "Inside this block, value is narrowed to string, so calling a string-only method is now allowed." },
        ],
      },
      {
        title: "Narrowing with instanceof and property checks",
        code: `class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

function speak(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark(); // narrowed to Dog
  } else {
    animal.meow(); // narrowed to Cat
  }
}

interface Success {
  ok: true;
  data: string;
}
interface Failure {
  ok: false;
  error: string;
}

function handle(result: Success | Failure) {
  if (result.ok) {
    console.log(result.data);  // narrowed to Success
  } else {
    console.log(result.error); // narrowed to Failure
  }
}`,
        explanation:
          "`instanceof` narrows between classes. Checking a shared property with a distinct literal value (like `ok: true` vs. `ok: false`) narrows between interfaces — this pattern is called a discriminated union.",
      },
    ],
    howItWorks: `
The compiler tracks, at every point in your code, the narrowest type it
can prove a variable has based on everything it's seen so far — this is
called **control flow analysis**. When it sees a recognized check
(\`typeof\`, \`instanceof\`, a truthy check, comparing a shared "tag"
property to a specific value, and a few others), it narrows the variable's
type within the branch where that check is known to be true, and narrows
it differently — or back to the original type — outside that branch. This
happens purely by analyzing the code's structure; no runtime type
information is added or checked beyond the check you actually wrote.
    `.trim(),
    whyItExists: `
Union types are only useful if you can eventually narrow them down to act
on a specific branch — otherwise you'd be stuck being unable to use any
branch-specific behavior at all. Narrowing lets TypeScript recognize the
same runtime checks you'd write anyway (an **if**, a **typeof**) and reward
them with more precise types, without requiring you to write anything
extra just for the type checker's benefit.
    `.trim(),
    whenToUse: `
Whenever you're working with a union type and need to do something
specific to one branch of it, write the narrowing check first (**typeof**,
**instanceof**, a property check) before accessing anything specific to that
branch. Discriminated unions (interfaces sharing one "tag" property with
distinct literal values) are a particularly clean, common pattern for
representing success/failure or variant states.
    `.trim(),
    whenNotToUse: `
Narrowing isn't something you opt in or out of — it happens automatically
whenever you write a recognized check. The mistake to avoid isn't using
narrowing, but reaching for a manual type cast (\`as SomeType\`) instead of
a proper runtime check, which tells the compiler to trust you without
actually verifying anything at runtime.
    `.trim(),
    commonMistakes: [
      "Using a type cast (`as string`) to silence an error instead of writing an actual runtime check, which provides no real safety and can be wrong.",
      "Expecting narrowing to persist after calling another function in between — TypeScript can lose track of a narrowed type if a function call happens between the check and the use, since the function could theoretically change the value.",
      "Forgetting that `instanceof` only works for narrowing between classes, not plain object shapes defined with interfaces — those need a discriminant property check instead.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a function `formatValue(value: string | boolean)` that uppercases the value if it's a string, and returns \"YES\"/\"NO\" if it's a boolean, using typeof narrowing." },
      { difficulty: "Medium", prompt: "Define two interfaces, `Circle { kind: \"circle\", radius: number }` and `Square { kind: \"square\", side: number }`, then write a function `area(shape: Circle | Square): number` using a discriminated union check on `kind`." },
      { difficulty: "Hard", prompt: "Write a function that accepts `unknown` and safely narrows it down step by step (checking it's an object, then that it has a specific property with the right type) before using it — without any `as` casts." },
    ],
    interviewQuestions: [
      { question: "What is type narrowing?", answer: "The process by which TypeScript refines a value's type to a more specific one within a particular branch of code, based on a runtime check like `typeof`, `instanceof`, or a property comparison." },
      { question: "What is a discriminated union?", answer: "A union of object types that all share one common property (the discriminant) holding a distinct literal value per type, letting TypeScript narrow between them by checking that one property." },
      { question: "Why is a type cast (`as SomeType`) considered less safe than proper narrowing?", answer: "A cast tells the compiler to trust your claim about a value's type without checking it, whereas narrowing is based on an actual runtime check the compiler can verify was performed." },
    ],
    prerequisites: ["union-intersection-types"],
    relatedTopics: ["union-intersection-types", "enums", "conditional-types"],
    keywords: ["type narrowing", "typeof", "instanceof", "discriminated union", "control flow analysis"],
  },
  {
    id: "utility-types",
    title: "Utility Types",
    level: "intermediate",
    description:
      "Built-in generic types that transform an existing type into a new one, so you don't have to redefine similar shapes by hand.",
    explanation: `
Once you have an interface like \`User\`, you'll often need slightly
different versions of it in different situations — a version where every
field is optional (for an update form), a version with only a couple of
fields (for a preview card), a version missing one sensitive field (to
send to the client). Rewriting a near-duplicate interface for each of
these is repetitive, and the copies can drift out of sync as the original
changes.

TypeScript ships a set of built-in **utility types** — generic types that
take an existing type and transform it into a new one — to cover these
common transformations without hand-written duplication. Four of the most
used are: \`Partial<T>\` (makes every property optional), \`Pick<T, Keys>\`
(keeps only the listed properties), \`Omit<T, Keys>\` (keeps everything
*except* the listed properties), and \`Record<Keys, ValueType>\` (builds an
object type mapping each key to the same value type).
    `.trim(),
    analogy:
      "Utility types are like photocopier settings for a type. Instead of retyping a document by hand with a few fields blanked out, you run the original through a setting — \"make every field optional,\" \"keep only these two fields,\" \"drop that one field\" — and get a related but different copy out, without ever hand-editing the original.",
    examples: [
      {
        title: "Partial, Pick, and Omit",
        code: `interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Every property becomes optional — handy for an "update" function
type UserUpdate = Partial<User>;
const update: UserUpdate = { name: "New Name" }; // valid, other fields omitted

// Keep only name and email
type UserPreview = Pick<User, "name" | "email">;
const preview: UserPreview = { name: "Kai", email: "kai@example.com" };

// Keep everything except id (e.g. before the id is assigned)
type NewUser = Omit<User, "id">;
const draft: NewUser = { name: "Sam", email: "sam@example.com", age: 22 };`,
        explanation:
          "Each utility type derives a new shape from `User` without duplicating its definition. If `User` gains or loses a field later, `UserUpdate`, `UserPreview`, and `NewUser` all stay automatically in sync.",
        walkthrough: [
          { code: "type UserUpdate = Partial<User>;", explanation: "Partial<T> wraps every property of User in optional (?), so any subset — including none — is valid." },
          { code: 'type UserPreview = Pick<User, "name" | "email">;', explanation: "Pick<T, Keys> keeps only the named properties from User and drops the rest entirely." },
          { code: "type NewUser = Omit<User, \"id\">;", explanation: "Omit<T, Keys> is the mirror image of Pick — it keeps every property except the ones named." },
        ],
      },
      {
        title: "Record for building object types",
        code: `type Role = "admin" | "editor" | "viewer";

// An object type with exactly these three keys, each mapping to a boolean
type RolePermissions = Record<Role, boolean>;

const permissions: RolePermissions = {
  admin: true,
  editor: true,
  viewer: false,
};

// Missing a key is an error:
const incomplete: RolePermissions = { admin: true, editor: true };
// Error: Property 'viewer' is missing.`,
        explanation:
          "`Record<Keys, ValueType>` builds an object type where every key in `Keys` maps to `ValueType`. It's especially useful for lookup tables keyed by a union of specific string values.",
      },
    ],
    howItWorks: `
Utility types aren't special syntax — they're ordinary generic types
defined using features like mapped types (covered later) that ship
built into TypeScript's standard library of type definitions. For
example, \`Partial<T>\` is implemented internally as a mapped type that
iterates over every property key in \`T\` and re-adds it with a \`?\`. When
you write \`Partial<User>\`, the compiler expands that definition using
\`User\` in place of \`T\`, producing the equivalent optional-everything
type. They only affect compile-time checking — like interfaces and type
aliases, they leave no trace in the compiled JavaScript.
    `.trim(),
    whyItExists: `
Deriving a related-but-different type from an existing one is an
extremely common need, and utility types cover the most frequent patterns
(optional versions, subsets, everything-except, lookup tables) so you
don't have to hand-write and maintain nearly-duplicate interfaces that can
silently drift apart from the original over time.
    `.trim(),
    whenToUse: `
Reach for \`Partial\` when building update or patch functions where any
subset of fields may be provided, \`Pick\`/\`Omit\` when you need a narrower
or almost-complete view of an existing type, and \`Record\` when building a
lookup table or map keyed by a known, fixed set of values.
    `.trim(),
    whenNotToUse: `
If the derived type's shape is meant to diverge significantly from the
original — different property names, genuinely unrelated structure — a
fresh interface is clearer than forcing a utility type transformation onto
an unrelated shape. Utility types shine specifically when the new type is
a *direct derivative* of an existing one.
    `.trim(),
    commonMistakes: [
      "Using `Partial<T>` and assuming it makes properties allowed to be `null` — it only makes them optional (possibly omitted), not nullable.",
      "Passing a key to `Pick` or `Omit` that doesn't actually exist on the source type, which TypeScript flags as an error rather than silently ignoring.",
      "Reaching for `Record<string, T>` when the keys are actually a known, fixed set — using the specific union of keys instead gives you far better checking (catching missing or misspelled keys).",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Given an interface `Product { id: string; name: string; price: number; }`, create a `Partial<Product>` type and an object using it that only sets `price`." },
      { difficulty: "Medium", prompt: "Using the same `Product` interface, create a `ProductSummary` type with `Pick` that keeps only `name` and `price`, and a `ProductWithoutId` type with `Omit` that drops `id`." },
      { difficulty: "Hard", prompt: "Create a type `Weekday` as a union of the five weekday names, then use `Record<Weekday, number>` to build a type representing hours worked each day, and construct a valid object of that type." },
    ],
    interviewQuestions: [
      { question: "What does `Partial<T>` do?", answer: "It produces a new type identical to T, but with every property marked optional, so an object can supply any subset of them." },
      { question: "What's the difference between `Pick<T, K>` and `Omit<T, K>`?", answer: "`Pick` keeps only the listed keys from T and drops everything else; `Omit` does the opposite, keeping everything except the listed keys." },
      { question: "When would you reach for `Record<K, V>`?", answer: "When building an object type that maps a known, fixed set of keys (often a union of string literals) to a consistent value type, like a lookup table or permissions map." },
    ],
    prerequisites: ["generics", "interfaces"],
    relatedTopics: ["generics", "mapped-types", "interfaces"],
    keywords: ["utility types", "Partial", "Pick", "Omit", "Record"],
  },
  {
    id: "classes-access-modifiers",
    title: "Classes & Access Modifiers",
    level: "intermediate",
    description:
      "Marking a class's properties and methods as `public`, `private`, or `protected` to control what code outside the class is allowed to touch.",
    explanation: `
A JavaScript class can have properties and methods, but every one of them
is reachable from outside the class by default — nothing stops other code
from reading or overwriting a property that was only ever meant to be an
internal implementation detail, like a bank account's raw balance field.

TypeScript adds three **access modifiers** you can put in front of a
class member: \`public\` (the default — reachable from anywhere, same as
plain JavaScript), \`private\` (only reachable from inside the class
itself), and \`protected\` (reachable from inside the class and any class
that extends it, but not from outside). These are enforced by the
compiler at compile time — trying to access a \`private\` member from
outside the class is flagged as an error before the code ever runs.
    `.trim(),
    analogy:
      "Think of a class like a house. `public` is the front porch — anyone can walk up to it. `private` is a locked room only the homeowner has a key to. `protected` is like a family room — the homeowner's kids (subclasses) can use it too, but a random visitor off the street cannot.",
    examples: [
      {
        title: "public, private, and enforcement",
        code: `class BankAccount {
  public accountHolder: string;
  private balance: number;

  constructor(accountHolder: string, startingBalance: number) {
    this.accountHolder = accountHolder;
    this.balance = startingBalance;
  }

  public deposit(amount: number): void {
    this.balance += amount; // fine — inside the class
  }

  public getBalance(): number {
    return this.balance;
  }
}

const account = new BankAccount("Lena", 100);
account.deposit(50);
console.log(account.balance);
// Error: Property 'balance' is private and only accessible within class 'BankAccount'.`,
        explanation:
          "`balance` can only be read or changed from methods defined inside `BankAccount`. Outside code must go through `deposit` and `getBalance` instead of touching the field directly.",
        walkthrough: [
          { code: "private balance: number;", explanation: "Marks balance as accessible only from within this class's own methods." },
          { code: "public deposit(amount: number): void {", explanation: "public is the default, but writing it explicitly makes the intent clear — this method is the sanctioned way to change balance." },
          { code: "console.log(account.balance);", explanation: "Accessing balance from outside the class violates its private modifier, so the compiler rejects this line." },
        ],
      },
      {
        title: "protected and inheritance",
        code: `class Animal {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }
}

class Dog extends Animal {
  bark(): string {
    return \`\${this.name} says woof!\`; // OK — protected is visible in subclasses
  }
}

const dog = new Dog("Rex");
console.log(dog.name);
// Error: Property 'name' is protected and only accessible
// within class 'Animal' and its subclasses.

// A shorthand: declaring and assigning a parameter in one step
class Cat {
  constructor(private lives: number = 9) {}
  loseLife(): number {
    return --this.lives;
  }
}`,
        explanation:
          "`Dog` can use `this.name` because `protected` extends visibility to subclasses, but code outside the class hierarchy still can't reach it. The `Cat` example shows a shorthand where adding a modifier directly to a constructor parameter both declares and assigns the property.",
      },
    ],
    howItWorks: `
Access modifiers are checked entirely at compile time — the compiler
tracks, for every property and method, which modifier it has and where
the accessing code is located (inside the same class, inside a subclass,
or fully outside), and reports an error for any access that violates the
rule. Once compiled to plain JavaScript, these checks disappear —
JavaScript itself (outside of its own newer, unrelated \`#private\` field
syntax) has no concept of "private," so at runtime, without extra
protection, the property is technically still reachable if someone bypasses
the type checker entirely (for example from plain, untyped JavaScript
calling into the compiled code).
    `.trim(),
    whyItExists: `
As a class grows, it usually ends up with some state that's purely an
internal implementation detail — a cache, a counter, a raw value that
should only ever be changed through a specific method that keeps it valid.
Access modifiers let the class enforce that boundary, so other code is
guided toward the intended public methods instead of reaching in and
manipulating internal state directly, which keeps the class's guarantees
about its own state reliable.
    `.trim(),
    whenToUse: `
Mark a property or method \`private\` whenever it's purely an internal
detail that outside code has no legitimate reason to touch directly — raw
internal state, helper methods that only make sense as steps within a
larger public method. Use \`protected\` specifically when subclasses need
that access too, but unrelated outside code still shouldn't have it.
    `.trim(),
    whenNotToUse: `
Don't mark something private just out of habit — if a property is
genuinely meant to be read or set freely from outside the class (like a
simple data holder with no invariants to protect), **public** (the default)
is the right, simpler choice. Over-restricting access can force callers to
write awkward workarounds for legitimate uses.
    `.trim(),
    commonMistakes: [
      "Assuming `private` blocks access at runtime in the compiled JavaScript, the same way it's blocked at compile time — it's a compile-time-only check unless you use JavaScript's own `#field` private syntax.",
      "Marking every single property `private` reflexively, even ones meant to be freely read from outside, forcing unnecessary getter methods for no real benefit.",
      "Using `protected` when `private` was actually intended, allowing an unrelated subclass to reach in and depend on internal details that were never meant to be part of its contract.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a class `Counter` with a `private count: number` field, and `increment()` and `getCount()` public methods, then try accessing `count` directly from outside to see the error." },
      { difficulty: "Medium", prompt: "Write a base class `Vehicle` with a `protected speed: number`, and a subclass `Car` with a method that uses `this.speed`. Then try accessing `speed` from outside both classes to confirm it's blocked." },
      { difficulty: "Hard", prompt: "Rewrite the `Counter` class using constructor-parameter shorthand (`constructor(private count: number = 0) {}`), and explain in a comment what changed compared to declaring the field separately." },
    ],
    interviewQuestions: [
      { question: "What's the difference between `private` and `protected` in TypeScript?", answer: "`private` members are only accessible from within the declaring class itself. `protected` members are accessible from the declaring class and any class that extends it, but not from unrelated outside code." },
      { question: "Are TypeScript's access modifiers enforced at runtime?", answer: "No — they're a compile-time-only check. Once compiled to plain JavaScript, the restriction disappears (unless the code separately uses JavaScript's own native `#private` field syntax)." },
      { question: "What is constructor parameter shorthand for class properties?", answer: "Adding an access modifier directly to a constructor parameter (e.g. `constructor(private name: string) {}`), which both declares the property on the class and assigns it from the argument, without a separate field declaration and assignment." },
    ],
    prerequisites: ["interfaces", "functions-with-types"],
    relatedTopics: ["interfaces", "generics"],
    keywords: ["classes", "public", "private", "protected", "access modifiers", "inheritance"],
  },
];
