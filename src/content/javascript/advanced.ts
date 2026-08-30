import type { Topic } from "../../types/content";

export const javascriptAdvancedTopics: Topic[] = [
  {
    id: "promises",
    title: "Promises",
    level: "advanced",
    description: "An object that represents a value you'll get later, not right now.",
    explanation: `
Some tasks don't finish instantly — fetching data from a server, reading a
file, waiting a few seconds. JavaScript can't just pause and wait around,
because that would freeze the whole page. Instead, it needs a way to say
"start this task, and let me know when it's done."

A **Promise** is an object that represents a value that isn't ready yet, but
will be — either successfully (**resolved**) or unsuccessfully (**rejected**).
You attach instructions for what to do in each case using \`.then()\` and
\`.catch()\`.
    `.trim(),
    analogy:
      "A promise is like a food delivery tracking number. You don't have the food yet, but you have something that represents it — and you can be notified the moment it arrives, or if the order fails.",
    examples: [
      {
        title: "Creating and using a promise",
        code: `function waitOneSecond() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Done waiting!");
    }, 1000);
  });
}

waitOneSecond()
  .then((message) => console.log(message)) // logs "Done waiting!" after 1s
  .catch((error) => console.log("Something went wrong:", error));`,
        walkthrough: [
          { code: "function waitOneSecond() {", explanation: "Defines a function that returns a promise instead of an immediate value." },
          { code: "return new Promise((resolve) => {", explanation: "Creates a new pending promise; resolve is a function to call once the work succeeds." },
          { code: 'setTimeout(() => { resolve("Done waiting!"); }, 1000);', explanation: "After 1 second, calls resolve with the result, settling the promise as fulfilled." },
          { code: "waitOneSecond().then((message) => ...)", explanation: "Runs this callback once the promise resolves, receiving the resolved value." },
          { code: ".catch((error) => ...)", explanation: "Runs only if the promise is rejected instead of resolved." },
        ],
      },
      {
        title: "A promise that can reject",
        code: `function fetchUser(id) {
  return new Promise((resolve, reject) => {
    if (id <= 0) {
      reject(new Error("Invalid user id"));
      return;
    }
    resolve({ id, name: "Amara" });
  });
}

fetchUser(-1)
  .then((user) => console.log(user))
  .catch((error) => console.log("Failed:", error.message)); // "Failed: Invalid user id"`,
        explanation:
          "`reject(...)` settles the promise as failed instead of successful, and control jumps straight to `.catch()`, skipping `.then()` entirely.",
      },
    ],
    howItWorks: `
A promise starts in a "pending" state. When the task finishes, it either
calls \`resolve(value)\` — moving the promise to "fulfilled" and triggering any
\`.then()\` callbacks — or calls \`reject(error)\`, moving it to "rejected" and
triggering \`.catch()\`. Once settled, a promise's outcome never changes again.
    `.trim(),
    diagram: `
Promise created (pending)
       ↓
Task runs in the background
       ↓
   ┌───────┴───────┐
success           failure
   ↓                 ↓
resolve(value)   reject(error)
   ↓                 ↓
.then() runs     .catch() runs
    `.trim(),
    whyItExists: `
Before promises, handling multiple sequential async tasks (like "fetch a
user, then fetch their orders, then fetch order details") led to deeply
nested callbacks that were hard to read and error-prone. Promises give
asynchronous code a consistent shape and let errors be handled in one place.
    `.trim(),
    whenToUse: `
Reach for a promise anytime you're doing something that finishes later,
not immediately — fetching data, reading a file, waiting on a timer — and
you want a clean way to say what happens on success versus failure.
    `.trim(),
    whenNotToUse: `
You don't need a promise for something that finishes instantly — wrapping
simple, immediate work in one just adds overhead. And in most modern code
you'll rarely write \`.then()\` chains by hand; reach for \`async/await\` on top
of promises instead, and use raw promises mainly when building the
underlying async function itself.
    `.trim(),
    commonMistakes: [
      "Forgetting to add a `.catch()`, so errors disappear silently.",
      "Nesting `.then()` calls instead of chaining them, recreating the exact mess promises were meant to fix.",
      "Forgetting to `return` a value inside a `.then()`, breaking the chain for the next `.then()`.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Create a promise that resolves with your name after 500ms, and log it with `.then()`." },
      { difficulty: "Medium", prompt: "Create a promise that randomly resolves or rejects, and handle both cases." },
      { difficulty: "Hard", prompt: "Chain three promises together, each depending on the previous result, using `.then()`." },
    ],
    interviewQuestions: [
      { question: "What are the three states of a promise?", answer: "Pending (not yet settled), fulfilled (resolved successfully), and rejected (failed)." },
      { question: "What's the difference between `.then()` and `.catch()`?", answer: "`.then()` handles a successful resolution; `.catch()` handles a rejection (an error)." },
      { question: "What does `Promise.all()` do?", answer: "It takes an array of promises and resolves once all of them succeed, or rejects as soon as any one of them fails." },
    ],
    prerequisites: ["functions"],
    relatedTopics: ["async-await", "event-loop", "error-handling"],
    keywords: ["promise", "resolve", "reject", "then", "catch", "async"],
  },
  {
    id: "async-await",
    title: "Async/Await",
    level: "advanced",
    description: "A cleaner way to write asynchronous code so it reads like normal, step-by-step code.",
    explanation: `
Promises solved the "callback mess" problem, but chaining many \`.then()\`
calls can still be hard to read. **async/await** is newer syntax built on
top of promises that lets you write asynchronous code that *looks*
synchronous — top to bottom, like normal steps — while still not blocking
the rest of the program.

You mark a function as \`async\`, and inside it you use \`await\` before a
promise to pause that function (and only that function) until the promise
settles.
    `.trim(),
    analogy:
      "It's like a recipe written as a checklist instead of a tangle of arrows: 'wait for the water to boil, then add pasta, then wait 10 minutes.' Each step waits for the previous one, written in plain, readable order.",
    examples: [
      {
        title: "Using async/await",
        code: `async function getUserData() {
  const response = await fetch("/api/user");
  const data = await response.json();
  return data;
}`,
        walkthrough: [
          { code: "async function getUserData() {", explanation: "Marks this function as async, allowing await inside it and making it always return a promise." },
          { code: 'const response = await fetch("/api/user");', explanation: "Pauses this function only (not the whole program) until the network request settles." },
          { code: "const data = await response.json();", explanation: "Pauses again while the response body is parsed as JSON." },
          { code: "return data;", explanation: "Sends the parsed data back to whoever called and awaited getUserData()." },
        ],
      },
      {
        title: "Handling errors with try/catch",
        code: `async function getUserData() {
  try {
    const response = await fetch("/api/user");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Failed to load user:", error);
  }
}`,
      },
    ],
    howItWorks: `
When JavaScript hits \`await somePromise\`, it pauses that async function's
progress right there — without freezing the rest of the program — and lets
other code keep running. Once the promise settles, the function resumes
exactly where it left off, with the resolved value in hand (or an error, if
it was rejected).
    `.trim(),
    whyItExists: `
async/await exists purely to make promise-based code easier to read and
reason about. It doesn't replace promises — it's built entirely on top of
them — but it removes a lot of the \`.then()\` chaining boilerplate.
    `.trim(),
    whenToUse: `
Use async/await whenever you have a sequence of asynchronous steps that
depend on each other — fetch a user, then fetch their orders, then display
them — and you want that sequence to read top-to-bottom like ordinary
code.
    `.trim(),
    whenNotToUse: `
Skip async/await for synchronous code that never needs to wait on
anything — adding \`async\` gains you nothing there. And when several async
tasks don't depend on each other, awaiting them one at a time is slower
than starting them together with \`Promise.all\`.
    `.trim(),
    commonMistakes: [
      "Forgetting the `async` keyword on a function that uses `await` inside it.",
      "Forgetting to wrap `await` calls in `try/catch`, so rejected promises crash the function silently.",
      "Using `await` in a loop when the calls don't actually depend on each other, making things slower than necessary (running them in parallel with `Promise.all` would be faster).",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Convert a `.then()`-based promise chain into an `async/await` function." },
      { difficulty: "Medium", prompt: "Write an async function that fetches data and handles errors with `try/catch`." },
      { difficulty: "Hard", prompt: "Write an async function that runs three independent async tasks in parallel using `Promise.all`, instead of `await`-ing them one by one." },
    ],
    interviewQuestions: [
      { question: "How does `async/await` relate to promises?", answer: "It's syntax sugar over promises — an `async` function always returns a promise, and `await` pauses execution until a promise settles." },
      { question: "How do you handle errors in async/await code?", answer: "With a `try/catch` block around the `await` calls." },
      { question: "Does `await` block the entire program?", answer: "No — it only pauses the current async function. The rest of the program (and browser) keeps running normally." },
    ],
    prerequisites: ["promises"],
    relatedTopics: ["promises", "event-loop", "error-handling"],
    keywords: ["async", "await", "try catch", "asynchronous"],
  },
  {
    id: "event-loop",
    title: "Event Loop",
    level: "advanced",
    description: "The mechanism that lets JavaScript handle many tasks without ever running two at once.",
    explanation: `
JavaScript can only do one thing at a time — it has a single "thread" of
execution. And yet it can handle things like timers, network requests, and
user clicks all seemingly "at once" without freezing the page. The
**event loop** is the mechanism that makes this possible.

It works by separating "run this code right now" from "run this code later,
once something else finishes" — and constantly checking whether it's time
to run any of that waiting code.
    `.trim(),
    analogy:
      "Imagine a single chef in a kitchen who can only cook one dish at a time, but has an oven timer for things in the background. The chef finishes the current dish, checks if any timers have gone off, handles those, then moves to the next task — never doing two things simultaneously, but never sitting idle either.",
    examples: [
      {
        title: "Order of execution",
        code: `console.log("1: start");

setTimeout(() => {
  console.log("2: timeout callback");
}, 0);

console.log("3: end");

// Output order:
// 1: start
// 3: end
// 2: timeout callback`,
        explanation:
          "Even with a 0ms delay, the timeout callback runs after all the regular code — because it has to wait for the main code to finish first.",
        walkthrough: [
          { code: 'console.log("1: start");', explanation: "Runs immediately — the first line on the call stack." },
          { code: "setTimeout(() => {...}, 0);", explanation: "Hands the callback to the browser to run later, even with a 0ms delay — JavaScript doesn't wait here." },
          { code: 'console.log("3: end");', explanation: "Also runs immediately, since it doesn't wait on the timer at all." },
          { code: "// 2: timeout callback", explanation: "Only runs once the current code finishes and the call stack is completely empty." },
        ],
      },
      {
        title: "Promises run before timers",
        code: `console.log("1: start");

setTimeout(() => console.log("2: setTimeout"), 0);

Promise.resolve().then(() => console.log("3: promise"));

console.log("4: end");

// Output order: 1, 4, 3, 2`,
        explanation:
          "Promise callbacks (microtasks) are always drained before the next timer callback (a macrotask) runs, even if both were scheduled at roughly the same time.",
      },
    ],
    howItWorks: `
JavaScript runs your main code on something called the **call stack**. When
it encounters something asynchronous (like \`setTimeout\` or a network
request), that task is handed off to the browser, and JavaScript keeps
running the rest of the main code. Once the async task finishes, its
callback is placed in a queue — but there are actually two of them, checked
in a strict order. Promise callbacks go into the **microtask queue**;
timers, network events, and clicks go into the **macrotask queue**. The
event loop's job is: once the call stack is empty, drain the *entire*
microtask queue first — running every waiting promise callback, even ones
added while draining — and only once it's completely empty does it run a
single macrotask, before checking the microtask queue again.
    `.trim(),
    diagram: `
Call stack (running now)
       ↓ empty?
Event loop checks the queue
       ↓
Queue has a waiting callback? ──▶ run it on the call stack
       ↓ no
keep checking
    `.trim(),
    whyItExists: `
Without the event loop, any slow task (like a network request) would
freeze the entire page until it finished. The event loop lets JavaScript
start slow tasks, move on immediately, and come back to handle the result
later — keeping the page responsive the whole time.
    `.trim(),
    whenToUse: `
You reach for this mental model any time you're debugging unexpected
ordering — why a \`console.log\` ran before a network response, why a
\`setTimeout(fn, 0)\` didn't run immediately, or why the page froze during a
long calculation.
    `.trim(),
    whenNotToUse: `
Day-to-day, you don't manage the event loop directly — there's no API to
configure it. It's not something you "use"; it's something you understand
so that async code (promises, timers, events) makes sense instead of
feeling random.
    `.trim(),
    commonMistakes: [
      "Assuming `setTimeout(fn, 0)` runs immediately — it still waits for the current code to finish first.",
      "Not realizing that a long-running synchronous loop can freeze the page, since nothing else can run until the call stack is clear.",
      "Confusing the order of promise callbacks (microtasks) and timer callbacks (macrotasks) — microtasks always finish draining before the next macrotask runs, it's not just a usual tendency.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Predict, then verify, the console output order of a mix of `console.log` and `setTimeout` calls." },
      { difficulty: "Medium", prompt: "Write a small snippet mixing a `Promise.resolve().then()` and a `setTimeout`, and explain which runs first and why." },
      { difficulty: "Hard", prompt: "Explain, in your own words, why a `for` loop with a billion iterations would freeze a webpage." },
    ],
    interviewQuestions: [
      { question: "Is JavaScript single-threaded?", answer: "Yes — it runs one line of code at a time on a single call stack, but the browser provides separate mechanisms (timers, network APIs) to handle slow work in the background." },
      { question: "What is the difference between the call stack and the task queue?", answer: "The call stack is where code currently executes, one frame at a time. The task queue holds callbacks (from timers, promises, events) waiting for the stack to be empty before they can run." },
      { question: "Do microtasks (promises) or macrotasks (setTimeout) run first?", answer: "Microtasks run first — the event loop drains the entire microtask queue before picking up the next macrotask." },
    ],
    prerequisites: ["async-await"],
    relatedTopics: ["promises", "async-await"],
    keywords: ["event loop", "call stack", "queue", "single-threaded", "microtask"],
  },
  {
    id: "prototypes",
    title: "Prototypes",
    level: "advanced",
    description: "How JavaScript objects share behavior with each other behind the scenes.",
    explanation: `
When you call \`"hello".toUpperCase()\`, you're using a method you never
defined yourself. Where did it come from? Every object in JavaScript has a
hidden link to another object it can "fall back to" when it doesn't have a
property itself — that fallback object is called its **prototype**.

If JavaScript can't find a property directly on an object, it checks the
object's prototype, then that prototype's prototype, and so on, until it
finds the property or runs out of links. This chain is called the
**prototype chain**.
    `.trim(),
    analogy:
      "Imagine asking a coworker a question. If they don't know the answer, they ask their manager. If the manager doesn't know, they ask their manager. Each object checks its own knowledge first, then defers up a chain until someone has the answer.",
    examples: [
      {
        title: "Objects sharing behavior via a prototype",
        code: `const animal = {
  speak() {
    console.log(this.name + " makes a sound.");
  },
};

const dog = Object.create(animal);
dog.name = "Rex";

dog.speak(); // "Rex makes a sound."
// dog doesn't have its own "speak" method — it found it on "animal"`,
        walkthrough: [
          { code: "const animal = { speak() {...} };", explanation: "A plain object with one method, speak." },
          { code: "const dog = Object.create(animal);", explanation: "Creates a new, empty object whose prototype is set to animal." },
          { code: 'dog.name = "Rex";', explanation: "Adds an own property, name, directly on dog." },
          { code: "dog.speak();", explanation: "dog has no speak of its own, so JavaScript finds it on animal via the prototype chain." },
        ],
      },
      {
        title: "class syntax uses prototypes underneath",
        code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(this.name + " makes a sound.");
  }
}

const cat = new Animal("Whiskers");
cat.speak(); // "Whiskers makes a sound."

console.log(Object.getPrototypeOf(cat) === Animal.prototype); // true`,
        explanation:
          "`speak` is defined once, on `Animal.prototype`, and every instance created with `new Animal(...)` shares that same method through the prototype chain — it isn't copied per instance. Note: `Animal.prototype` is a special property that only functions and classes have — it's the template object that becomes the internal fallback link (what `Object.getPrototypeOf` reads back) for every instance created with `new Animal(...)`. They're two names for closely related things, not the same thing.",
      },
    ],
    howItWorks: `
Every object has an internal link (accessible via \`Object.getPrototypeOf\`)
pointing to another object. Property lookup checks the object itself first;
if not found, it walks up this chain of prototypes. Arrays and functions
are also objects, and they get useful built-in methods (like \`.map()\` or
\`.call()\`) this exact same way — from their own prototypes.

Don't confuse this internal link with the \`.prototype\` **property** you see
on functions and classes (like \`Animal.prototype\`) — that property is only
a template object, used to set up the internal link on every instance
created with \`new\`. Plain objects (like \`{}\`) don't have a \`.prototype\`
property at all, even though they still have an internal prototype link.
    `.trim(),
    whyItExists: `
Prototypes let many objects share the same methods without each one storing
its own separate copy — saving memory and letting you update shared
behavior in one place. It's the mechanism underneath JavaScript's classes
and built-in types like arrays and strings.
    `.trim(),
    whenToUse: `
You lean on prototypes — often without realizing it — any time you call a
built-in method on a value (\`.map()\`, \`.toUpperCase()\`). You reach for them
directly when you want several objects to share the same behavior without
duplicating it, which today is usually written with \`class\` rather than
\`Object.create\` by hand.
    `.trim(),
    whenNotToUse: `
For most everyday application code, you don't need to manipulate
prototypes directly — \`class\` syntax covers the common cases more clearly.
Reach for raw prototype manipulation only when you're building a library,
working with older code, or need behavior \`class\` doesn't offer directly.
    `.trim(),
    commonMistakes: [
      "Confusing an object's own properties with properties it only has access to through its prototype.",
      "Modifying a shared prototype directly and accidentally affecting every object that relies on it.",
      "Assuming JavaScript's `class` syntax is a completely different system — it's mostly a friendlier way to write prototype-based code.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Use `Object.getPrototypeOf()` on an array and on a plain object, and compare the results." },
      { difficulty: "Medium", prompt: "Create an object `vehicle` with a `honk` method, then use `Object.create()` to make a `car` object that inherits it." },
      { difficulty: "Hard", prompt: "Explain, using the prototype chain, why `[].toString()` works even though arrays don't define `toString` themselves." },
    ],
    interviewQuestions: [
      { question: "What is the prototype chain?", answer: "A series of linked objects that JavaScript walks through when looking up a property that isn't found directly on an object." },
      { question: "How does `class` relate to prototypes?", answer: "JavaScript classes are largely syntax sugar over prototype-based inheritance — methods defined in a class body end up on the class's prototype." },
      { question: "What does `Object.create(proto)` do?", answer: "It creates a new, empty object whose prototype is explicitly set to `proto`, giving it access to everything on `proto` without copying it." },
    ],
    prerequisites: ["objects"],
    relatedTopics: ["objects", "this"],
    keywords: ["prototype", "prototype chain", "inheritance", "Object.create"],
  },
  {
    id: "this",
    title: "this",
    level: "advanced",
    description: "A special keyword that refers to whatever object is currently 'in charge' of the running code.",
    explanation: `
Sometimes code inside a function needs to refer to "the object I belong
to" without naming that object directly — so the same code can work for
many different objects. JavaScript provides a special keyword, \`this\`, that
refers to that object.

The tricky part: \`this\` isn't fixed to where a function is *written* — it
depends on how the function is *called*. The same function can have a
different \`this\` each time you call it differently.
    `.trim(),
    analogy:
      "Think of \"this\" like the word \"I\" in a sentence. The word itself doesn't change, but who \"I\" refers to depends entirely on who's speaking at the time.",
    examples: [
      {
        title: "`this` depends on how a function is called",
        code: `const user = {
  name: "Amara",
  greet() {
    console.log("Hi, I'm " + this.name);
  },
};

user.greet(); // "Hi, I'm Amara" — this = user, because user.greet() called it

const greetFn = user.greet;
greetFn(); // "Hi, I'm undefined" — this is no longer "user" here`,
        explanation:
          "Calling `user.greet()` sets `this` to `user`. But once the function is detached from `user` and called on its own, `this` no longer points to `user`.",
        walkthrough: [
          { code: "const user = { name: ..., greet() {...} };", explanation: "Defines an object with a method, greet." },
          { code: "user.greet();", explanation: "Called as user.greet(), so this inside greet is set to user." },
          { code: "const greetFn = user.greet;", explanation: "Copies just the function itself, detached from user." },
          { code: "greetFn();", explanation: "Called plainly, so this is no longer user — this.name is undefined." },
        ],
      },
      {
        title: "Arrow functions and `this`",
        code: `const user = {
  name: "Amara",
  greet: () => {
    console.log("Hi, I'm " + this.name); // ❌ arrow functions don't have their own "this"
  },
};`,
        explanation:
          "Arrow functions intentionally don't have their own `this` — they use `this` from the surrounding code where they were written, which is usually not what you want for object methods.",
      },
    ],
    howItWorks: `
When a regular function is called, JavaScript looks at *how* it was called
to decide what \`this\` should be: calling it as \`obj.method()\` sets \`this\` to
\`obj\`; calling it plain, like \`fn()\`, sets \`this\` to \`undefined\` (in strict
mode) or the global object; and \`.call()\`/\`.apply()\`/\`.bind()\` let you set
\`this\` explicitly. Arrow functions skip this process entirely and just
borrow \`this\` from their enclosing scope.
    `.trim(),
    whyItExists: `
\`this\` lets the same method definition work correctly for many different
objects — one \`greet\` method can be shared by every user object, each
correctly referring to itself, instead of needing a separate hardcoded copy
per object.
    `.trim(),
    whenToUse: `
You need to reason about \`this\` any time you write a method on an object,
use a class, or pass a function around as a callback — knowing what \`this\`
will be tells you whether that code will actually work when it's called.
    `.trim(),
    whenNotToUse: `
In plain or arrow functions that don't depend on an object's own data, you
often don't need \`this\` at all — a regular parameter is clearer. And inside
object methods that get used as callbacks, prefer an arrow function or
\`.bind()\` over relying on the caller to preserve \`this\` correctly.
    `.trim(),
    commonMistakes: [
      "Passing an object method as a callback (e.g. to `setTimeout`) and losing its intended `this`.",
      "Using a regular function for an object method that's called as a plain callback, instead of binding it or using an arrow function appropriately.",
      "Assuming `this` refers to where a function is defined rather than how it's called.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Create an object with a method that logs `this.name`, and call it normally to confirm it works." },
      { difficulty: "Medium", prompt: "Detach that method into its own variable, call it directly, and explain why `this` breaks." },
      { difficulty: "Hard", prompt: "Fix the broken example using `.bind()`, and explain what `.bind()` actually does." },
    ],
    interviewQuestions: [
      { question: "What determines the value of `this` in a regular function?", answer: "How the function is called — as a method (`obj.fn()`), standalone (`fn()`), with `new`, or with `.call`/`.apply`/`.bind` — not where it's defined." },
      { question: "Why don't arrow functions have their own `this`?", answer: "They were designed to inherit `this` from their surrounding (lexical) scope, which avoids a very common class of bugs when using callbacks inside methods." },
      { question: "What does `.bind()` do?", answer: "It returns a new function with `this` permanently set to whatever value you pass in, regardless of how that new function is later called." },
    ],
    prerequisites: ["functions", "objects"],
    relatedTopics: ["functions", "prototypes", "closures"],
    keywords: ["this", "bind", "call", "apply", "context"],
  },
  {
    id: "js-gotchas",
    title: "Common JavaScript Confusions",
    level: "advanced",
    description: "A collection of surprising JavaScript behaviors that trip up almost everyone at some point.",
    explanation: `
Most of the time JavaScript behaves the way you'd expect. But it has a
handful of well-known quirks — leftover design decisions from decades
ago — that surprise even experienced developers the first time they hit
them. Knowing them in advance turns a confusing bug into "oh, that's
just how this works."
    `.trim(),
    analogy:
      "Think of these like the weird exceptions in English spelling — 'i before e except after c' has plenty of exceptions, and once you've been warned about them, they stop being confusing surprises and just become 'the known weird parts.'",
    examples: [
      {
        title: "A handful of classic surprises",
        code: `console.log(0.1 + 0.2);        // 0.30000000000000004
console.log(NaN === NaN);      // false
console.log(typeof null);      // "object"
console.log([] + []);          // "" (empty string)
console.log([1, 2] + [3, 4]);  // "1,23,4"`,
        walkthrough: [
          { code: "0.1 + 0.2", explanation: "Floating-point numbers can't represent 0.1 or 0.2 exactly, so tiny rounding errors leak into the result." },
          { code: "NaN === NaN", explanation: "NaN is defined to never equal anything, even itself — use Number.isNaN() to check for it instead." },
          { code: "typeof null", explanation: "A decades-old bug kept for backward compatibility — null is not actually an object." },
          { code: "[] + []", explanation: "Arrays get converted to strings for +, and an empty array becomes an empty string." },
        ],
      },
      {
        title: "More surprises: closures in loops, and array holes",
        code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// logs: 3, 3, 3 — not 0, 1, 2 (all three closures share the same "var i")

console.log([1, , 3].length); // 3 — the missing middle slot still counts`,
        explanation:
          "Using `var` in the loop means every callback closes over the exact same variable, which has already finished looping by the time the callbacks run — switching to `let` fixes it, since each iteration gets its own binding.",
      },
    ],
    howItWorks: `
Each of these traces back to a specific rule: floating-point numbers are
stored in binary and can't represent every decimal exactly; \`NaN\` is
specified to compare unequal to everything including itself;
\`typeof null\` returning "object" is a bug from JavaScript's very first
version that was never fixed, to avoid breaking existing code; and \`+\` on
non-numbers tries to convert its operands to primitives (often strings)
before combining them.
    `.trim(),
    whyItExists: `
These aren't bugs introduced by any particular program — they're
consequences of decisions (or accidents) baked into the language itself,
decades ago, that can't be changed without breaking the entire web.
Learning them once means you recognize the pattern instantly instead of
losing an hour to it in the future.
    `.trim(),
    whenToUse: `
Keep this list in mind whenever a result looks "obviously wrong" at a
glance — comparing floating-point numbers for exact equality, checking
for NaN, or relying on typeof for a null check. Recognizing these
patterns is what turns a mysterious bug into an instant diagnosis.
    `.trim(),
    whenNotToUse: `
You don't need to work around these preemptively everywhere — most code
never touches floating-point precision or NaN in a way that matters. Add
the specific safeguard (Number.isNaN, rounding, an explicit null check)
only where the code actually depends on getting it right.
    `.trim(),
    commonMistakes: [
      "Comparing floating-point calculations with `===` instead of checking they're 'close enough' (within a small tolerance).",
      "Using `someValue === NaN` to check for NaN — it will always be false; use `Number.isNaN(someValue)` instead.",
      "Checking `typeof value === \"object\"` to detect an object and forgetting that `null` passes that check too.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Predict, then verify, the result of `0.1 + 0.2 === 0.3`." },
      { difficulty: "Medium", prompt: "Write a function `isNullOrObject(value)` that correctly distinguishes `null` from a real object." },
      { difficulty: "Hard", prompt: "Write a function `safeEquals(a, b)` that correctly returns true for `NaN, NaN` while behaving like `===` for everything else." },
    ],
    interviewQuestions: [
      { question: "Why does `0.1 + 0.2` not equal `0.3` exactly in JavaScript?", answer: "Because JavaScript stores numbers in binary floating-point, which can't represent most decimal fractions exactly, leading to tiny rounding errors." },
      { question: "How do you correctly check if a value is NaN?", answer: "Use `Number.isNaN(value)`, since `NaN === NaN` is always false." },
      { question: "Why does `typeof null` return \"object\"?", answer: "It's a long-standing bug from JavaScript's first version, kept for backward compatibility rather than fixed." },
    ],
    prerequisites: ["data-types", "operators"],
    relatedTopics: ["data-types", "operators"],
    keywords: ["NaN", "floating point", "typeof null", "gotchas", "quirks", "confusions"],
  },
  {
    id: "error-handling",
    title: "Error Handling",
    level: "advanced",
    description: "Dealing with things that go wrong in your code on purpose, instead of letting the program crash.",
    explanation: `
Sometimes code can't do what it was asked — a network request fails, a
file doesn't exist, a value isn't what was expected. Left alone, this
throws an **error**, and unless something handles it, the program
crashes. JavaScript's \`try/catch\` lets you say: "attempt this, and if it
fails, run this other code instead of crashing."
    `.trim(),
    analogy:
      "It's like a safety net under a tightrope walker. You still attempt the risky move (the try), but if something goes wrong, the net (the catch) stops it from becoming a disaster.",
    examples: [
      {
        title: "try / catch / finally",
        code: `function parseUserAge(input) {
  try {
    const age = JSON.parse(input);
    if (typeof age !== "number") {
      throw new Error("Age must be a number");
    }
    return age;
  } catch (error) {
    console.log("Invalid input:", error.message);
    return null;
  } finally {
    console.log("Finished attempting to parse.");
  }
}`,
        walkthrough: [
          { code: "try {", explanation: "Marks the code that might fail." },
          { code: "const age = JSON.parse(input);", explanation: "If input isn't valid JSON, this throws automatically." },
          { code: 'throw new Error("Age must be a number");', explanation: "Manually throws an error if the parsed value isn't the right type." },
          { code: "} catch (error) {", explanation: "Runs only if something inside try threw — error holds the thrown value." },
          { code: "} finally {", explanation: "Runs no matter what — whether try succeeded or catch ran." },
        ],
      },
      {
        title: "A custom error class",
        code: `class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function setAge(age) {
  if (age < 0) {
    throw new ValidationError("Age can't be negative");
  }
  return age;
}

try {
  setAge(-5);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Validation failed:", error.message);
  } else {
    throw error; // an error we didn't expect — let it propagate
  }
}`,
        explanation:
          "Custom error classes let a `catch` block tell different kinds of failures apart with `instanceof`, instead of treating every error the same way.",
      },
    ],
    howItWorks: `
When code inside \`try\` throws (either automatically, from a failing
operation, or manually via \`throw\`), JavaScript immediately stops
executing that block and jumps to the matching \`catch\`, skipping any
remaining lines in \`try\`. The optional \`finally\` block runs afterward no
matter what happened, useful for cleanup that must always happen.
    `.trim(),
    whyItExists: `
Without error handling, one unexpected failure anywhere would crash the
entire program. try/catch lets you contain failures to the specific
operation that caused them, respond sensibly (retry, show a message, use
a default), and keep the rest of the program running.
    `.trim(),
    whenToUse: `
Wrap code in try/catch around operations that can realistically fail in
ways you want to handle gracefully — parsing untrusted data, network
requests (often alongside async/await), or any operation whose failure
shouldn't crash the whole app.
    `.trim(),
    whenNotToUse: `
Don't wrap code in try/catch just out of caution when there's no
realistic failure to handle, or nothing sensible to do in the catch
block — silently swallowing errors that way can hide real bugs instead
of fixing them. And don't use exceptions for ordinary control flow (like
checking if a key exists) when a simple \`if\` would do.
    `.trim(),
    commonMistakes: [
      "Catching an error and doing nothing with it (an empty catch block), which hides bugs instead of fixing them.",
      "Forgetting that `catch` only catches errors thrown synchronously inside the try — a callback or an unawaited promise inside it can still throw unnoticed.",
      "Throwing plain strings or objects instead of an `Error` (or subclass), losing useful information like a stack trace.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a function that safely divides two numbers, throwing an error if the divisor is 0, and catching it to return `null` instead of crashing." },
      { difficulty: "Medium", prompt: "Create a custom error class `ValidationError extends Error` and throw/catch an instance of it." },
      { difficulty: "Hard", prompt: "Write an async function that retries a failing operation up to 3 times before giving up, using try/catch inside a loop." },
    ],
    interviewQuestions: [
      { question: "What does the `finally` block do?", answer: "It runs after try/catch, regardless of whether an error was thrown or caught — commonly used for cleanup." },
      { question: "What's the benefit of throwing an `Error` object instead of a plain string?", answer: "Error objects carry a message and a stack trace, making debugging much easier." },
      { question: "Does try/catch catch errors from asynchronous callbacks?", answer: "Not automatically — a callback or unawaited promise that throws later won't be caught by a try/catch that already finished executing; async/await lets you catch those properly." },
    ],
    prerequisites: ["functions"],
    relatedTopics: ["promises", "async-await"],
    keywords: ["try", "catch", "finally", "throw", "Error", "exception"],
  },
  {
    id: "modules",
    title: "Modules",
    level: "advanced",
    description: "Splitting code across multiple files, and sharing pieces between them deliberately.",
    explanation: `
A real application quickly grows beyond a single file. **Modules** let
you split code into separate files, each responsible for one thing, and
explicitly control what's shared between them using \`export\` (to make
something available to other files) and \`import\` (to bring it in).
    `.trim(),
    analogy:
      "Think of modules like separate departments in a company. Each department (file) does its own work internally, but only shares specific documents (exports) with other departments that specifically ask for them (imports) — nobody has to see everything happening everywhere.",
    examples: [
      {
        title: "Exporting and importing",
        code: `// math.js
export function add(a, b) {
  return a + b;
}
export const PI = 3.14159;

// app.js
import { add, PI } from "./math.js";

console.log(add(2, 3)); // 5
console.log(PI);        // 3.14159`,
        walkthrough: [
          { code: "export function add(a, b) {...}", explanation: "Makes the add function available to other files." },
          { code: "export const PI = 3.14159;", explanation: "Makes PI available too — a module can export multiple things." },
          { code: 'import { add, PI } from "./math.js";', explanation: "Brings both named exports into app.js." },
          { code: "add(2, 3);", explanation: "Uses the imported function exactly like a locally defined one." },
        ],
      },
      {
        title: "A default export",
        code: `// user.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}

// app.js
import User from "./user.js"; // any name works for a default import

const amara = new User("Amara");`,
        explanation:
          "A module can have at most one default export, and the importer is free to name it whatever they like — unlike named exports, which must be imported by their exact name.",
      },
    ],
    howItWorks: `
Each file is its own module with its own private scope — nothing inside
it is visible elsewhere unless explicitly exported. When a file imports
from another, JavaScript loads that module (once, even if imported from
many places), runs it, and hands over exactly the exported bindings that
were requested.
    `.trim(),
    whyItExists: `
Without modules, every file's code shares one giant global scope — names
collide, and there's no way to tell what depends on what just by looking
at a file. Modules give every file its own scope and make dependencies
explicit and traceable.
    `.trim(),
    whenToUse: `
Split code into modules as soon as a single file starts covering more
than one clear responsibility — a set of utility functions, a component,
a set of related constants. Import only the specific pieces a file
actually needs.
    `.trim(),
    whenNotToUse: `
For a truly tiny script, splitting into multiple files and modules can
add more overhead (import paths to manage) than it saves. And avoid
modules that import from each other in a circular way (A imports B,
which imports A) — it's a common source of confusing bugs.
    `.trim(),
    commonMistakes: [
      "Forgetting the file extension or path in an import in environments that require it.",
      "Exporting far more than a module actually needs to share, making its real public surface unclear.",
      "Creating circular imports between two modules that depend on each other.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Create a module that exports a `greet(name)` function, and import it into another file to use it." },
      { difficulty: "Medium", prompt: "Create a module with both a default export and a couple of named exports, and import all of them correctly." },
      { difficulty: "Hard", prompt: "Split a small script's logic into three modules with clear, single responsibilities, importing only what each one needs." },
    ],
    interviewQuestions: [
      { question: "What's the difference between a named export and a default export?", answer: "A module can have many named exports (imported with exact names in `{}`) but only one default export (imported under any name you choose)." },
      { question: "Why are modules better than one giant global script?", answer: "They keep variables scoped to their own file by default, and make what's shared between files explicit and traceable through imports." },
      { question: "What is a circular dependency?", answer: "When two modules import from each other, directly or indirectly, which can cause one of them to receive an incomplete, partially-loaded version of the other." },
    ],
    prerequisites: ["functions"],
    relatedTopics: ["scope"],
    keywords: ["import", "export", "module", "default export", "named export"],
  },
  {
    id: "memory-management",
    title: "Memory Management",
    level: "advanced",
    description: "How JavaScript decides when a piece of data is no longer needed and can be cleaned up.",
    explanation: `
Every variable, object, and function your program creates takes up a
little bit of memory. If nothing ever cleaned that memory up, a
long-running program would eventually use more and more memory until it
crashed. JavaScript handles this automatically using a process called
**garbage collection**: it periodically looks for data that nothing in
your program can reach anymore, and frees that memory.
    `.trim(),
    analogy:
      "Think of memory like a warehouse, and garbage collection like a janitor who periodically checks for boxes with no one holding the claim ticket anymore — if nobody can reach a box, it's safe to throw out and reuse the space.",
    examples: [
      {
        title: "Reachability determines what stays in memory",
        code: `let user = { name: "Amara" };
// user is reachable — the object stays in memory

user = null;
// nothing references the { name: "Amara" } object anymore
// it becomes eligible for garbage collection`,
        walkthrough: [
          { code: 'let user = { name: "Amara" };', explanation: "Creates an object and stores a reference to it in user." },
          { code: "// user is reachable", explanation: "As long as some variable can reach it, JavaScript keeps it in memory." },
          { code: "user = null;", explanation: "Removes the only reference to that object." },
          { code: "// eligible for garbage collection", explanation: "With nothing left pointing to it, the object can be safely cleaned up." },
        ],
      },
      {
        title: "A common leak: a forgotten timer",
        code: `function startPolling(element) {
  const id = setInterval(() => {
    element.textContent = new Date().toLocaleTimeString();
  }, 1000);

  return () => clearInterval(id); // caller must call this to stop it
}

const stopPolling = startPolling(document.querySelector("#clock"));
// ...later, when the clock is no longer needed:
stopPolling();`,
        explanation:
          "As long as `setInterval` keeps running, its callback (and everything it closes over, including `element`) stays reachable — forgetting to call `clearInterval` is one of the most common real-world memory leaks.",
      },
    ],
    howItWorks: `
JavaScript's garbage collector uses a strategy called "mark and sweep":
starting from things it knows are always reachable (like global
variables and anything currently running), it walks through every
reference it can find, marking each reachable object. Anything left
unmarked afterward — unreachable from anywhere your code could still get
to — gets swept away and its memory reused.
    `.trim(),
    whyItExists: `
Manually tracking and freeing memory (as some other languages require)
is tedious and a common source of serious bugs — using memory after it's
freed, or forgetting to free it at all. Automatic garbage collection
removes that entire category of mistakes from everyday JavaScript code.
    `.trim(),
    whenToUse: `
You don't manually trigger garbage collection — it's automatic. Where
this becomes actively relevant is when you're deliberately clearing
references to large objects you no longer need (setting a variable to
\`null\`), or diagnosing a "memory leak" where memory usage keeps climbing
over time.
    `.trim(),
    whenNotToUse: `
Don't obsessively null out every local variable "just in case" — local
variables are automatically freed once a function returns and nothing
else references them. Focus on real leaks: forgotten event listeners,
timers that are never cleared, and references held in long-lived caches
or closures.
    `.trim(),
    commonMistakes: [
      "Leaving event listeners or timers (`setInterval`) running on elements/objects that are otherwise done being used, keeping them reachable forever.",
      "Storing ever-growing data in a long-lived cache or array with no eviction, slowly consuming more and more memory.",
      "Assuming JavaScript frees memory the instant a variable goes out of scope — garbage collection runs periodically, not necessarily immediately.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain, in your own words, why setting a variable to `null` can help release memory." },
      { difficulty: "Medium", prompt: "Describe a scenario where a forgotten `setInterval` could cause a memory leak, and how you'd fix it." },
      { difficulty: "Hard", prompt: "Explain why a closure that captures a large object can unintentionally keep that object in memory long after it's needed." },
    ],
    interviewQuestions: [
      { question: "What is garbage collection?", answer: "The automatic process JavaScript uses to find and free memory used by objects that are no longer reachable by the program." },
      { question: "What makes an object eligible for garbage collection?", answer: "Nothing in the program can reach it anymore — no variable, closure, or reachable structure still holds a reference to it." },
      { question: "What is a memory leak in JavaScript, given it has garbage collection?", answer: "Memory that's technically still reachable (so it won't be collected) but is no longer actually needed — commonly caused by forgotten timers, event listeners, or ever-growing caches." },
    ],
    prerequisites: ["closures"],
    relatedTopics: ["closures", "event-loop"],
    keywords: ["garbage collection", "memory leak", "reachability", "mark and sweep"],
  },
  {
    id: "optional-chaining",
    title: "Optional Chaining & Nullish Coalescing",
    level: "advanced",
    description: "Safely reading deeply nested properties, and providing defaults, without a pile of manual checks.",
    explanation: `
Reading a property that's nested a few levels deep — \`user.address.city\`
— crashes the whole program if \`user\` or \`address\` happens to be
missing. Before modern JavaScript, safely handling that meant a chain of
manual checks: \`if (user && user.address && user.address.city)\`.
**Optional chaining** (\`?.\`) does this automatically: it stops and
returns \`undefined\` the moment it hits something missing, instead of
throwing an error.

Its common partner, **nullish coalescing** (\`??\`), lets you supply a
default value specifically for when something is \`null\` or \`undefined\` —
without accidentally overriding valid values like \`0\` or \`""\` the way
\`||\` would.
    `.trim(),
    analogy:
      "Optional chaining is like carefully checking each door is unlocked before walking through it, instead of just barreling into a locked door and getting hurt. Nullish coalescing is a backup plan — 'if there's truly nothing here, use this instead' — that's careful not to override an answer you deliberately gave, like zero.",
    examples: [
      {
        title: "Optional chaining and nullish coalescing together",
        code: `const user = { name: "Amara", address: null };

console.log(user.address.city);   // ❌ throws: Cannot read properties of null
console.log(user.address?.city);  // undefined — no crash

const city = user.address?.city ?? "Unknown city";
console.log(city); // "Unknown city"

const count = 0;
console.log(count || 10); // 10 — wrong! 0 is falsy, so || replaces it
console.log(count ?? 10); // 0 — right! ?? only replaces null/undefined`,
        walkthrough: [
          { code: "user.address?.city", explanation: "Checks if user.address exists before trying to read .city; since it's null, the expression short-circuits to undefined." },
          { code: 'user.address?.city ?? "Unknown city";', explanation: "If the left side is null or undefined, falls back to the right side." },
          { code: "count || 10", explanation: "Replaces count with 10 because 0 is falsy — often not what you want." },
          { code: "count ?? 10", explanation: "Keeps 0, because ?? only falls back on null or undefined, not on every falsy value." },
        ],
      },
      {
        title: "Optional chaining with function calls and arrays",
        code: `const api = {
  getUser: null, // maybe not loaded yet
};

api.getUser?.(1);      // undefined — skipped, doesn't throw

const users = null;
console.log(users?.[0]); // undefined — safe even though users isn't an object at all`,
        explanation:
          "`?.()` guards a function call that might not exist, and `?.[...]` guards array/bracket access the same way `?.` guards a plain property.",
      },
    ],
    howItWorks: `
\`?.\` checks whether the value immediately to its left is \`null\` or
\`undefined\` before continuing; if so, the entire chain short-circuits and
evaluates to \`undefined\` without attempting the rest. \`??\` checks only
its left-hand side: if it's \`null\` or \`undefined\`, it evaluates to the
right-hand side; otherwise, it keeps the left-hand value — even if that
value is \`0\`, \`""\`, or \`false\`.
    `.trim(),
    whyItExists: `
Deeply nested, possibly-missing data (like optional fields from an API)
used to require long chains of manual \`&&\` checks just to avoid
crashing. These two operators cover that extremely common need directly,
making the code both safer and shorter.
    `.trim(),
    whenToUse: `
Use \`?.\` whenever you're reading a property that might not exist at some
level — optional API fields, optional configuration, DOM elements that
might not be present. Use \`??\` whenever you want a default specifically
for missing values, and your valid values might include falsy-but-real
ones like \`0\` or \`""\`.
    `.trim(),
    whenNotToUse: `
Don't sprinkle \`?.\` everywhere defensively on data you actually know is
always present — it can silently hide a bug that should have thrown an
error and alerted you to a real problem. And use \`||\` instead of \`??\`
when you genuinely want to replace any falsy value, not just
null/undefined.
    `.trim(),
    commonMistakes: [
      "Using `?.` so liberally that a genuinely broken/missing value is silently swallowed as `undefined` instead of surfacing a helpful error.",
      "Using `||` for defaults when `0`, `\"\"`, or `false` are valid values you don't want replaced — `??` is usually the safer choice.",
      "Forgetting that `?.` only guards against `null`/`undefined`, not against other unexpected types.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Use optional chaining to safely read `user.profile.bio` when `profile` might be missing." },
      { difficulty: "Medium", prompt: "Use `??` to provide a default page size of 10 when a `pageSize` variable might be `0`, `null`, or `undefined` — and explain why `||` would behave differently." },
      { difficulty: "Hard", prompt: "Rewrite a function that used several `&&` checks to safely access nested data, using optional chaining and nullish coalescing instead." },
    ],
    interviewQuestions: [
      { question: "What does `?.` do?", answer: "It safely accesses a property, only continuing if the value to its left isn't null or undefined, otherwise short-circuiting to undefined instead of throwing." },
      { question: "How is `??` different from `||`?", answer: "`??` only falls back when the left side is null or undefined; `||` falls back for any falsy value, including 0, \"\", and false." },
      { question: "Can you call a function with optional chaining?", answer: "Yes — `obj.method?.()` calls method only if it exists, otherwise evaluates to undefined." },
    ],
    prerequisites: ["objects", "operators"],
    relatedTopics: ["objects", "operators"],
    keywords: ["optional chaining", "nullish coalescing", "?.", "??"],
  },
  {
    id: "json",
    title: "JSON",
    level: "advanced",
    description: "A simple, text-based format for representing data, used constantly to send information between programs.",
    explanation: `
When two different programs need to share data — a browser and a
server, for example — they need a shared, text-based way to represent
it, since raw JavaScript objects only exist inside a running JavaScript
program. **JSON** (JavaScript Object Notation) is that shared format:
plain text that looks a lot like a JavaScript object or array, that
virtually every programming language knows how to read and write.
    `.trim(),
    analogy:
      "JSON is like a universally understood recipe card format. Any chef (any programming language) can read a recipe written in that standard format, even if their own kitchen (their own language) is completely different from the one that wrote it.",
    examples: [
      {
        title: "Converting between objects and JSON text",
        code: `const user = { name: "Amara", age: 28 };

const json = JSON.stringify(user);
console.log(json); // '{"name":"Amara","age":28}' — now just text

const parsed = JSON.parse(json);
console.log(parsed.name); // "Amara" — back to a real object`,
        walkthrough: [
          { code: 'const user = { name: "Amara", age: 28 };', explanation: "A regular JavaScript object, only usable inside this program." },
          { code: "JSON.stringify(user);", explanation: "Converts it into a plain text string in JSON format." },
          { code: "console.log(json);", explanation: "That text can now be sent over a network or saved to a file." },
          { code: "JSON.parse(json);", explanation: "Converts JSON text back into a real JavaScript object." },
        ],
      },
      {
        title: "Saving and restoring data with localStorage",
        code: `const settings = { theme: "dark", fontSize: 16 };

localStorage.setItem("settings", JSON.stringify(settings));

// ...later, maybe after a page reload:
const saved = JSON.parse(localStorage.getItem("settings"));
console.log(saved.theme); // "dark"`,
        explanation:
          "`localStorage` can only store strings, so JSON is the standard way to save a structured object into it and read a real object back out later.",
      },
    ],
    howItWorks: `
\`JSON.stringify\` walks through an object or array and produces a text
representation following JSON's strict rules (double-quoted keys, no
functions, no \`undefined\`). \`JSON.parse\` does the reverse: it reads that
text and reconstructs the equivalent JavaScript value. Both are pure
text transformations — nothing about JSON itself is JavaScript-specific,
even though its syntax was inspired by JavaScript object literals.
    `.trim(),
    whyItExists: `
Before JSON became standard, exchanging structured data between
different systems (especially over the web) often meant using more
verbose formats like XML, or inventing custom ones. JSON's simplicity
and close resemblance to JavaScript objects made it the dominant format
for APIs and configuration.
    `.trim(),
    whenToUse: `
Use JSON whenever you need to send structured data between a client and
a server (most API responses are JSON), save structured data to a file
or localStorage, or pass data between programs written in different
languages.
    `.trim(),
    whenNotToUse: `
JSON can't represent everything a JavaScript value can — functions,
\`undefined\`, and circular references are all silently dropped or cause
an error. For data that needs those things, or that's extremely large
and performance-sensitive, other formats or approaches might fit better.
    `.trim(),
    commonMistakes: [
      "Trying to `JSON.stringify` an object containing functions or `undefined` values and being surprised they're silently dropped.",
      "Forgetting that `JSON.parse` throws an error on invalid JSON text, and not wrapping it in a try/catch when the input isn't guaranteed to be valid.",
      "Assuming JSON supports comments or trailing commas — it doesn't; it's stricter than a plain JavaScript object literal.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Convert a small object to a JSON string with `JSON.stringify`, then back with `JSON.parse`, and confirm the values match." },
      { difficulty: "Medium", prompt: "Store an object in `localStorage` as a JSON string, then read and parse it back on page load." },
      { difficulty: "Hard", prompt: "Write a function that safely parses possibly-invalid JSON text, returning `null` instead of throwing if it's malformed." },
    ],
    interviewQuestions: [
      { question: "What does `JSON.stringify` do?", answer: "Converts a JavaScript value into a JSON-formatted text string." },
      { question: "What happens to functions and `undefined` values when you stringify an object containing them?", answer: "They're omitted entirely from the resulting JSON string — JSON has no way to represent them." },
      { question: "Why is JSON so commonly used for APIs?", answer: "It's simple, lightweight, human-readable, and supported natively or via libraries in virtually every programming language." },
    ],
    prerequisites: ["objects", "arrays"],
    relatedTopics: ["objects", "arrays"],
    keywords: ["JSON", "stringify", "parse", "serialization"],
  },
  {
    id: "map-and-set",
    title: "Map and Set",
    level: "advanced",
    description: "Two built-in collections — Map for key-value pairs, Set for unique values — that improve on what plain objects and arrays can do.",
    explanation: `
You've already used plain objects as key-value stores, and arrays as
ordered lists. **Map** and **Set** are more specialized built-in
collections that fix a few rough edges: a \`Map\` lets you use any value
(not just strings) as a key and keeps track of its own size; a \`Set\`
stores a collection of values with no duplicates allowed, automatically.
    `.trim(),
    analogy:
      "A Map is like a proper dictionary with tabs for any kind of entry — not just word-shaped ones. A Set is like a guest list where the bouncer automatically refuses to add the same name twice, no matter how many times you try.",
    examples: [
      {
        title: "Map and Set basics",
        code: `const scores = new Map();
scores.set("amara", 90);
scores.set("diego", 85);

console.log(scores.get("amara")); // 90
console.log(scores.size);         // 2

const uniqueNumbers = new Set([1, 2, 2, 3, 3, 3]);
console.log(uniqueNumbers.size);   // 3
console.log(uniqueNumbers.has(2)); // true`,
        walkthrough: [
          { code: "const scores = new Map();", explanation: "Creates an empty Map." },
          { code: 'scores.set("amara", 90);', explanation: "Stores a key-value pair; unlike an object, the key could be any type, not just a string." },
          { code: 'scores.get("amara");', explanation: "Reads back the value for that key." },
          { code: "scores.size", explanation: "A real property that always reflects the current number of entries." },
          { code: "new Set([1, 2, 2, 3, 3, 3]);", explanation: "Automatically drops duplicate values, keeping each unique value only once." },
        ],
      },
      {
        title: "Removing duplicates from an array with Set",
        code: `const numbers = [1, 2, 2, 3, 1, 4];

const unique = [...new Set(numbers)];
console.log(unique); // [1, 2, 3, 4]`,
        explanation:
          "Spreading a Set back into an array is a common one-line pattern for deduplicating an array while preserving the first occurrence of each value.",
      },
    ],
    howItWorks: `
A \`Map\` stores entries in insertion order and, internally, uses the same
kind of fast key-based lookup a hash table does — but without a plain
object's quirks (string-coerced keys, inherited properties getting in
the way). A \`Set\` is really just a \`Map\` that only cares about the
keys — adding a value that's already present is simply a no-op.
    `.trim(),
    whyItExists: `
Plain objects were never really designed to be general-purpose maps —
keys are always converted to strings, there's no built-in size, and
inherited properties can sneak in unexpectedly. Map and Set exist
specifically to be clean, purpose-built collections without that
historical baggage.
    `.trim(),
    whenToUse: `
Reach for a \`Map\` when your keys aren't simple strings, when you need a
reliable \`.size\`, or when insertion order matters and must be preserved.
Reach for a \`Set\` whenever you need a collection of values with
automatic deduplication — removing duplicates from an array, or tracking
a group of unique items.
    `.trim(),
    whenNotToUse: `
For a simple, small collection of string keys — especially one that's
going to be serialized with \`JSON.stringify\` (which doesn't support
Map/Set directly) — a plain object or array is often simpler and more
familiar.
    `.trim(),
    commonMistakes: [
      "Trying to `JSON.stringify` a Map or Set directly and being surprised it doesn't serialize the way a plain object or array does.",
      "Using `.length` on a Map or Set instead of the correct property, `.size`.",
      "Forgetting that Set only removes duplicate values — it doesn't otherwise change the order or type of the data.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Use a `Set` to remove duplicate values from an array of numbers." },
      { difficulty: "Medium", prompt: "Use a `Map` to count how many times each word appears in a sentence, and log the results." },
      { difficulty: "Hard", prompt: "Write a function that returns the intersection (common values) of two arrays, using Sets." },
    ],
    interviewQuestions: [
      { question: "What's the main advantage of Map over a plain object for key-value storage?", answer: "Map allows any value as a key (not just strings), maintains a reliable `.size`, and doesn't risk inherited properties interfering with lookups." },
      { question: "How does Set handle duplicate values?", answer: "It silently ignores an attempt to add a value that's already present — a Set can only ever contain unique values." },
      { question: "Can you iterate over a Map in insertion order?", answer: "Yes — Maps (and Sets) always iterate in the order entries were inserted." },
    ],
    prerequisites: ["objects"],
    relatedTopics: ["objects", "arrays"],
    keywords: ["Map", "Set", "size", "unique values", "key-value"],
  },
];
