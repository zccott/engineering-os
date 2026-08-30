import type { Topic } from "../../types/content";

export const javascriptBeginnerTopics: Topic[] = [
  {
    id: "what-is-javascript",
    title: "What is JavaScript?",
    level: "beginner",
    description:
      "The programming language that makes websites interactive.",
    explanation: `
A website starts as plain text and images — that's what HTML and CSS give you.
But nothing on the page can *react* to you. Nothing changes when you click a
button, type in a form, or scroll down.

JavaScript is the piece that adds that behavior. It's a programming language
that runs inside your web browser and lets a page respond to what you do:
show a menu, validate a form, update a price, load new content without
reloading the page.

It also runs outside the browser now — on servers (using Node.js), in mobile
apps, and even on some hardware. But it started, and is still mostly known,
as "the language of the web."
    `.trim(),
    analogy:
      "If HTML is the skeleton of a page and CSS is its clothing, JavaScript is the muscles — it's what makes things actually move.",
    examples: [
      {
        title: "A tiny piece of JavaScript",
        code: `alert("Hello! This popped up because of JavaScript.");`,
        explanation:
          "This one line, placed in a webpage, would show a popup box. Nothing complicated — just an instruction the browser understands and runs.",
        walkthrough: [
          { code: "alert(...)", explanation: "Calls a function built into every browser that shows a small popup box on screen." },
          { code: '"Hello! This popped up..."', explanation: "The text inside the quotes is exactly what appears in that popup." },
          { code: ";", explanation: "The semicolon marks the end of this instruction, the same way a period ends a sentence." },
        ],
      },
      {
        title: "Reacting to a click",
        code: `const button = document.querySelector("button");

button.addEventListener("click", () => {
  alert("You clicked the button!");
});`,
        explanation:
          "This is closer to what JavaScript is actually used for day to day: finding a piece of the page, then telling it what to do when the user interacts with it.",
      },
    ],
    howItWorks: `
Every browser (Chrome, Firefox, Safari, Edge) has a built-in program called a
JavaScript engine. When a webpage loads, the browser reads any JavaScript
code on the page and hands it to this engine, which runs it line by line.
    `.trim(),
    diagram: `
Browser loads page
       ↓
Finds JavaScript code
       ↓
Hands it to the JS engine
       ↓
Engine runs the instructions
       ↓
Page updates / responds
    `.trim(),
    whyItExists: `
Early websites were static — you could read them, but not interact with
them. JavaScript was created to let pages respond to the user directly, in
the browser, without needing to ask a server and reload the whole page for
every small change.
    `.trim(),
    whenToUse: `
Reach for JavaScript when you're building something that needs to run in a
web browser and react to the user right away — validating a form as someone
types, updating a page without reloading it, or building an entire
single-page app. It's also a reasonable choice for the server side (via
Node.js) if you'd rather use one language for both the client and the
server.
    `.trim(),
    whenNotToUse: `
If you're building something CPU-heavy — video processing, machine
learning, low-level system code — JavaScript usually isn't the first
choice; languages built for that kind of raw performance (C++, Rust, Go)
fit better. And a purely informational page with no interactivity at all
may not need JavaScript beyond a tiny script, if any.
    `.trim(),
    commonMistakes: [
      "Thinking JavaScript and Java are related — they only share part of a name.",
      "Assuming JavaScript can only run in a browser. It can also run on servers, in tools, and in scripts.",
      "Expecting code changes to show up without saving the file or refreshing the page.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Open your browser's developer console and run: console.log(\"Hello, JavaScript\")." },
      { difficulty: "Medium", prompt: "Use alert() to show a popup, and console.log() to print a message, and explain the difference you notice." },
      { difficulty: "Hard", prompt: "Find one real website feature (autocomplete, a dropdown, a live counter) and describe, in your own words, why it needs JavaScript to work." },
    ],
    interviewQuestions: [
      {
        question: "What is JavaScript used for?",
        answer:
          "Making web pages interactive in the browser, and — via Node.js — building servers, tools, and scripts outside the browser too.",
      },
      {
        question: "Is JavaScript the same as Java?",
        answer:
          "No. They are different languages with different creators, syntax, and use cases. The similar name was originally a marketing decision.",
      },
      {
        question: "Where does JavaScript code run?",
        answer:
          "Primarily inside a browser's JavaScript engine, but also on servers via Node.js, and in various other runtimes.",
      },
    ],
    relatedTopics: ["variables", "functions"],
    keywords: ["javascript", "intro", "browser", "engine", "history"],
  },
  {
    id: "variables",
    title: "Variables",
    level: "beginner",
    description: "A named container for storing a value your program can reuse.",
    explanation: `
Programs need to remember things — a username, a score, an item price. A
variable is simply a name you give to a piece of information so you can use
it again later, without retyping the value every time.

In JavaScript, you create a variable with \`let\` or \`const\`:

- Use **let** when the value might change later.
- Use **const** when the value should stay the same after it's set.

There's also an older keyword, \`var\`, but modern JavaScript mostly avoids it
in favor of \`let\` and \`const\`, which behave more predictably.
    `.trim(),
    analogy:
      "A variable is like a labeled jar. You write a label on it (the variable name) and put something inside (the value). Later, you just read the label to find what's inside.",
    examples: [
      {
        title: "Declaring variables",
        code: `let score = 0;
score = score + 10; // score is now 10

const username = "amara";
// username = "someone-else"; // ❌ this would cause an error`,
        explanation:
          "`score` can change because it's declared with `let`. `username` cannot be reassigned because it's declared with `const`.",
        walkthrough: [
          { code: "let score = 0;", explanation: "Creates a variable named score, starting at 0, that's allowed to change later." },
          { code: "score = score + 10;", explanation: "Reads the current value of score, adds 10, and stores the result back in score." },
          { code: 'const username = "amara";', explanation: "Creates a variable that cannot be reassigned after this line." },
          { code: "// username = ...", explanation: "Commented out — uncommenting it would throw an error, since const variables can't be reassigned." },
        ],
      },
      {
        title: "Using a variable to avoid repeating a value",
        code: `const taxRate = 0.08;

const price1 = 20;
const total1 = price1 + price1 * taxRate;

const price2 = 45;
const total2 = price2 + price2 * taxRate;`,
        explanation:
          "`taxRate` is defined once and reused in both calculations — if the tax rate ever changes, there's exactly one place to update it.",
      },
    ],
    howItWorks: `
When JavaScript sees \`let score = 0\`, it sets aside a small space in memory,
labels that space "score", and stores the value 0 there. Whenever your code
uses the word \`score\` afterward, JavaScript looks up that labeled space and
uses whatever value currently lives there.
    `.trim(),
    whyItExists: `
Without variables, you'd have to write the same literal values everywhere,
and you'd have no way to store something that changes while the program
runs — like a running total or the current user's name.
    `.trim(),
    whenToUse: `
Use a variable any time you need to store a value so you can use it again
later — a running total, a piece of user input, a flag that tracks whether
something happened. Reach for \`const\` by default, and switch to \`let\` only
once you know the value genuinely needs to change.
    `.trim(),
    whenNotToUse: `
You don't need a variable for a value you use exactly once and never refer
to again — sometimes it's clearer to just write the value directly where
it's needed. And avoid \`var\` in new code: there's no situation in modern
JavaScript where \`var\` behaves better than \`let\`/\`const\`.
    `.trim(),
    commonMistakes: [
      "Trying to reassign a `const` variable — it will throw an error.",
      "Using a variable before declaring it.",
      "Picking unclear names like `x` or `data1` instead of descriptive ones like `cartTotal`.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Declare a `const` variable called `age` and log it to the console." },
      { difficulty: "Medium", prompt: "Declare a `let` variable called `count`, then write code that increases it by 1 three times." },
      { difficulty: "Hard", prompt: "Write a small script that stores a product's `price` and `quantity` in variables and logs the total cost." },
    ],
    interviewQuestions: [
      { question: "What's the difference between `let` and `const`?", answer: "`let` allows the variable to be reassigned later; `const` does not allow reassignment after it's first set." },
      { question: "Why avoid `var` in modern code?", answer: "`var` has confusing scoping rules (it ignores block scope) that can lead to subtle bugs. `let` and `const` are scoped to the block they're declared in." },
      { question: "Can a `const` object's properties change?", answer: "Yes — `const` only prevents reassigning the variable itself, not mutating the contents of an object or array it points to." },
    ],
    prerequisites: ["what-is-javascript"],
    relatedTopics: ["data-types", "scope"],
    keywords: ["let", "const", "var", "declaration"],
  },
  {
    id: "data-types",
    title: "Data Types",
    level: "beginner",
    description: "The different kinds of values JavaScript can store and work with.",
    explanation: `
Not all values are the same kind of thing. The number 5, the word "hello",
and a true/false answer all behave differently. JavaScript groups values
into a small set of **data types** so it knows how to handle each one.

The most common ones you'll use constantly:

- **String** — text, written in quotes: \`"hello"\`
- **Number** — any number: \`42\`, \`3.14\`
- **Boolean** — true or false: \`true\`, \`false\`
- **Undefined** — a variable that has been declared but has no value yet
- **Null** — a value that's intentionally empty
- **Object** — a collection of related data (including arrays and functions)
    `.trim(),
    analogy:
      "Think of a toolbox with different compartments — one for screws, one for nails, one for tape. Data types are those compartments; they tell you what kind of thing you're holding so you know what you can do with it.",
    examples: [
      {
        title: "Checking a value's type",
        code: `console.log(typeof "hello");   // "string"
console.log(typeof 42);        // "number"
console.log(typeof true);      // "boolean"
console.log(typeof undefined); // "undefined"`,
        explanation: "`typeof` is a built-in operator that tells you the data type of any value.",
        walkthrough: [
          { code: 'typeof "hello"', explanation: '"hello" is text, so typeof reports "string".' },
          { code: "typeof 42", explanation: '42 is a number, so typeof reports "number".' },
          { code: "typeof true", explanation: 'true/false values report "boolean".' },
          { code: "typeof undefined", explanation: 'A variable with no value yet reports "undefined".' },
        ],
      },
      {
        title: "The same operator, different types, different behavior",
        code: `console.log(2 + 3);       // 5   — both numbers, so + adds them
console.log("2" + "3");   // "23" — both strings, so + joins them
console.log("2" + 3);     // "23" — mixed, so the number becomes a string first`,
        explanation:
          "The `+` operator behaves differently depending on the types of its two values — this is exactly why knowing a value's type matters.",
      },
    ],
    howItWorks: `
When JavaScript stores a value, it tags it internally with a type. This tag
determines which operations are allowed — you can do math on numbers, but
adding two strings joins them together instead ("2" + "3" becomes "23", not
5). Knowing the type of a value tells you how it will behave.
    `.trim(),
    whyItExists: `
Different kinds of data need different rules. Text needs to be joined and
searched; numbers need to be added and compared; true/false values need to
drive decisions. Types let the language apply the right rules automatically.
    `.trim(),
    whenToUse: `
You actively think about data types whenever you're not sure what kind of
value you're dealing with — checking user input, debugging an unexpected
result, or deciding whether two values can be safely compared or combined.
\`typeof\` is the quick way to check.
    `.trim(),
    whenNotToUse: `
You don't need to manually check the type of a value you created yourself
and already know the shape of — sprinkling \`typeof\` checks everywhere just
adds noise. Save type-checking for boundaries: user input, API responses,
and function arguments coming from code you don't control.
    `.trim(),
    commonMistakes: [
      "Mixing up a number and a string that looks like a number, e.g. `\"5\" + 1` gives `\"51\"`, not `6`.",
      "Confusing `undefined` (nothing assigned yet) with `null` (intentionally empty).",
      "Forgetting that arrays and functions are technically objects too.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Use `typeof` to check the type of a string, a number, and a boolean." },
      { difficulty: "Medium", prompt: "Predict the output of `\"3\" + 3` and `3 + 3`, then check by running it." },
      { difficulty: "Hard", prompt: "Write a function `describeType(value)` that returns a friendly sentence describing the value's type." },
    ],
    interviewQuestions: [
      { question: "What are JavaScript's primitive data types?", answer: "String, Number, Boolean, Undefined, Null, Symbol, and BigInt. Everything else (objects, arrays, functions) is an object." },
      { question: "What's the difference between `null` and `undefined`?", answer: "`undefined` means a variable hasn't been given a value yet. `null` is a value a developer sets deliberately to represent 'nothing here'." },
      { question: "What does `typeof null` return, and why is that surprising?", answer: "It returns `\"object\"`, which is a long-standing quirk/bug in JavaScript kept for backward compatibility." },
    ],
    prerequisites: ["variables"],
    relatedTopics: ["variables", "operators", "js-gotchas"],
    keywords: ["types", "string", "number", "boolean", "typeof"],
  },
  {
    id: "operators",
    title: "Operators",
    level: "beginner",
    description: "Symbols that perform actions on values, like math or comparisons.",
    explanation: `
You constantly need to do things with values — add two numbers together,
check which of two is bigger, or combine two conditions into one decision.
JavaScript gives you a set of symbols, called **operators**, that do exactly
that: each one takes one or more values and produces a result.

A few groups you'll use daily:

- **Arithmetic**: \`+ - * / %\` for math
- **Comparison**: \`=== !== > < >= <=\` for comparing two values
- **Logical**: \`&& || !\` for combining true/false conditions
- **Assignment**: \`= += -=\` for storing or updating a value
    `.trim(),
    analogy:
      "Operators are like the buttons on a calculator — each one takes the numbers you've entered and does a specific, predictable action with them.",
    examples: [
      {
        title: "Arithmetic and comparison",
        code: `const total = 10 + 5;      // 15
const isEqual = 10 === 10; // true
const isBigger = 10 > 20;  // false`,
        walkthrough: [
          { code: "const total = 10 + 5;", explanation: "Adds 10 and 5, storing 15 in total." },
          { code: "const isEqual = 10 === 10;", explanation: "Compares 10 to 10 with strict equality, storing true." },
          { code: "const isBigger = 10 > 20;", explanation: "Checks whether 10 is greater than 20, storing false." },
        ],
      },
      {
        title: "Logical operators combining conditions",
        code: `const age = 20;
const hasTicket = true;

const canEnter = age >= 18 && hasTicket;
console.log(canEnter); // true

const skipLine = age < 12 || age > 65;
console.log(skipLine); // false`,
        explanation:
          "`&&` requires both sides to be true; `||` only needs one side to be true. Both are common ways to combine multiple conditions into one decision.",
      },
    ],
    howItWorks: `
Each operator takes one or two values (called operands) and produces a
result. \`+\` takes two numbers and produces their sum. \`===\` takes two values
and produces a boolean — true if they match exactly, false otherwise.
    `.trim(),
    whyItExists: `
Programs constantly need to calculate, compare, and combine values to make
decisions. Operators are the basic building blocks for all of that logic.
    `.trim(),
    whenToUse: `
Use arithmetic operators whenever your code needs to calculate something,
and comparison operators whenever it needs to make a decision. Logical
operators (\`&&\`, \`||\`) come in whenever that decision depends on more than
one condition at once.
    `.trim(),
    whenNotToUse: `
Avoid \`==\` in new code — its type-converting comparisons cause more bugs
than they prevent; \`===\` should be your default. And don't chain more
logical operators into one expression than a reader can parse at a glance —
split a complex condition into a well-named variable instead.
    `.trim(),
    commonMistakes: [
      "Using `=` (assignment) when you meant `===` (comparison).",
      "Using `==` instead of `===` — `==` converts types before comparing, which can cause surprising results like `\"5\" == 5` being `true`.",
      "Forgetting operator precedence, e.g. assuming `2 + 3 * 4` equals `20` instead of `14`.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write an expression that adds two numbers and multiplies the result by 2." },
      { difficulty: "Medium", prompt: "Use `===` to compare two values of different types and explain the result." },
      { difficulty: "Hard", prompt: "Write a one-line expression using `&&` and `||` that checks if a user is either an admin or (a member and over 18)." },
    ],
    interviewQuestions: [
      { question: "What's the difference between `==` and `===`?", answer: "`==` compares values after converting types if needed (\"loose equality\"); `===` compares both value and type without converting (\"strict equality\"). `===` is almost always the safer choice." },
      { question: "What does the `%` operator do?", answer: "It returns the remainder of a division — often used to check divisibility, like testing if a number is even." },
      { question: "What is short-circuit evaluation?", answer: "With `&&` and `||`, JavaScript stops evaluating as soon as the result is known — e.g. in `a || b`, if `a` is truthy, `b` is never evaluated." },
    ],
    prerequisites: ["data-types"],
    relatedTopics: ["data-types", "conditions"],
    keywords: ["arithmetic", "comparison", "logical", "equality"],
  },
  {
    id: "conditions",
    title: "Conditions",
    level: "beginner",
    description: "Making your code choose between different paths based on a test.",
    explanation: `
Most real programs need to make decisions: "if the user is logged in, show
their name; otherwise, show a login button." Conditions are how you write
that decision in code.

The main tool is the \`if\` statement — it runs a block of code only when a
test is true, and can offer alternatives with \`else if\` and \`else\`.
    `.trim(),
    analogy:
      "It's like a fork in a road with a sign: 'If it's raining, take the covered path. Otherwise, take the shortcut.' Your code reads the sign and picks a path.",
    examples: [
      {
        title: "if / else if / else",
        code: `const hour = 14;

if (hour < 12) {
  console.log("Good morning");
} else if (hour < 18) {
  console.log("Good afternoon");
} else {
  console.log("Good evening");
}
// logs: "Good afternoon"`,
        walkthrough: [
          { code: "const hour = 14;", explanation: "Stores the current hour." },
          { code: "if (hour < 12)", explanation: "Checks whether it's before noon — it isn't, so this block is skipped." },
          { code: "} else if (hour < 18) {", explanation: "Only checked because the first condition was false; checks whether it's before 6pm — it is, so this block runs." },
          { code: "} else {", explanation: "Would run only if neither condition above matched." },
        ],
      },
      {
        title: "A ternary expression for a simple either/or",
        code: `const age = 20;

const message = age >= 18 ? "You can vote" : "You can't vote yet";
console.log(message); // "You can vote"`,
        explanation:
          "For a simple choice between two values, a ternary (`condition ? ifTrue : ifFalse`) is a compact one-line alternative to a full if/else.",
      },
    ],
    howItWorks: `
JavaScript checks the condition inside the parentheses. If it evaluates to
a **truthy** value — basically, anything except \`false\`, \`0\`, \`""\`, \`null\`,
\`undefined\`, or \`NaN\` (those are the "falsy" values) — it runs that block and
skips the rest. Otherwise, it moves to the next \`else if\` and repeats the
check, finally falling into \`else\` if nothing else matched.
    `.trim(),
    diagram: `
Check condition
       ↓
 true?  ──yes──▶ run this block ──▶ done
   │
   no
   ↓
check next condition (repeat)
    `.trim(),
    whyItExists: `
A program that always does the exact same thing regardless of input isn't
very useful. Conditions let code adapt its behavior to the current data or
situation.
    `.trim(),
    whenToUse: `
Use conditions whenever your program's next step depends on data you don't
know in advance — a user's input, a value from an API, the current time.
Anytime you can describe your logic with the word "if," you're describing
a condition.
    `.trim(),
    whenNotToUse: `
If every branch of an \`if/else\` ends up doing almost the same thing, a
condition may be hiding a simpler solution — like a lookup object or a
default value — that avoids repeating yourself. And a \`switch\` (or a
lookup) usually reads better than five or more chained \`else if\` blocks
checking the same variable.
    `.trim(),
    commonMistakes: [
      "Forgetting the `else` and assuming a variable is always set inside the `if` block.",
      "Using `=` instead of `===` inside a condition by accident.",
      "Writing deeply nested if/else chains instead of simplifying the logic.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write an `if/else` that logs \"even\" or \"odd\" for a given number." },
      { difficulty: "Medium", prompt: "Write a grading function that returns a letter grade (A/B/C/D/F) from a numeric score using `if/else if`." },
      { difficulty: "Hard", prompt: "Rewrite a chain of 4 `else if` checks using a `switch` statement instead." },
    ],
    interviewQuestions: [
      { question: "What counts as a 'falsy' value in JavaScript?", answer: "`false`, `0`, `\"\"` (empty string), `null`, `undefined`, and `NaN`. Everything else is truthy." },
      { question: "When would you use `switch` instead of `if/else`?", answer: "When you're comparing one value against many specific possibilities — it can be more readable than a long `else if` chain." },
      { question: "What is a ternary operator?", answer: "A compact one-line conditional: `condition ? valueIfTrue : valueIfFalse`, useful for simple either/or expressions." },
    ],
    prerequisites: ["operators"],
    relatedTopics: ["operators", "loops"],
    keywords: ["if", "else", "switch", "ternary", "truthy", "falsy"],
  },
  {
    id: "loops",
    title: "Loops",
    level: "beginner",
    description: "Repeating an action multiple times without copy-pasting code.",
    explanation: `
Sometimes you need to do the same thing many times — print every item in a
list, check every user, count from 1 to 100. Writing that out by hand would
be tedious and error-prone. A **loop** repeats a block of code automatically,
either a fixed number of times or until a condition is no longer true.

The two you'll use most:

- **for** — when you know how many times to repeat (or you're going through a list)
- **while** — when you want to repeat until some condition becomes false
    `.trim(),
    analogy:
      "A loop is like giving someone instructions: 'Keep folding laundry until the basket is empty.' They don't need a new instruction for every item — just one instruction repeated.",
    examples: [
      {
        title: "A basic for loop",
        code: `for (let i = 1; i <= 5; i++) {
  console.log(i);
}
// logs 1, 2, 3, 4, 5`,
        explanation:
          "`i = 1` sets the start, `i <= 5` is the condition checked before each run, and `i++` increases `i` after each run.",
        walkthrough: [
          { code: "let i = 1", explanation: "Runs once, before the loop starts: creates a counter starting at 1." },
          { code: "i <= 5", explanation: "Checked before every pass — the loop keeps going as long as this is true." },
          { code: "console.log(i);", explanation: "The part that actually repeats — prints the current value of i." },
          { code: "i++", explanation: "Runs after every pass, increasing i by 1 before the condition is checked again." },
        ],
      },
      {
        title: "A while loop",
        code: `let count = 3;
while (count > 0) {
  console.log(count);
  count = count - 1;
}
// logs 3, 2, 1`,
      },
      {
        title: "A for...of loop — looping over an array directly",
        code: `const fruits = ["apple", "banana", "cherry"];

for (const fruit of fruits) {
  console.log(fruit);
}
// logs apple, banana, cherry`,
        explanation:
          "`for...of` loops directly over the values in an array (or any other iterable), so there's no counter to manage and no risk of an off-by-one error.",
      },
    ],
    howItWorks: `
Before each pass through the loop, JavaScript checks the condition. If it's
true, it runs the loop's body, then checks again. This repeats until the
condition becomes false, at which point the loop stops and the program
continues after it.
    `.trim(),
    diagram: `
Check condition
       ↓
  true? ──yes──▶ run loop body ──▶ back to check condition
    │
    no
    ↓
 exit loop
    `.trim(),
    whyItExists: `
Loops let you write one small block of logic and apply it to many items or
many repetitions, instead of duplicating code — which would be both tedious
and hard to change later.
    `.trim(),
    whenToUse: `
Use a loop whenever you need to repeat the same action for every item in a
collection, or repeat something an unknown number of times until a
condition is met — processing a list, retrying a request, counting down a
timer.
    `.trim(),
    whenNotToUse: `
If you already know you only need to do something a fixed, small number of
times, a loop can be overkill — a couple of plain repeated statements are
sometimes clearer. And for common patterns like transforming every item in
an array, methods like \`.map()\` and \`.filter()\` are usually more readable
than a manual loop.
    `.trim(),
    commonMistakes: [
      "Forgetting to update the loop variable, causing an infinite loop (e.g. forgetting `i++`).",
      "Using `<=` vs `<` incorrectly and running one extra or one fewer time than intended (an 'off-by-one' error).",
      "Modifying an array while looping over it, which can skip or repeat items.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Use a `for` loop to print the numbers 1 through 10." },
      { difficulty: "Medium", prompt: "Use a `while` loop to add up all numbers from 1 to 100." },
      { difficulty: "Hard", prompt: "Use a nested loop to print a 5x5 grid of `*` characters." },
    ],
    interviewQuestions: [
      { question: "What's the difference between `for` and `while`?", answer: "`for` is typically used when the number of iterations is known ahead of time; `while` is used when you're repeating until a condition changes, and the count isn't known in advance." },
      { question: "What causes an infinite loop?", answer: "A loop whose condition never becomes false — usually because the loop variable is never updated, or the update happens on the wrong path." },
      { question: "What do `break` and `continue` do?", answer: "`break` exits the loop immediately. `continue` skips the rest of the current iteration and moves to the next one." },
    ],
    prerequisites: ["conditions"],
    relatedTopics: ["conditions", "functions", "arrays"],
    keywords: ["for", "while", "iteration", "break", "continue"],
  },
  {
    id: "functions",
    title: "Functions",
    level: "beginner",
    description: "A reusable, named block of code that performs a specific task.",
    explanation: `
As programs grow, you end up needing to do the same task in multiple
places — calculate a total, validate an email, format a date. Instead of
repeating that logic everywhere, you wrap it in a **function**: a named
block of code you can "call" whenever you need it.

A function can accept inputs (called **parameters**) and can send back a
result (using \`return\`).
    `.trim(),
    analogy:
      "A function is like a recipe. You give it ingredients (parameters), it follows a set of steps, and it hands you back a finished dish (the return value). You can reuse the same recipe as many times as you want.",
    examples: [
      {
        title: "Declaring and calling a function",
        code: `function add(a, b) {
  return a + b;
}

const result = add(2, 3);
console.log(result); // 5`,
        explanation:
          "`add` takes two parameters, `a` and `b`, and returns their sum. Calling `add(2, 3)` runs that code with `a = 2` and `b = 3`.",
        walkthrough: [
          { code: "function add(a, b) {", explanation: "Defines a function named add that expects two inputs, a and b." },
          { code: "return a + b;", explanation: "Sends the sum of a and b back to wherever add was called." },
          { code: "}", explanation: "Marks the end of the function's code." },
          { code: "const result = add(2, 3);", explanation: "Calls add with 2 and 3, storing the returned value (5) in result." },
        ],
      },
      {
        title: "Arrow function shorthand",
        code: `const add = (a, b) => a + b;`,
        explanation: "Arrow functions are a shorter way to write simple functions, especially common in modern JavaScript.",
      },
    ],
    howItWorks: `
When you call a function, JavaScript pauses the current line, jumps into
the function's code, runs it with the arguments you passed in, and — if
there's a \`return\` statement — sends a value back to exactly where the
function was called from. Execution then continues from there.
    `.trim(),
    whyItExists: `
Functions let you name a piece of logic once and reuse it anywhere, which
keeps code shorter, easier to test, and easier to change — you only fix a
bug in one place instead of everywhere it was copy-pasted.
    `.trim(),
    whenToUse: `
Write a function any time you find yourself about to write the same few
lines of logic more than once, or whenever a chunk of code does one clear,
nameable thing — validating an email, calculating a total, formatting a
date.
    `.trim(),
    whenNotToUse: `
Don't wrap a single line you only use once in its own function just for
the sake of it — that can add an extra layer of indirection without any
real benefit. And if a function is trying to do five unrelated things,
that's usually a sign it should be split into several smaller, focused
functions instead.
    `.trim(),
    commonMistakes: [
      "Forgetting to `return` a value and expecting the function to give one back automatically.",
      "Confusing a function's parameters (the placeholders) with arguments (the actual values passed in).",
      "Writing functions that try to do too many unrelated things at once.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a function `square(n)` that returns `n * n`." },
      { difficulty: "Medium", prompt: "Write a function `isEven(n)` that returns `true` or `false`." },
      { difficulty: "Hard", prompt: "Write a function `average(numbers)` that takes an array and returns the average value." },
    ],
    interviewQuestions: [
      { question: "What's the difference between a parameter and an argument?", answer: "A parameter is the placeholder name in the function's definition; an argument is the actual value passed in when the function is called." },
      { question: "What happens if a function has no `return` statement?", answer: "It implicitly returns `undefined`." },
      { question: "What's the difference between a function declaration and an arrow function?", answer: "Besides shorter syntax, arrow functions don't have their own `this` — they use `this` from the surrounding code, which matters in object methods and callbacks." },
    ],
    prerequisites: ["loops"],
    relatedTopics: ["arrays", "scope", "callbacks", "higher-order-functions"],
    keywords: ["parameters", "arguments", "return", "arrow function"],
  },
];
