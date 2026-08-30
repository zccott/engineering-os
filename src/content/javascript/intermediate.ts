import type { Topic } from "../../types/content";

export const javascriptIntermediateTopics: Topic[] = [
  {
    id: "arrays",
    title: "Arrays",
    level: "intermediate",
    description: "An ordered list of values, stored in a single variable.",
    explanation: `
Often you don't just have one value to track — you have many: a list of
names, scores, or products. Instead of creating a separate variable for
each one, JavaScript gives you an **array**: a single container that holds
an ordered list of values, each accessible by its position (its "index").

Indexes start at 0, so the first item is at position 0, the second at
position 1, and so on.
    `.trim(),
    analogy:
      "An array is like a row of numbered lockers. Locker 0 holds the first item, locker 1 the second, and so on. You can look inside any locker directly if you know its number.",
    examples: [
      {
        title: "Creating and using an array",
        code: `const fruits = ["apple", "banana", "cherry"];

console.log(fruits[0]); // "apple"
console.log(fruits.length); // 3

fruits.push("date"); // adds to the end
fruits.pop();        // removes the last item`,
        walkthrough: [
          { code: 'const fruits = ["apple", ...]', explanation: "Creates an array holding three strings, in order." },
          { code: "fruits[0]", explanation: 'Reads the item at index 0 — the first item, "apple".' },
          { code: "fruits.length", explanation: "Reports how many items are in the array right now." },
          { code: 'fruits.push("date");', explanation: 'Adds "date" to the end of the array.' },
          { code: "fruits.pop();", explanation: "Removes and returns the last item in the array." },
        ],
      },
      {
        title: "Looping over an array",
        code: `const scores = [10, 20, 30];

scores.forEach((score) => {
  console.log(score);
});`,
      },
    ],
    howItWorks: `
Internally, an array stores its items in order and keeps track of how many
there are (its \`length\`). Accessing \`fruits[0]\` jumps straight to the item
at position 0 without needing to check the others.
    `.trim(),
    whyItExists: `
Almost every real program deals with collections of things — a list of
users, a shopping cart, search results. Arrays give you a consistent,
built-in way to store, access, and process ordered groups of data.
    `.trim(),
    whenToUse: `
Reach for an array whenever you have more than one related value with a
natural order — a list of to-dos, a set of scores, the results of a
search. If you catch yourself naming variables \`item1\`, \`item2\`, \`item3\`,
that's a sign you want an array instead.
    `.trim(),
    whenNotToUse: `
If your values aren't really a sequence but a set of named attributes
about one thing (a person's name, age, and email), an object is a better
fit than an array. And if you need fast lookups by a unique key rather
than by position, a \`Map\` or object usually serves you better than
searching through an array.
    `.trim(),
    commonMistakes: [
      "Forgetting that array indexes start at 0, not 1.",
      "Trying to access an index that doesn't exist (returns `undefined` instead of an error).",
      "Using `for...in` on an array instead of `for...of` or `.forEach()`, which can produce unexpected results.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Create an array of 5 numbers and log the third one." },
      { difficulty: "Medium", prompt: "Use `.map()` to create a new array where every number is doubled." },
      { difficulty: "Hard", prompt: "Use `.filter()` and `.reduce()` together to sum only the even numbers in an array." },
    ],
    interviewQuestions: [
      { question: "How do you add or remove items from the end of an array?", answer: "`push()` adds to the end, `pop()` removes from the end. `unshift()` and `shift()` do the same at the beginning." },
      { question: "What's the difference between `map` and `forEach`?", answer: "`map` returns a new array built from the return value of each call; `forEach` just runs a function for each item and returns `undefined`." },
      { question: "How do you check if a value exists in an array?", answer: "`array.includes(value)` returns true/false; `array.indexOf(value)` returns the position or -1 if not found." },
    ],
    prerequisites: ["functions"],
    relatedTopics: ["objects", "loops", "array-methods"],
    keywords: ["array", "index", "push", "pop", "map", "filter", "reduce"],
  },
  {
    id: "objects",
    title: "Objects",
    level: "intermediate",
    description: "A collection of related values, stored as named properties.",
    explanation: `
An array is great when your data is an ordered list, but a lot of real data
isn't a list — it's a group of related details, like a person's name, age,
and email. An **object** stores values under named keys instead of numbered
positions, so you can describe something with multiple properties in one
place.
    `.trim(),
    analogy:
      "If an array is a row of numbered lockers, an object is a labeled filing cabinet — each drawer has a name on it (like \"name\" or \"age\"), and you open the one you need by its label, not its position.",
    examples: [
      {
        title: "Creating and using an object",
        code: `const user = {
  name: "Amara",
  age: 28,
  isAdmin: false,
};

console.log(user.name);      // "Amara"
console.log(user["age"]);    // 28

user.age = 29; // update a property`,
        explanation:
          "Properties can be read with dot notation (`user.name`) or bracket notation (`user[\"age\"]`), which is useful when the key is dynamic.",
        walkthrough: [
          { code: "const user = { name: ..., age: ..., isAdmin: ... };", explanation: "Creates an object with three named properties." },
          { code: "user.name", explanation: "Dot notation reads the value stored under the name key." },
          { code: 'user["age"]', explanation: "Bracket notation does the same thing, and is useful when the key is stored in a variable." },
          { code: "user.age = 29;", explanation: "Updates the existing age property to a new value." },
        ],
      },
      {
        title: "Objects with methods",
        code: `const user = {
  name: "Amara",
  greet() {
    console.log("Hi, I'm " + this.name);
  },
};

user.greet(); // "Hi, I'm Amara"`,
        explanation:
          "A function stored as a property is called a method. Inside it, `this` refers back to the object it was called on.",
      },
    ],
    howItWorks: `
An object stores each value under a key. When you write \`user.name\`,
JavaScript looks up the key \`"name"\` inside the object and returns whatever
value is stored there. Unlike arrays, there's no guaranteed numeric order —
you access things by name, not position.

One important detail: a variable holding an object doesn't hold the object
itself, it holds a **reference** — directions to where the object actually
lives. So copying that variable with \`=\` only copies the directions, not
the object: both variables end up pointing at the exact same object, and
changing one is visible through the other.
    `.trim(),
    whyItExists: `
Real-world things usually have multiple attributes at once — a product has
a name, price, and stock count; a user has an email and a role. Objects let
you group all of that related data together instead of tracking it in
several separate, disconnected variables.
    `.trim(),
    whenToUse: `
Use an object whenever you're describing one thing with several named
attributes — a user, a product, a settings config. If you'd naturally
answer "what properties does it have?" rather than "what position is it
at?", it's an object.
    `.trim(),
    whenNotToUse: `
If your data is really a sequence of similar items, an array (or an array
of objects) fits better than a single object with numbered-looking keys.
And for very large collections you need to search by key constantly, a
\`Map\` can be a better fit than a plain object.
    `.trim(),
    commonMistakes: [
      "Trying to access a property that doesn't exist and being surprised it returns `undefined` instead of an error.",
      "Confusing objects with arrays — using numeric indexes on an object won't work the way you expect.",
      "Forgetting that copying an object with `=` copies a reference, not a brand-new independent object.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Create an object representing a book with `title`, `author`, and `pages` properties." },
      { difficulty: "Medium", prompt: "Write a function that takes a `user` object and returns a greeting string using its `name` property." },
      { difficulty: "Hard", prompt: "Write a function that takes an array of objects (e.g. products) and returns only the ones where `inStock` is true." },
    ],
    interviewQuestions: [
      { question: "What's the difference between dot notation and bracket notation?", answer: "Both access a property. Bracket notation is required when the key is stored in a variable or isn't a valid identifier, e.g. `user[\"first-name\"]`." },
      { question: "How do you check if a key exists on an object?", answer: "Using the `in` operator (`\"name\" in user`) or `Object.hasOwn(user, \"name\")`." },
      { question: "Why does copying an object with `=` sometimes cause bugs?", answer: "Objects are copied by reference, so both variables point to the same underlying object — changing one changes the other, unless you explicitly clone it." },
    ],
    prerequisites: ["arrays"],
    relatedTopics: ["arrays", "scope", "prototypes", "destructuring-and-spread", "map-and-set", "json"],
    keywords: ["object", "property", "key", "value", "dot notation"],
  },
  {
    id: "scope",
    title: "Scope",
    level: "intermediate",
    description: "The rules that decide where a variable can be used in your code.",
    explanation: `
A variable can't always be used everywhere in your program — there are
places where a given variable simply doesn't exist as far as the code is
concerned. This area where a variable is usable is called its **scope**.

JavaScript decides scope based on where in the code a variable was
declared — this is called **lexical scope**. A variable declared inside a
function is only usable inside that function (and anything nested within
it); it disappears once the function finishes.
    `.trim(),
    analogy:
      "Think of scope like rooms in a house. Something you leave in the kitchen is only reachable while you're in the kitchen or in rooms that connect to it — it's not automatically available in every room of the house.",
    examples: [
      {
        title: "Function scope",
        code: `function greet() {
  const message = "Hello!";
  console.log(message); // works fine, "message" is in scope here
}

greet();
console.log(message); // ❌ Error: message is not defined out here`,
        walkthrough: [
          { code: "function greet() {", explanation: "Starts a new function scope." },
          { code: 'const message = "Hello!";', explanation: "message only exists inside this function's scope." },
          { code: "console.log(message);", explanation: "Works because message is in scope right here, inside greet." },
          { code: "console.log(message); // outside", explanation: "Fails — message's scope ended the moment the function finished running." },
        ],
      },
      {
        title: "Block scope with let/const",
        code: `if (true) {
  const secret = "hidden";
  console.log(secret); // works
}
console.log(secret); // ❌ Error: secret is not defined`,
      },
    ],
    howItWorks: `
When JavaScript looks up a variable, it checks the current block first,
then the block that contains it, and so on outward — this chain is called
the **scope chain**. If it reaches the outermost level without finding the
variable, it throws an error. This lookup is based entirely on where the
code was written, not on the order things happen to run in.
    `.trim(),
    diagram: `
Global scope
  └── Function scope
        └── Block scope (if/for/while)

Lookup direction: inner → outer, never outer → inner
    `.trim(),
    whyItExists: `
Without scope, every variable in a program would be visible everywhere,
which would make large programs a mess — names would collide constantly,
and it would be impossible to tell what any given piece of code depends on.
Scope keeps variables contained to where they're actually relevant.
    `.trim(),
    whenToUse: `
You're actively reasoning about scope any time you're deciding where to
declare a variable, debugging a "not defined" error, or trying to
understand why a variable inside a function isn't visible outside it.
    `.trim(),
    whenNotToUse: `
You don't need to think hard about scope for a variable used in one
small, self-contained block — it only becomes a source of confusion (and
bugs) once a program grows large enough that the same name gets reused in
multiple places.
    `.trim(),
    commonMistakes: [
      "Assuming a variable declared inside an `if` block is available outside of it.",
      "Accidentally creating a global variable by forgetting `let`/`const`/`var`.",
      "Being surprised that two functions can each have their own separate variable with the same name, with no conflict.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Declare a variable inside a function and try (and fail) to log it outside the function. Observe the error." },
      { difficulty: "Medium", prompt: "Write two functions that each declare a local variable with the same name, and show they don't interfere with each other." },
      { difficulty: "Hard", prompt: "Explain, in writing, why a variable declared with `let` inside a `for` loop is not accessible after the loop ends." },
    ],
    interviewQuestions: [
      { question: "What is lexical scope?", answer: "The idea that a variable's accessibility is determined by where it's physically written in the code, not by when or how a function is called." },
      { question: "What is the difference between global scope, function scope, and block scope?", answer: "Global scope is accessible everywhere; function scope is limited to inside a function; block scope (introduced by `let`/`const`) is limited to the nearest `{}` block, like an `if` or `for`." },
      { question: "How does scope relate to closures?", answer: "A closure is what happens when a function 'remembers' variables from its outer scope even after that outer scope has finished running." },
    ],
    prerequisites: ["functions"],
    relatedTopics: ["functions", "closures", "modules"],
    keywords: ["lexical scope", "block scope", "scope chain", "global"],
  },
  {
    id: "closures",
    title: "Closures",
    level: "intermediate",
    description: "A function that remembers the variables from where it was created, even after that outer code has finished running.",
    explanation: `
Normally, when a function finishes running, the variables it created are
thrown away — there's nothing left to hold onto them. But if that function
creates another function *inside* it, and hands that inner function back
out, something interesting happens: the inner function keeps access to the
outer variables, even though the outer function has already finished.

This "memory" is called a **closure**. It's not a special feature you turn
on — it happens automatically, any time a function is defined inside
another function and used outside of it.
    `.trim(),
    analogy:
      "Imagine a box that remembers what you put inside it. You seal it up and hand it to a friend. Weeks later, they can still open the box and find exactly what was placed inside — even though you're long gone.",
    examples: [
      {
        title: "A simple closure",
        code: `function makeCounter() {
  let count = 0;

  return function () {
    count = count + 1;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3`,
        explanation:
          "`makeCounter` finishes running immediately, but the inner function it returns still remembers and can update `count` every time it's called.",
        walkthrough: [
          { code: "function makeCounter() {", explanation: "Defines a function whose job is to build and return a counter." },
          { code: "let count = 0;", explanation: "A variable private to this one call of makeCounter." },
          { code: "return function () {", explanation: "Returns a brand-new function that closes over count." },
          { code: "count = count + 1; return count;", explanation: "Each call updates and returns the same shared count, remembered between calls." },
          { code: "const counter = makeCounter();", explanation: "Runs makeCounter once, getting back the inner function with its own private count." },
        ],
      },
      {
        title: "A private bank balance",
        code: `function makeAccount(startingBalance) {
  let balance = startingBalance;

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      balance -= amount;
      return balance;
    },
  };
}

const account = makeAccount(100);
account.deposit(50);   // 150
account.withdraw(30);  // 120
// there is no way to read or set "balance" directly from outside`,
        explanation:
          "This time the closure is shared by two returned functions instead of one, and `balance` is completely private — the only way to affect it is through `deposit`/`withdraw`.",
      },
    ],
    howItWorks: `
When a function is created, it keeps a hidden link to the scope it was
created in — not just the scope it's called from. So even after
\`makeCounter\` returns, the inner function still has a live connection to
the \`count\` variable, and can read and update it on every call.
    `.trim(),
    diagram: `
Function created
       ↓
Variables available
       ↓
Function returned
       ↓
Function remembers variables
       ↓
Function called later
    `.trim(),
    whyItExists: `
Closures let you create private state — data that only one function (or a
small group of functions) can access and update, without exposing it as a
global variable anyone could accidentally change. They're the foundation
for patterns like counters, caches, and event handlers with private data.
    `.trim(),
    whenToUse: `
Reach for a closure whenever you want a piece of state that only one
function (or a small group of related functions) can touch — a counter, a
cache, a toggle, a configuration value set up once and reused on every
call.
    `.trim(),
    whenNotToUse: `
If the state genuinely needs to be shared, modified from many unrelated
places, or inspected from outside, a closure's privacy works against you —
a plain object or a class is usually clearer. And don't reach for a
closure just to avoid passing one extra parameter.
    `.trim(),
    commonMistakes: [
      "Creating closures inside a loop and expecting each one to capture a different value of the loop variable when using `var` (they all share the same one — `let` fixes this).",
      "Thinking a closure copies the outer variable's value — it actually keeps a live reference, so if the value changes later, the closure sees the new value.",
      "Overusing closures for state that would be simpler as a regular object or class.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Create a counter using a closure, similar to the example above, but that can also be reset back to 0." },
      { difficulty: "Medium", prompt: "Create a private bank balance: a function that returns `deposit` and `withdraw` functions sharing one hidden `balance` variable." },
      { difficulty: "Hard", prompt: "Build a reusable closure-based utility, `once(fn)`, that only lets a given function run one time no matter how many times it's called." },
    ],
    interviewQuestions: [
      { question: "What is a closure?", answer: "A function that retains access to the variables from the scope it was created in, even after that outer scope has finished executing." },
      { question: "Why are closures useful?", answer: "They let you create private, persistent state tied to a function, without using global variables — useful for counters, caches, and encapsulated logic." },
      { question: "What is lexical scope, and how does it relate to closures?", answer: "Lexical scope determines which variables a function can see based on where it's written in the code. Closures are the direct result of that: a function 'takes its scope with it' wherever it goes." },
    ],
    prerequisites: ["scope"],
    relatedTopics: ["scope", "functions", "this", "higher-order-functions"],
    keywords: ["closure", "lexical scope", "private state", "counter"],
  },
  {
    id: "array-methods",
    title: "Array Methods (forEach, map, filter, reduce...)",
    level: "intermediate",
    description: "The built-in tools for looping over, transforming, and summarizing arrays without writing manual loops.",
    explanation: `
You already know you can loop over an array with a \`for\` loop. But most of
the time, what you're doing with that loop falls into one of a few common
patterns: doing something with every item, building a new array from each
item, keeping only some items, or combining everything into a single
result. JavaScript gives you a built-in method for each of these patterns,
so you don't have to write the loop by hand every time — and anyone
reading your code recognizes the pattern from the method name alone.

The core ones you'll use constantly:

- **forEach** — run some code for every item (no new array)
- **map** — build a new array by transforming every item
- **filter** — build a new array keeping only items that pass a test
- **find** — get the first item that passes a test
- **some / every** — check if any / all items pass a test
- **reduce** — combine every item into a single value
    `.trim(),
    analogy:
      "Think of an assembly line. forEach is a worker who inspects every item and does something with it but hands nothing back. map is a worker who replaces every item with a new one. filter is a worker who only lets some items through. reduce is the worker at the very end who melts everything down into one final product.",
    examples: [
      {
        title: "forEach — run code for every item",
        code: `const fruits = ["apple", "banana", "cherry"];

fruits.forEach((fruit) => {
  console.log(fruit);
});
// logs: apple, banana, cherry`,
        explanation:
          "`forEach` runs the callback once per item and returns `undefined` — it's for side effects (like logging), not for building a new value.",
      },
      {
        title: "forEach — using the index and outer variables",
        code: `const scores = [70, 85, 90];
let total = 0;

scores.forEach((score, index) => {
  console.log(\`Test \${index + 1}: \${score}\`);
  total += score;
});

console.log("Total:", total); // 245`,
        explanation:
          "The callback also receives the index as a second argument, and can freely read and update variables from the surrounding scope — forEach itself still returns undefined either way.",
      },
      {
        title: "map — transform every item into something new",
        code: `const prices = [10, 20, 30];

const withTax = prices.map((price) => price * 1.1);
console.log(withTax); // [11, 22, 33]`,
      },
      {
        title: "filter — keep only the items that pass a test",
        code: `const ages = [12, 18, 25, 16, 30];

const adults = ages.filter((age) => age >= 18);
console.log(adults); // [18, 25, 30]`,
      },
      {
        title: "find, some, and every — testing items",
        code: `const inventory = [
  { name: "widget", stock: 0 },
  { name: "gadget", stock: 5 },
];

const outOfStock = inventory.find((item) => item.stock === 0);
console.log(outOfStock); // { name: "widget", stock: 0 }

console.log(inventory.some((item) => item.stock === 0)); // true
console.log(inventory.every((item) => item.stock > 0));  // false`,
      },
      {
        title: "reduce — combine every item into a single value",
        code: `const numbers = [1, 2, 3, 4, 5];

const total = numbers.reduce((sum, n) => sum + n, 0);
console.log(total); // 15`,
        walkthrough: [
          { code: "numbers.reduce((sum, n) => sum + n, 0)", explanation: "Starts the accumulator (sum) at 0, then adds each number to it in turn." },
          { code: "(sum, n) => sum + n", explanation: "Whatever this callback returns becomes the accumulator for the next item." },
          { code: "0", explanation: "The starting value — reduce would throw on an empty array without one." },
        ],
      },
      {
        title: "reduce — building an object (counting occurrences)",
        code: `const words = ["apple", "banana", "apple", "cherry", "banana", "apple"];

const counts = words.reduce((tally, word) => {
  tally[word] = (tally[word] || 0) + 1;
  return tally;
}, {});

console.log(counts); // { apple: 3, banana: 2, cherry: 1 }`,
        explanation:
          "reduce isn't just for sums — the accumulator can be any value, including an object you build up piece by piece.",
        walkthrough: [
          { code: "tally[word] = (tally[word] || 0) + 1;", explanation: "Reads the current count for this word (or 0 the first time), adds 1, and stores it back." },
          { code: "return tally;", explanation: "Every reduce callback must return the accumulator — even here, where it's the same object being mutated and handed back each time." },
          { code: "{}", explanation: "The starting accumulator: an empty object to build counts into." },
        ],
      },
    ],
    howItWorks: `
Every one of these methods takes a callback function and calls it once
per item, passing in the current item (and its index, and the whole
array, if you need them). What differs is what each method does with the
callback's return value: \`map\` collects it into a new array, \`filter\`
uses it as a yes/no test, \`reduce\` feeds it back in as the accumulator
for the next call, and \`forEach\` just throws it away.
    `.trim(),
    diagram: `
[1, 2, 3].map(n => n * 2)

  1 → callback(1) → 2  ┐
  2 → callback(2) → 4  ├─▶ [2, 4, 6]
  3 → callback(3) → 6  ┘
    `.trim(),
    whyItExists: `
Loops are flexible, but that flexibility is also a liability — a plain
\`for\` loop can accidentally skip items, mutate things it shouldn't, or
hide what it's really doing under a pile of bookkeeping (\`let i = 0\`,
\`i++\`...). Naming the pattern (map, filter, reduce) makes the intent of
the code obvious at a glance, and removes an entire category of
off-by-one and indexing bugs.
    `.trim(),
    whenToUse: `
Reach for these whenever you're processing an array and your goal
matches one of the patterns directly: transform every item (map), keep
some of them (filter), summarize them into one value (reduce), or just
do something with each one (forEach).
    `.trim(),
    whenNotToUse: `
If you need to stop partway through for a more complex reason than
"found it," or you need to loop over two arrays in lockstep, a plain
\`for\`/\`for...of\` loop can be clearer than forcing it into one of these
methods. And chaining many of these on a huge array does multiple full
passes over the data — sometimes a single loop doing everything in one
pass is more efficient.
    `.trim(),
    commonMistakes: [
      "Using `forEach` when you actually wanted `map` — `forEach` always returns `undefined`, so `const result = arr.forEach(...)` is a common bug.",
      "Forgetting to provide a starting value to `reduce`, which can throw or misbehave on an empty array.",
      "Assuming `filter`/`map` modify the original array — they always return a brand-new array, leaving the original untouched.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Use `.map()` to turn an array of strings into an array of their lengths." },
      { difficulty: "Medium", prompt: "Use `.filter()` and `.map()` together to get the names of all users older than 18 from an array of user objects." },
      { difficulty: "Hard", prompt: "Reimplement `.map()` yourself as a function `myMap(array, callback)` using a plain `for` loop." },
    ],
    interviewQuestions: [
      { question: "What's the difference between `map` and `forEach`?", answer: "`map` returns a new array built from the callback's return values; `forEach` just runs the callback for its side effects and returns `undefined`." },
      { question: "How does `reduce` work?", answer: "It runs a callback for each item, passing in an accumulator and the current item; whatever the callback returns becomes the accumulator for the next call, and the final accumulator is reduce's return value." },
      { question: "Do these methods mutate the original array?", answer: "No — `map`, `filter`, `find`, `some`, `every`, and `reduce` all read the array without changing it; only a few methods like `push`, `pop`, `splice`, and `sort` mutate in place." },
    ],
    prerequisites: ["arrays", "functions"],
    relatedTopics: ["arrays", "higher-order-functions", "callbacks"],
    keywords: ["forEach", "map", "filter", "reduce", "find", "some", "every", "length", "array methods"],
  },
  {
    id: "string-methods",
    title: "String Methods",
    level: "intermediate",
    description: "The built-in tools for reading, searching, and reshaping text.",
    explanation: `
Text shows up everywhere in a program — a name, a message, a URL — and
you constantly need to answer small questions about it: how long is it?
does it contain this word? what does it look like in uppercase?
JavaScript strings come with a large set of built-in methods that answer
exactly these kinds of questions, so you rarely need to process text
character-by-character yourself.

A few you'll reach for constantly: \`length\` (a property, not a method,
but just as essential), \`slice\`, \`includes\`, \`split\`, \`trim\`, \`replace\`,
and template literals for building strings out of pieces.
    `.trim(),
    analogy:
      "If a string is a train of connected train cars, string methods are the tools a train inspector carries — one to count the cars (length), one to pull out a section (slice), one to check if a car of a certain type exists (includes), one to uncouple the whole train into individual cars (split).",
    examples: [
      {
        title: "Common string operations",
        code: `const message = "  Hello, World!  ";

console.log(message.length);            // 18 (includes the spaces)
console.log(message.trim());            // "Hello, World!"
console.log(message.includes("World")); // true
console.log(message.toLowerCase());     // "  hello, world!  "

const name = "Amara";
console.log(\`Hi, \${name}!\`);             // "Hi, Amara!" — a template literal

const parts = "2026-08-29".split("-");  // ["2026", "08", "29"]`,
        walkthrough: [
          { code: "message.length", explanation: "Counts every character, including the spaces at the start and end." },
          { code: "message.trim()", explanation: "Returns a new string with whitespace removed from both ends." },
          { code: 'message.includes("World")', explanation: 'Checks whether "World" appears anywhere inside the string.' },
          { code: "`Hi, ${name}!`", explanation: "A template literal — the ${...} slot is replaced with the value of name." },
          { code: '"2026-08-29".split("-")', explanation: 'Breaks the string into an array wherever a "-" appears.' },
        ],
      },
      {
        title: "Searching and replacing within a string",
        code: `const sentence = "The cat sat on the mat";

console.log(sentence.indexOf("cat"));         // 4
console.log(sentence.replace("cat", "dog"));  // "The dog sat on the mat"
console.log(sentence.startsWith("The"));      // true
console.log(sentence.slice(4, 7));            // "cat"`,
        explanation:
          "`indexOf` finds a position, `replace` swaps text, `startsWith` checks the beginning, and `slice` pulls out a substring by position — all without touching the original string.",
      },
    ],
    howItWorks: `
Because strings are immutable in JavaScript, every one of these methods
returns a brand-new string (or array) rather than modifying the
original — \`trim()\` doesn't change \`message\`, it hands you back a new,
trimmed copy. \`length\` is different: it's a property, not a method, so
you read it without parentheses.
    `.trim(),
    whyItExists: `
Handling text by hand — walking character by character to search or
reshape it — is slow to write and easy to get wrong. Built-in string
methods cover the overwhelming majority of everyday text tasks with one
clear, well-tested call.
    `.trim(),
    whenToUse: `
Reach for these whenever you're validating, searching, formatting, or
reshaping text — checking a username's length, confirming an email
contains "@", splitting a comma-separated list, or building a message
from variables with a template literal.
    `.trim(),
    whenNotToUse: `
For very heavy text processing — parsing a complex format, matching
flexible patterns — plain string methods can get unwieldy; that's when a
regular expression is worth reaching for instead. And building a large
string through many small concatenations in a loop is slower than
assembling an array of pieces and joining it once.
    `.trim(),
    commonMistakes: [
      "Forgetting that string methods don't mutate — `str.trim()` does nothing unless you use or store its return value.",
      "Using `+` to build long strings piece by piece inside a loop instead of a template literal or joining an array.",
      "Forgetting that `.length` counts UTF-16 code units, which can differ from the number of visible characters for some emoji and special characters.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Use `.toUpperCase()` and `.length` to print a name in all caps along with its length." },
      { difficulty: "Medium", prompt: "Use `.split()` and `.join()` to reverse the order of words in a sentence." },
      { difficulty: "Hard", prompt: "Write a function that checks whether a string is a valid-looking email (contains exactly one \"@\" and at least one \".\" after it) using only string methods." },
    ],
    interviewQuestions: [
      { question: "Are strings mutable in JavaScript?", answer: "No — every string method returns a new string; the original is never changed." },
      { question: "What's the difference between `slice` and `split` on a string?", answer: "`slice` extracts a portion of the string as a substring; `split` breaks the entire string apart into an array based on a separator." },
      { question: "What is a template literal?", answer: "A string written with backticks that can embed expressions directly using `${...}`, avoiding manual string concatenation." },
    ],
    prerequisites: ["data-types"],
    relatedTopics: ["data-types", "array-methods"],
    keywords: ["string", "length", "slice", "split", "template literal", "includes", "trim"],
  },
  {
    id: "callbacks",
    title: "Callbacks",
    level: "intermediate",
    description: "A function you pass into another function, to be called later — often once some work finishes.",
    explanation: `
Functions are values in JavaScript, which means you can hand one function
to another as an argument. A **callback** is exactly that: a function you
pass into another function, with the expectation that it will be called
at the right moment — after a click, after a timer finishes, after every
item in an array.

You've already been using callbacks without necessarily naming them — the
function you pass to \`.map()\`, \`addEventListener()\`, or \`setTimeout()\` is
a callback.
    `.trim(),
    analogy:
      "It's like leaving a note with a restaurant host: 'Call this number when our table is ready.' You don't wait at the counter — you hand over instructions (the callback) and get on with your day, trusting it'll be used at the right moment.",
    examples: [
      {
        title: "A function that accepts a callback",
        code: `function greetUser(name, onDone) {
  const message = "Hi, " + name + "!";
  onDone(message); // calling the callback with the result
}

greetUser("Amara", (message) => {
  console.log(message); // "Hi, Amara!"
});`,
        walkthrough: [
          { code: "function greetUser(name, onDone) {", explanation: "Accepts a callback, onDone, as its second parameter." },
          { code: 'const message = "Hi, " + name + "!";', explanation: "Builds the greeting." },
          { code: "onDone(message);", explanation: "Calls the callback, handing it the result." },
          { code: 'greetUser("Amara", (message) => {...});', explanation: "Passes an arrow function as the callback, which runs once greetUser calls it." },
        ],
      },
      {
        title: "Two different callbacks for success and failure",
        code: `function checkAge(age, onAllowed, onDenied) {
  if (age >= 18) {
    onAllowed();
  } else {
    onDenied();
  }
}

checkAge(
  20,
  () => console.log("Access granted"),
  () => console.log("Access denied")
);
// logs "Access granted"`,
        explanation:
          "A function can accept more than one callback — here, exactly one of the two runs, depending on the outcome.",
      },
    ],
    howItWorks: `
Nothing special happens under the hood — a callback is just a regular
function value, stored in a parameter and called like any other
function, whenever the code inside decides to call it. The only thing
that makes it a "callback" is the role it's playing: being called back
later, by someone else's code, instead of being called directly by
yours.
    `.trim(),
    whyItExists: `
Callbacks let a function's behavior stay flexible without knowing the
details in advance — \`.map()\` doesn't know what transformation you want,
\`addEventListener\` doesn't know what should happen on click. The callback
is how you supply that missing piece.
    `.trim(),
    whenToUse: `
Use a callback whenever you want to customize what happens at a specific
point inside another function's logic — reacting to an event, running
code once per array item, or defining what should happen once an
asynchronous task finishes.
    `.trim(),
    whenNotToUse: `
If you're nesting many callbacks inside each other for a sequence of
asynchronous steps, that's exactly the pattern promises and async/await
were built to replace — reach for those instead of deeply nested
callbacks.
    `.trim(),
    commonMistakes: [
      "Confusing `callback` with `callback()` — passing the function itself, not the result of calling it.",
      "Forgetting that a callback might run asynchronously, and expecting code after it to have access to its result immediately.",
      "Nesting many callbacks inside each other, producing hard-to-read 'callback hell'.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a function `runTwice(fn)` that calls the given function twice in a row." },
      { difficulty: "Medium", prompt: "Write a function `processArray(arr, callback)` that calls callback once for every item (essentially rebuilding forEach)." },
      { difficulty: "Hard", prompt: "Write a function that takes a callback and calls it after a 1-second delay, using `setTimeout`." },
    ],
    interviewQuestions: [
      { question: "What is a callback function?", answer: "A function passed as an argument to another function, intended to be called at a specific point inside it." },
      { question: "Is every callback asynchronous?", answer: "No — callbacks used by array methods like map/filter run synchronously; callbacks passed to setTimeout or event listeners run later, asynchronously." },
      { question: "What is 'callback hell'?", answer: "A pattern where callbacks are nested many levels deep to express a sequence of asynchronous steps, becoming hard to read — usually solved with promises or async/await." },
    ],
    prerequisites: ["functions"],
    relatedTopics: ["higher-order-functions", "array-methods", "promises"],
    keywords: ["callback", "function as value", "callback hell"],
  },
  {
    id: "higher-order-functions",
    title: "Higher-Order Functions",
    level: "intermediate",
    description: "A function that takes another function as input, returns one as output, or both.",
    explanation: `
In JavaScript, functions are values — you can store them in variables,
put them in arrays, and pass them around just like a number or a string.
A **higher-order function** is simply a function that takes advantage of
this: it either accepts another function as a parameter, returns a
function as its result, or does both.

You've already met several: \`.map()\`, \`.filter()\`, and \`.reduce()\` are all
higher-order functions, because each one accepts a callback function as
an argument.
    `.trim(),
    analogy:
      "A higher-order function is like a manager who doesn't do the specific task themselves — they take instructions (a function) from you and apply them, or they hand you back a customized set of instructions (a function) built for a specific situation.",
    examples: [
      {
        title: "A function that returns a function",
        code: `function multiplyBy(factor) {
  return function (n) {
    return n * factor;
  };
}

const double = multiplyBy(2);
const triple = multiplyBy(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15`,
        walkthrough: [
          { code: "function multiplyBy(factor) {", explanation: "A function that will build and return another function." },
          { code: "return function (n) { return n * factor; };", explanation: "Returns a new function, customized with whatever factor was passed in." },
          { code: "const double = multiplyBy(2);", explanation: "double is now a function that always multiplies by 2." },
          { code: "double(5);", explanation: "Calls that customized function, giving 10." },
        ],
      },
      {
        title: "A function that takes a function as a parameter",
        code: `function applyTwice(fn, value) {
  return fn(fn(value));
}

const addOne = (n) => n + 1;

console.log(applyTwice(addOne, 5)); // 7 — addOne(addOne(5))`,
        explanation:
          "`applyTwice` doesn't know or care what `fn` actually does — it just applies whatever function it's given, twice. That flexibility is the whole point of accepting a function as a parameter.",
      },
    ],
    howItWorks: `
Because functions are ordinary values, returning one from another
function works exactly like returning a number or a string — the
returned function just happens to be callable, and (thanks to closures)
it remembers the variables from where it was created, like \`factor\`
above.
    `.trim(),
    whyItExists: `
Higher-order functions let you write general-purpose logic once (like
"multiply by some factor") and customize it on demand, instead of
writing a separate, nearly-identical function for every specific case.
    `.trim(),
    whenToUse: `
Reach for a higher-order function when you want to generate specialized
functions from a general pattern (like \`multiplyBy\`), or when you're
designing an API where the caller should supply custom behavior (like
\`.map()\` accepting any transformation).
    `.trim(),
    whenNotToUse: `
If a plain function with a couple of parameters would do the same job
just as clearly, wrapping it in another layer of functions-returning-
functions just adds indirection without benefit.
    `.trim(),
    commonMistakes: [
      "Confusing a higher-order function with a callback — a higher-order function is the one accepting/returning functions; a callback is the function being passed in.",
      "Forgetting to actually call the returned function — `const double = multiplyBy(2)` gives you a function, not a number.",
      "Overusing function factories for cases that don't actually need customization.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a higher-order function `add(a)` that returns a function which adds `a` to whatever number it's given." },
      { difficulty: "Medium", prompt: "Write a function `compose(f, g)` that returns a new function applying `g` then `f` to its input." },
      { difficulty: "Hard", prompt: "Write a function `debounce(fn, delay)` that returns a version of `fn` which only runs after it hasn't been called for `delay` milliseconds." },
    ],
    interviewQuestions: [
      { question: "What makes a function 'higher-order'?", answer: "It accepts a function as an argument, returns a function, or both — treating functions as ordinary values." },
      { question: "Are array methods like map and filter higher-order functions?", answer: "Yes — they accept a callback function as their argument." },
      { question: "Why are higher-order functions useful?", answer: "They let you write general, reusable logic that can be customized with different behavior supplied by the caller." },
    ],
    prerequisites: ["callbacks", "closures"],
    relatedTopics: ["callbacks", "closures", "array-methods"],
    keywords: ["higher-order function", "function factory", "compose"],
  },
  {
    id: "destructuring-and-spread",
    title: "Destructuring & Spread/Rest",
    level: "intermediate",
    description: "Quick ways to pull values out of arrays/objects, and to expand or collect values using ...",
    explanation: `
Reading a few properties out of an object, or the first couple of items
from an array, usually meant writing \`const name = user.name; const age =
user.age;\` one line at a time. **Destructuring** lets you pull multiple
values out in a single line, matching the shape of what you're reading
from. Its close relative, the **spread/rest** operator (\`...\`), lets you
expand a collection into individual values, or collect several
individual values back into one.
    `.trim(),
    analogy:
      "Destructuring is like unpacking a delivery box by naming exactly which items you want handed to you directly, instead of carrying the whole box around. Spread is like dumping the entire contents of one box into a bigger one; rest is the opposite — sweeping up 'everything else' into a single box of leftovers.",
    examples: [
      {
        title: "Destructuring objects and arrays",
        code: `const user = { name: "Amara", age: 28, country: "Kenya" };
const { name, age } = user;
console.log(name, age); // "Amara" 28

const numbers = [10, 20, 30];
const [first, second] = numbers;
console.log(first, second); // 10 20

function greet({ name, age }) {
  console.log(\`Hi \${name}, age \${age}\`);
}
greet(user); // "Hi Amara, age 28"`,
        walkthrough: [
          { code: "const { name, age } = user;", explanation: "Pulls out just the name and age properties, matching them by key name." },
          { code: "const [first, second] = numbers;", explanation: "Pulls out array items by position instead of by name." },
          { code: "function greet({ name, age }) {...}", explanation: "Destructures directly in the parameter list, extracting exactly what the function needs." },
        ],
      },
      {
        title: "Spread and rest",
        code: `const base = { name: "Amara", age: 28 };
const withCountry = { ...base, country: "Kenya" }; // spread: expand base's properties in

function sum(...numbers) { // rest: collect all arguments into an array
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4)); // 10`,
      },
    ],
    howItWorks: `
Destructuring is really just special syntax for a series of individual
assignments, matched by object key or array position, done all at once.
Spread (\`...\` used when producing a new value) copies each
element/property out one at a time into the new array/object. Rest
(\`...\` used in a parameter list or destructuring pattern) does the
opposite — it gathers up any remaining values into a single array.
    `.trim(),
    whyItExists: `
Both features exist to remove repetitive, line-by-line extraction and
combination code. Destructuring makes "give me these specific pieces" a
single readable line; spread/rest make "combine everything" or "gather
the rest" equally short, especially common when copying objects/arrays
immutably or writing flexible functions.
    `.trim(),
    whenToUse: `
Use destructuring anytime you only need a few named pieces out of an
object or array — especially in function parameters. Use spread whenever
you want to copy or merge objects/arrays without mutating the originals.
Use rest whenever a function should accept any number of arguments, or
you want "everything else" from an object/array.
    `.trim(),
    whenNotToUse: `
Deeply nested destructuring patterns can become harder to read than a
couple of plain property accesses — don't force it if it hurts clarity.
And remember spread only makes a shallow copy — for nested objects,
those nested values are still shared references, not fully cloned.
    `.trim(),
    commonMistakes: [
      "Assuming spread makes a deep copy — it only copies one level; nested objects/arrays are still shared.",
      "Mixing up destructuring order for arrays (position-based) with objects (name-based).",
      "Forgetting that rest parameters must come last in a function's parameter list.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Destructure `name` and `email` out of a `user` object in one line." },
      { difficulty: "Medium", prompt: "Use spread to create a copy of an array with one extra item added, without mutating the original." },
      { difficulty: "Hard", prompt: "Write a function `sum(...numbers)` using rest parameters that adds any number of arguments together." },
    ],
    interviewQuestions: [
      { question: "What's the difference between spread and rest, given they use the same `...` syntax?", answer: "Spread expands a collection into individual values (used when building something new); rest collects individual values back into a single array (used in parameters or destructuring)." },
      { question: "Does spread create a deep copy?", answer: "No — only a shallow copy; nested objects/arrays inside are still shared by reference." },
      { question: "Can you destructure directly in a function's parameters?", answer: "Yes — it's a common way to pull out just the specific properties a function needs from an object argument." },
    ],
    prerequisites: ["objects", "arrays"],
    relatedTopics: ["objects", "arrays", "functions"],
    keywords: ["destructuring", "spread", "rest", "..."],
  },
];
