import type { Topic } from "../../types/content";

export const backendBeginnerTopics: Topic[] = [
  {
    id: "what-is-backend",
    title: "What is Backend Development?",
    level: "beginner",
    description: "The part of an application that runs on a server rather than in the user's browser — handling logic, data, and rules the user should never see or control directly.",
    explanation: `
When you use an app — say, a shopping site — a lot of what you see and
click happens right there in your browser: buttons animate, forms
validate as you type, pages update instantly. But some things can't
safely or sensibly happen on your device. Charging your credit card,
checking whether an item is actually in stock, deciding whether your
password is correct — these need to happen somewhere the user can't
peek into or tamper with, and somewhere that can talk to a shared
database that every user's app depends on.

That "somewhere else" is a **server**: another computer, usually sitting
in a data center, that your app's browser code sends requests to over
the internet. The code that runs on that server — deciding what to do
with a request, reading and writing shared data, enforcing the rules of
the business — is called the **backend**. The part running in the
user's browser, by contrast, is the **frontend**.

A backend typically does a few recurring jobs: it stores and retrieves
data (usually in a database), it applies business logic ("can this user
actually cancel this order?"), it talks to other systems (payment
providers, email services), and it decides what to send back to whoever
asked.
    `.trim(),
    analogy:
      "Think of a restaurant. The dining room — the menu, the table, the person taking your order — is the frontend: what you directly see and interact with. The kitchen is the backend: it's where the actual food gets made, the fridge (database) gets opened, and decisions get made about substitutions or what's out of stock. You never walk into the kitchen yourself; you send a request through a waiter and wait for a response.",
    examples: [
      {
        title: "A frontend action that needs a backend",
        code: `// In the browser (frontend): the user clicks "Place Order"
button.addEventListener("click", async () => {
  const response = await fetch("https://api.shop.com/orders", {
    method: "POST",
    body: JSON.stringify({ itemId: 42, quantity: 2 }),
  });
  const result = await response.json();
  showConfirmation(result);
});`,
        explanation: "The browser can't safely check stock levels or charge a card itself — it sends a request to a server and waits for an answer.",
        walkthrough: [
          { code: 'fetch("https://api.shop.com/orders", { ... })', explanation: "The frontend sends a request over the network to a server it doesn't control the internals of." },
          { code: "method: \"POST\"", explanation: "Tells the server this request is asking it to create something (an order), not just fetch data." },
          { code: "const result = await response.json();", explanation: "The frontend waits for the backend to do its work and reply before showing the user anything." },
        ],
      },
      {
        title: "What the backend does with that request",
        code: `// On the server (backend): receiving that same request
app.post("/orders", async (req, res) => {
  const { itemId, quantity } = req.body;
  const item = await db.items.findById(itemId);

  if (item.stock < quantity) {
    return res.status(400).json({ error: "Not enough stock" });
  }

  const order = await db.orders.create({ itemId, quantity });
  res.status(201).json(order);
});`,
        explanation: "This code never runs on the user's device — it lives on the server, where it can be trusted to check real, shared, up-to-date data before deciding what happens.",
      },
    ],
    howItWorks: `
A backend is just a program, like any other, except it's designed to sit
and wait for incoming requests rather than to be opened by a user
directly. It listens on the network for messages, does some work when
one arrives (read a database, run a calculation, call another service),
and sends a message back. It keeps running continuously, serving many
different users' requests, often at the same time.
    `.trim(),
    whyItExists: `
Some things simply cannot be trusted to code running on a stranger's
device: that code can be inspected, modified, or bypassed entirely by
anyone with a browser's developer tools. Backends exist to keep
sensitive logic, shared data, and trust boundaries in a place the
business actually controls — a server it owns or rents — rather than in
the hands of every individual user.
    `.trim(),
    whenToUse: `
Any time an app needs to store data that outlives a single visit, needs
to enforce a rule that a user shouldn't be able to bypass, needs to keep
a secret (like an API key or password hash), or needs multiple users to
see the same shared state, that logic belongs on a backend.
    `.trim(),
    whenNotToUse: `
Purely visual behavior — animating a menu, validating that a text field
isn't empty before the user even submits, remembering a UI preference
for just this one session — doesn't need a round trip to a server. Doing
everything on the backend when nothing shared or sensitive is involved
just adds needless network delay.
    `.trim(),
    commonMistakes: [
      "Assuming that because a rule is enforced in the frontend's JavaScript, it's actually enforced — a user can bypass frontend code entirely.",
      "Believing 'backend' means one specific technology — it's a role a program plays, not a single language or framework.",
      "Putting secrets (API keys, database passwords) into frontend code, where anyone can view them, instead of keeping them on the server.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "List three things a shopping app's backend needs to do that its frontend cannot safely do alone." },
      { difficulty: "Medium", prompt: "Explain, in your own words, why checking a discount code's validity should happen on the backend rather than in the browser." },
      { difficulty: "Hard", prompt: "Describe what could go wrong if a banking app calculated your account balance entirely in frontend JavaScript instead of on a backend." },
    ],
    interviewQuestions: [
      { question: "What is backend development?", answer: "Building the part of an application that runs on a server: business logic, data storage, and communication with other systems, as opposed to the frontend, which runs in the user's browser." },
      { question: "Why can't sensitive logic just run in the browser?", answer: "Browser code runs on the user's own device and can be inspected, modified, or bypassed, so anything that must be trusted or kept secret needs to run on a server the business controls." },
      { question: "Give an example of something that must happen on the backend.", answer: "Charging a payment, checking real-time inventory, or verifying a password against a stored hash — all require trusted, shared, up-to-date data or secrets." },
    ],
    relatedTopics: ["servers-and-web-frameworks", "request-response-lifecycle"],
    keywords: ["backend", "server-side", "frontend vs backend", "client-server"],
  },
  {
    id: "servers-and-web-frameworks",
    title: "Servers & Web Frameworks",
    level: "beginner",
    description: "What a web framework like Express actually does for you, versus the raw, repetitive plumbing you'd otherwise have to write by hand.",
    explanation: `
At its core, a web server just needs to do one thing: listen for
incoming network connections, read the request that arrives, and send
back a response. Node.js gives you a built-in way to do exactly that
with its \`http\` module — but if you use it directly, you quickly notice
that *every single thing* is your job: figuring out which URL was
requested, which HTTP method was used, parsing the body of the request
yourself, handling errors so one bad request doesn't crash the whole
server, and so on.

A **web framework** (Express is the most common one in the Node.js
world) is a library that has already solved that repetitive plumbing
for you. It gives you a clean way to say "when a GET request comes in
for /users, run this function" and takes care of the underlying request
parsing, so you can focus on what your app should actually do rather
than how HTTP messages are structured.
    `.trim(),
    analogy:
      "Writing a server with raw Node.js is like building a house by mining your own ore to forge nails. A framework like Express is a fully stocked hardware store: the nails, screws, and pre-cut lumber already exist, so you spend your time designing the house instead of smelting metal.",
    examples: [
      {
        title: "Raw Node.js — doing everything yourself",
        code: `const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/hello") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello!");
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(3000);`,
        explanation: "You have to manually check the method and URL, manually set status codes and headers, and manually handle every path that isn't matched.",
        walkthrough: [
          { code: "http.createServer((req, res) => {...})", explanation: "Creates a raw server. Every incoming request funnels through this one function, no matter what URL or method it uses." },
          { code: 'if (req.method === "GET" && req.url === "/hello")', explanation: "You are responsible for manually checking the method and path — there's no built-in routing." },
          { code: 'res.writeHead(200, { "Content-Type": "text/plain" });', explanation: "You must set the status code and headers by hand for every response." },
        ],
      },
      {
        title: "The same server with Express",
        code: `const express = require("express");
const app = express();

app.get("/hello", (req, res) => {
  res.send("Hello!");
});

app.listen(3000);`,
        explanation: "Express matches the method and path for you, defaults to a 200 status and sensible headers, and automatically returns a 404 for anything unmatched.",
      },
    ],
    howItWorks: `
Under the hood, a framework like Express is still built on top of
Node's raw \`http\` module — it hasn't replaced it, it's layered on top of
it. When a request arrives, Express looks through the routes you've
registered, finds the one whose method and path match, and calls your
function with convenient \`req\` and \`res\` objects that already have
helper methods (\`res.json()\`, \`res.status()\`, and so on) instead of the
raw, low-level ones.
    `.trim(),
    whyItExists: `
Nearly every backend needs the same basic scaffolding: routing requests
to handlers, parsing request bodies, setting consistent headers,
handling errors gracefully. Writing that from scratch for every project
is repetitive and error-prone. A framework exists so thousands of
developers don't each re-solve the same low-level problems, and so code
across different projects looks familiar and predictable.
    `.trim(),
    whenToUse: `
Reach for a web framework for essentially any real backend project —
even small ones benefit from not having to hand-roll routing and error
handling. It's the default starting point unless you have a very
specific reason not to use one.
    `.trim(),
    whenNotToUse: `
For a tiny script that just needs to respond to one fixed request (a
health-check endpoint with no other logic, for instance), pulling in a
full framework can be overkill — Node's raw \`http\` module or a
minimal library might be all that's needed.
    `.trim(),
    commonMistakes: [
      "Thinking a framework replaces Node.js — it's built on top of it, not instead of it.",
      "Assuming Express is the only option — other frameworks (Fastify, Koa, NestJS) solve the same problem with different trade-offs.",
      "Not realizing that a framework still runs your own code — it organizes and simplifies, but the business logic is still yours to write.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a raw Node.js `http` server that responds with \"pong\" to any request." },
      { difficulty: "Medium", prompt: "Rewrite that same server using Express, and add a second route that returns JSON." },
      { difficulty: "Hard", prompt: "List three specific things Express does for you automatically that you would otherwise have to write by hand in raw Node.js." },
    ],
    interviewQuestions: [
      { question: "What problem does a web framework solve?", answer: "It handles the repetitive low-level plumbing of building a server — routing, parsing, response helpers, error handling — so developers can focus on application logic instead of rebuilding it each time." },
      { question: "Is Express a replacement for Node.js?", answer: "No — Express is a library built on top of Node's built-in `http` module; it simplifies working with it but doesn't replace it." },
      { question: "Name one thing you'd have to write manually with raw Node.js that a framework provides out of the box.", answer: "Routing requests to the right handler based on method and path — with raw Node you must check `req.method` and `req.url` yourself." },
    ],
    prerequisites: ["what-is-backend"],
    relatedTopics: ["what-is-backend", "routing", "middleware"],
    keywords: ["express", "node.js", "http module", "web framework"],
  },
  {
    id: "routing",
    title: "Routing",
    level: "beginner",
    description: "The way a server decides which piece of code should handle a given URL and HTTP method.",
    explanation: `
A backend usually needs to do many different things: fetch a list of
users, create a new order, delete a comment, and so on. Every incoming
request arrives with a **path** (like \`/users\` or \`/orders/42\`) and a
**method** (GET, POST, PUT, DELETE...) that together describe what the
caller wants. The server needs a way to look at those two pieces of
information and decide exactly which function should run.

That mapping — from "method + path" to "the function that handles it" —
is called **routing**. Each individual mapping (like "a GET request to
/users runs this function") is called a **route**.
    `.trim(),
    analogy:
      "A router is like the directory board in an office lobby: you tell it who you want to see and what you're there for (a delivery vs. a meeting), and it tells you exactly which floor and room to go to. Without it, you'd have to knock on every door in the building.",
    examples: [
      {
        title: "Basic routes by method and path",
        code: `app.get("/users", (req, res) => {
  res.json(allUsers);
});

app.post("/users", (req, res) => {
  const newUser = createUser(req.body);
  res.status(201).json(newUser);
});

app.delete("/users/:id", (req, res) => {
  deleteUser(req.params.id);
  res.status(204).end();
});`,
        explanation: "The same path, /users, behaves completely differently depending on the HTTP method — routing is what tells them apart.",
        walkthrough: [
          { code: 'app.get("/users", ...)', explanation: "Registers a route: when a GET request arrives for /users, call this function." },
          { code: 'app.post("/users", ...)', explanation: "A different route for the same path, but a different method — creating a user instead of listing them." },
          { code: 'app.delete("/users/:id", ...)', explanation: "The :id part is a route parameter — it matches any value in that position, like /users/42, and makes it available as req.params.id." },
        ],
      },
      {
        title: "Route parameters and query strings",
        code: `// GET /products/17?color=red
app.get("/products/:id", (req, res) => {
  const productId = req.params.id;   // "17"
  const color = req.query.color;     // "red"
  res.json(findProduct(productId, color));
});`,
        explanation: "Route parameters (:id) capture parts of the path itself, while query strings (?color=red) capture extra optional filters after a question mark.",
      },
    ],
    howItWorks: `
When a request arrives, the framework walks through the routes you've
registered, in the order you defined them, checking each one's method
and path pattern against the incoming request. As soon as it finds a
match, it runs that route's handler function and stops looking (unless
that handler explicitly passes control onward). If nothing matches, the
framework falls back to a default "not found" response.
    `.trim(),
    whyItExists: `
Without routing, every request would have to be handled by one giant
function containing endless if-statements checking the method and path
by hand. Routing exists to let you declare, in a clear and organized
way, exactly which code is responsible for which kind of request —
making the codebase easier to navigate as it grows to dozens or hundreds
of endpoints.
    `.trim(),
    whenToUse: `
Every backend endpoint you build needs a route: any time you want a
client to be able to reach a specific piece of server logic via a
specific URL and method, you define a route for it.
    `.trim(),
    whenNotToUse: `
Routing doesn't apply to logic that isn't triggered by an incoming
request — a scheduled background job or an internal helper function
doesn't need a route, since nothing external is calling it by URL.
    `.trim(),
    commonMistakes: [
      "Defining a more general route (like /users/:id) before a more specific one (like /users/me), causing the general one to match first and swallow requests meant for the specific one.",
      "Forgetting that the same path can have entirely different meanings depending on the HTTP method.",
      "Confusing route parameters (part of the path, like :id) with query strings (the ?key=value part after the path).",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a route that responds to a GET request at /ping with the text \"pong\"." },
      { difficulty: "Medium", prompt: "Write a route /articles/:slug that reads the slug from the URL and returns it in a JSON response." },
      { difficulty: "Hard", prompt: "Explain why placing app.get(\"/users/:id\") before app.get(\"/users/me\") could cause a bug, and show how to fix the ordering." },
    ],
    interviewQuestions: [
      { question: "What is routing in a web server?", answer: "The mechanism that maps an incoming request's method and URL path to the specific function that should handle it." },
      { question: "What's the difference between a route parameter and a query string?", answer: "A route parameter is a named part of the path itself (like /users/:id), while a query string is optional key-value data appended after a question mark (like ?sort=asc)." },
      { question: "What typically happens if no route matches an incoming request?", answer: "The framework falls back to a default handler, usually responding with a 404 Not Found status." },
    ],
    prerequisites: ["servers-and-web-frameworks"],
    relatedTopics: ["servers-and-web-frameworks", "middleware", "request-response-lifecycle"],
    keywords: ["routing", "route parameters", "http methods", "endpoints"],
  },
  {
    id: "middleware",
    title: "Middleware",
    level: "beginner",
    description: "Small functions that run before a request reaches its final route handler, each able to inspect, modify, or stop the request.",
    explanation: `
Lots of behavior needs to happen on *every* (or almost every) request,
regardless of which specific route it's headed for: logging that a
request came in, checking whether the user is logged in, parsing the
raw body of the request into usable data. Repeating that logic inside
every single route handler would be tedious and error-prone.

**Middleware** are functions that sit in between the request arriving
and the route handler that ultimately deals with it. Each middleware
function gets a chance to look at the request, do some work, and then
either pass control on to the next thing in line, or stop the chain
early (for example, rejecting an unauthenticated request before it ever
reaches the route).
    `.trim(),
    analogy:
      "Think of airport security checkpoints between the entrance and your gate: one checks your ticket, another scans your bag, another checks your ID. Each checkpoint either waves you through to the next one, or stops you right there if something's wrong. Your route handler is the gate — middleware is everything you pass through to get there.",
    examples: [
      {
        title: "A simple logging middleware",
        code: `function logger(req, res, next) {
  console.log(\`\${req.method} \${req.url}\`);
  next(); // pass control to the next function in line
}

app.use(logger);

app.get("/users", (req, res) => {
  res.json(allUsers);
});`,
        explanation: "logger runs before every single route in this app, since it's registered with app.use() rather than tied to one specific path.",
        walkthrough: [
          { code: "function logger(req, res, next) {", explanation: "Middleware functions receive req and res, just like route handlers, plus a third argument: next." },
          { code: "console.log(`${req.method} ${req.url}`);", explanation: "Does its one job — recording that a request arrived — without needing to know what will happen after it." },
          { code: "next();", explanation: "Hands control to whatever comes next in the chain. Forgetting this line would leave the request hanging forever." },
        ],
      },
      {
        title: "Middleware that can stop the chain",
        code: `function requireAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

app.get("/orders", requireAuth, (req, res) => {
  res.json(getOrdersFor(req.user));
});`,
        explanation: "requireAuth is attached to just this one route. If the check fails, it sends a response and never calls next(), so the route handler never runs at all.",
      },
    ],
    howItWorks: `
Middleware functions run in the exact order they're registered,
forming a chain. Each one receives \`(req, res, next)\` — the same request
and response objects as a route handler, plus a \`next\` function. Calling
\`next()\` moves on to the next middleware (or, at the end of the chain,
the matching route handler). *Not* calling \`next()\` — for example, because
you called \`res.send()\` instead — stops the chain right there, so nothing
further down the line ever runs for that request.
    `.trim(),
    diagram: `
Request
   │
   ▼
[logger]  → calls next()
   │
   ▼
[requireAuth]  → calls next() OR sends 401 and stops
   │
   ▼
[route handler]  → sends the final response
    `.trim(),
    whyItExists: `
Middleware exists so that cross-cutting behavior — logging, auth checks,
parsing request bodies, compressing responses — can be written once and
applied to many routes, instead of being copy-pasted into every route
handler individually.
    `.trim(),
    whenToUse: `
Use middleware for anything that needs to happen consistently across
multiple routes: authentication checks, request logging, parsing
incoming JSON bodies, or rejecting malformed requests before they reach
your business logic.
    `.trim(),
    whenNotToUse: `
Logic that's truly specific to one single route — and unlikely to ever
be reused elsewhere — is usually simpler to just write directly inside
that route's handler rather than extracting it into a separate
middleware function.
    `.trim(),
    commonMistakes: [
      "Forgetting to call `next()`, which leaves the request hanging with no response ever sent.",
      "Calling `next()` *after* also sending a response, which can cause confusing \"headers already sent\" errors.",
      "Registering middleware in the wrong order — for example, putting a route before the auth-check middleware that's supposed to protect it.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a middleware function that logs the current timestamp for every incoming request." },
      { difficulty: "Medium", prompt: "Write a middleware function that rejects any request missing a `x-api-key` header with a 401 response." },
      { difficulty: "Hard", prompt: "Explain what would happen if a middleware function neither calls `next()` nor sends a response, and why that's a bug." },
    ],
    interviewQuestions: [
      { question: "What is middleware in a web framework?", answer: "A function that runs between an incoming request and its final route handler, able to inspect, modify, or halt the request before it continues down the chain." },
      { question: "What does calling `next()` do?", answer: "It passes control to the next middleware function in the chain, or to the matching route handler if there are no more middleware functions left." },
      { question: "Give an example of something commonly implemented as middleware.", answer: "Authentication checks, request logging, and parsing an incoming request body are all classic examples of middleware." },
    ],
    prerequisites: ["routing"],
    relatedTopics: ["routing", "request-response-lifecycle", "error-handling-apis"],
    keywords: ["middleware", "next()", "request chain", "app.use"],
  },
  {
    id: "request-response-lifecycle",
    title: "Request/Response Lifecycle",
    level: "beginner",
    description: "The complete journey a request takes from the moment it arrives at your server to the moment a response is sent back.",
    explanation: `
Every single interaction a backend has with the outside world follows
the same overall shape: something asks for something (a **request**),
and the server eventually answers (a **response**). But between those
two moments, several distinct things happen in a predictable order.
Understanding that full sequence — the **request/response lifecycle** —
is what lets you reason about where to put logging, where auth checks
belong, and why a response sometimes never arrives.
    `.trim(),
    analogy:
      "Ordering food through a drive-through: your car pulls up (a request arrives), you pass through the ordering speaker and the payment window (middleware), your order reaches the kitchen (the route handler), the food gets made (business logic runs), and finally it's handed to you through the pickup window (the response is sent). If any step along the way fails, you never reach the end.",
    examples: [
      {
        title: "Tracing one request through the whole lifecycle",
        code: `app.use(express.json());          // 1. parse the request body
app.use(logger);                  // 2. log the request

app.get("/products/:id", (req, res) => {  // 3. matched route runs
  const product = findProduct(req.params.id); // 4. business logic
  if (!product) {
    return res.status(404).json({ error: "Not found" }); // 5a. response
  }
  res.json(product);             // 5b. response
});`,
        explanation: "Every request to this server flows through the same numbered stages, even though the specific data differs each time.",
        walkthrough: [
          { code: "app.use(express.json());", explanation: "Stage 1: the raw request body arrives as bytes and gets parsed into a usable JavaScript object before anything else touches it." },
          { code: "app.use(logger);", explanation: "Stage 2: cross-cutting middleware runs, in this case just recording that the request happened." },
          { code: 'app.get("/products/:id", (req, res) => {', explanation: "Stage 3: the framework has matched this request to exactly one route handler based on method and path." },
          { code: "const product = findProduct(req.params.id);", explanation: "Stage 4: the actual business logic — the reason this endpoint exists — runs here." },
          { code: "res.json(product);", explanation: "Stage 5: a response is finally built and sent back, ending the lifecycle for this request." },
        ],
      },
      {
        title: "A request that ends early",
        code: `app.use((req, res, next) => {
  if (isBlocked(req.ip)) {
    return res.status(403).send("Forbidden"); // lifecycle ends here
  }
  next();
});

app.get("/data", (req, res) => {
  res.json(getData()); // never reached for blocked IPs
});`,
        explanation: "The lifecycle doesn't always reach the route handler — any middleware along the way can send a response and end things early.",
      },
    ],
    howItWorks: `
A request's journey generally looks like this: it arrives at the
server; the framework parses low-level details like headers and the
body; it flows through any globally-registered middleware in order;
the framework matches it to a specific route based on method and path;
any route-specific middleware runs; the route handler executes the
actual application logic, often involving a database call; a response
is constructed with a status code, headers, and a body; and that
response is sent back over the network, closing out the request. Once a
response has been sent, nothing more can be sent for that same request.
    `.trim(),
    diagram: `
Client
  │  request
  ▼
[Parsing] → [Global middleware] → [Route matching]
                                        │
                                        ▼
                              [Route-specific middleware]
                                        │
                                        ▼
                                 [Route handler]
                                        │
                                        ▼
                                 [Build response]
                                        │
                                        ▼
Client ◄──────────────── response ─────┘
    `.trim(),
    whyItExists: `
Thinking in terms of a fixed lifecycle gives every developer working on
a backend a shared mental model of "where" any given piece of code runs
relative to everything else — which is essential for debugging (why did
this request never get logged?) and for deciding where new logic
belongs.
    `.trim(),
    whenToUse: `
Keep this lifecycle in mind whenever you're deciding where a new piece
of logic belongs — early as global middleware, scoped to one route, or
inside the handler itself — or when debugging why a request behaved
unexpectedly.
    `.trim(),
    whenNotToUse: `
This isn't something you "use" directly — it's the backdrop every
request already runs through. There's no scenario where it doesn't
apply to an HTTP-based backend, though extremely different systems
(like a raw TCP server with no framework) may structure it differently.
    `.trim(),
    commonMistakes: [
      "Trying to send a second response after one has already been sent, causing a runtime error.",
      "Not realizing that a middleware or route handler earlier in the chain already ended the lifecycle, so later code never runs.",
      "Putting expensive, request-specific work in global middleware that runs on every request, even ones that don't need it.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "List, in order, the stages a GET request passes through in a typical Express app with one logging middleware and one route." },
      { difficulty: "Medium", prompt: "Write a small Express app where a middleware blocks requests without a specific header, and trace what happens to a request that is blocked versus one that isn't." },
      { difficulty: "Hard", prompt: "Explain what error you'd expect if a route handler calls `res.json()` twice for the same request, and why." },
    ],
    interviewQuestions: [
      { question: "What is the request/response lifecycle?", answer: "The full, ordered sequence of steps a request goes through from arriving at a server to a response being sent back — parsing, middleware, routing, the handler, and the final response." },
      { question: "Can the lifecycle end before reaching the route handler?", answer: "Yes — any middleware along the way can send a response itself and stop calling next(), ending the lifecycle early." },
      { question: "What happens if code tries to send a response after one has already been sent for the same request?", answer: "It typically causes a runtime error, since a single request can only be answered with one response." },
    ],
    prerequisites: ["middleware"],
    relatedTopics: ["routing", "middleware", "error-handling-apis"],
    keywords: ["request lifecycle", "response cycle", "http flow"],
  },
  {
    id: "nodejs-runtime",
    title: "How Node.js Works",
    level: "beginner",
    description: "The JavaScript runtime that lets JavaScript run outside a browser, and the single-threaded, event-driven model behind it.",
    explanation: `
JavaScript was originally built to run inside a browser, reacting to
clicks and typing. **Node.js** is a runtime that lets the same language
run anywhere else — on a server, handling incoming HTTP requests instead
of clicks. It does this by pairing Chrome's **V8** engine (which turns
JavaScript into fast machine instructions) with extra capabilities a
browser doesn't need, like reading files from disk or opening network
connections.

The part that surprises people most is that Node runs your JavaScript on
a **single thread** — it can only execute one line of your code at a
time. It stays fast under load anyway because most of what a backend
does (reading a file, querying a database, waiting for a network
response) is *waiting*, not computing. Instead of blocking that one
thread while it waits, Node hands the waiting off and moves on to other
work, coming back to your code only once the result is ready. That
loop — run some code, hand off anything that waits, run whatever's ready
next — is the **event loop**.
    `.trim(),
    analogy:
      "Node.js is like a single waiter working an entire restaurant. Instead of standing at one table until the kitchen finishes that order, the waiter takes the order, moves straight to the next table, and comes back to serve each dish the moment it's ready. One waiter can serve far more tables this way than by camping out at each one — as long as no single task (like arguing with a customer for twenty minutes) hogs the waiter's attention.",
    examples: [
      {
        title: "Blocking vs. non-blocking file reads",
        code: `const fs = require("fs");

// Blocking: nothing else runs until this finishes
const data = fs.readFileSync("large-file.txt");
console.log("done reading");

// Non-blocking: Node moves on immediately, and runs
// this callback later, once the file is ready
fs.readFile("large-file.txt", (err, data) => {
  console.log("done reading");
});
console.log("this logs first, before the read finishes");`,
        explanation: "The sync version freezes the single thread until the disk read completes; the async version hands the read off and keeps running other code, coming back only when the result is ready.",
        walkthrough: [
          { code: "fs.readFileSync(...)", explanation: "Blocks — the entire process waits here, unable to do anything else, until the file is fully read." },
          { code: "fs.readFile(..., callback)", explanation: "Starts the read and returns immediately, letting the rest of the program continue." },
          { code: '"this logs first..."', explanation: "Proves the non-blocking call didn't wait: the line after it runs before the callback does." },
        ],
      },
      {
        title: "Why this matters for a server",
        code: `app.get("/report", (req, res) => {
  // While this database query is pending, Node is
  // free to handle other incoming requests on the
  // same single thread.
  db.query("SELECT * FROM big_table", (err, rows) => {
    res.json(rows);
  });
});`,
        explanation: "A slow database query for one user doesn't block the server from responding to other users in the meantime — the thread isn't sitting idle waiting for that query.",
      },
    ],
    howItWorks: `
Node runs your JavaScript on one main thread. When your code calls
something that involves waiting — reading a file, querying a database,
making an HTTP request — Node doesn't do that waiting on the main
thread itself. It hands the work off (to the operating system, or to a
background thread pool inside Node called *libuv*) and immediately
continues running whatever JavaScript comes next.

Once that background work finishes, its callback (or promise) is placed
in a queue. The **event loop** is the process that continuously checks:
"is the main thread free, and is there a finished callback waiting?" —
and when both are true, it runs that callback. This is why a single
Node process can have thousands of database queries or file reads "in
flight" at once, even though it only ever executes one line of your
JavaScript at any given instant.
    `.trim(),
    diagram: `
 Your code            Background (libuv / OS)
 ─────────            ───────────────────────
 fs.readFile() ──────▶  reading disk...
    │
    ▼
 (keeps running
  other requests)
                        disk read finishes
                              │
                              ▼
 callback queued ◀────────────
    │
    ▼
 event loop runs it
 once the thread is free
    `.trim(),
    whyItExists: `
Traditional server designs often gave each incoming connection its own
thread, which works but gets expensive — thousands of connections mean
thousands of threads, each with real memory and scheduling overhead.
Node exists to handle huge numbers of *I/O-bound* connections (network
and disk work, not heavy computation) efficiently on a single thread, by
never letting the thread sit idle waiting for something slow.
    `.trim(),
    whenToUse: `
Node is a strong fit for backends that spend most of their time waiting
on I/O — REST APIs, real-time apps (chat, live dashboards), and services
that mostly shuttle data between a client and a database or another
service.
    `.trim(),
    whenNotToUse: `
Node struggles with CPU-heavy work — image or video processing, large
in-memory computation, cryptographic hashing of huge payloads — because
that kind of work occupies the single thread and blocks everything else
until it finishes. For that, you'd offload the work to worker threads, a
separate service, or a language built around multi-threaded computation.
    `.trim(),
    commonMistakes: [
      "Running a long, synchronous, CPU-heavy loop inside a request handler, which freezes the entire server for every other user until it finishes.",
      "Assuming Node is multi-threaded because it can 'handle' many requests at once — it's the waiting, not your actual JavaScript, that happens concurrently.",
      "Using a synchronous file system method (like `readFileSync`) inside a request handler in a production server, blocking every other request while it runs.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain, in one sentence, why fs.readFile lets other code run sooner than fs.readFileSync." },
      { difficulty: "Medium", prompt: "Write a small snippet with three console.log calls — one before, one inside a setTimeout callback, and one after — and predict the order they print in." },
      { difficulty: "Hard", prompt: "Explain why a single expensive, synchronous loop (like sorting a huge array) inside one request handler would slow down responses to every other concurrent user, even though Node is handling many requests." },
    ],
    interviewQuestions: [
      { question: "Is Node.js single-threaded or multi-threaded?", answer: "Your JavaScript runs on a single main thread, but Node offloads I/O work (file access, network calls) to the operating system or a background thread pool, so it can appear to handle many things concurrently." },
      { question: "What is the event loop?", answer: "The mechanism that continuously checks whether the main thread is free and whether any background work has finished, and runs the corresponding callback when both are true." },
      { question: "Why is a CPU-heavy operation bad for Node.js performance?", answer: "It occupies the single main thread directly, so nothing else — including responses to other users — can run until it finishes, unlike I/O work which is handed off elsewhere while it waits." },
    ],
    prerequisites: ["servers-and-web-frameworks"],
    relatedTopics: ["servers-and-web-frameworks", "request-response-lifecycle", "background-jobs"],
    keywords: ["Node.js", "event loop", "non-blocking I/O", "V8", "single-threaded", "libuv", "runtime"],
  },
  {
    id: "project-structure",
    title: "Backend Project Structure",
    level: "beginner",
    description: "The folder and file layout that keeps routes, business logic, and data access separated as a backend app grows.",
    explanation: `
A backend with two or three routes can live comfortably in a single
file. But add validation, error handling, a database, and a dozen more
endpoints, and that one file turns into hundreds of lines mixing three
very different concerns: parsing HTTP requests, deciding what should
actually happen, and talking to the database.

**Project structure** is how you split those concerns into folders so
each piece of code has one clear job and a predictable place to live —
commonly \`routes/\` (which URLs exist), \`controllers/\` (translate a
request into a plain function call and a response), \`services/\` (the
actual business logic), and \`models/\` (talking to the database).
    `.trim(),
    analogy:
      "Think of a restaurant kitchen: the host at the door (routes) decides which table a guest goes to, the server (controller) takes the order and carries it back, the chef (service) actually cooks using the recipe, and the pantry (model) is where the raw ingredients live. Each role could technically be done by one overworked person, but splitting them is what lets a kitchen serve more than a handful of tables without chaos.",
    examples: [
      {
        title: "Before: everything in one file",
        code: `// server.js — every concern tangled together
app.post("/users", async (req, res) => {
  if (!req.body.email || !req.body.email.includes("@")) {
    return res.status(400).json({ error: "invalid email" });
  }
  const existing = await db.query("SELECT * FROM users WHERE email = $1", [req.body.email]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: "email taken" });
  }
  const result = await db.query(
    "INSERT INTO users (email) VALUES ($1) RETURNING *",
    [req.body.email]
  );
  res.status(201).json(result.rows[0]);
});`,
        explanation: "Validation, business rules, and raw SQL are all crammed into the route itself — fine for one endpoint, unmanageable once there are fifty.",
      },
      {
        title: "After: split across layers",
        code: `// routes/users.js
router.post("/users", usersController.create);

// controllers/usersController.js
async function create(req, res) {
  const user = await usersService.createUser(req.body.email);
  res.status(201).json(user);
}

// services/usersService.js
async function createUser(email) {
  if (!email.includes("@")) throw new ValidationError("invalid email");
  if (await usersModel.findByEmail(email)) throw new ConflictError("email taken");
  return usersModel.insert(email);
}

// models/usersModel.js
function findByEmail(email) {
  return db.query("SELECT * FROM users WHERE email = $1", [email]);
}`,
        explanation: "Each file now has one job: the route maps a URL to a controller, the controller only translates HTTP in and out, the service holds the actual rule ('emails must be unique'), and the model is the only place that knows any SQL.",
        walkthrough: [
          { code: "routes/users.js", explanation: "Declares which URL and method trigger this behavior, and hands off immediately — no logic here." },
          { code: "controllers/usersController.js", explanation: "Reads what it needs from the request, calls into the service, and shapes the HTTP response — no business rules or SQL." },
          { code: "services/usersService.js", explanation: "Holds the actual decision-making ('is this email valid and unique?') — reusable from anywhere, not tied to HTTP at all." },
          { code: "models/usersModel.js", explanation: "The only file that knows how a user is actually stored — if you swapped databases, this is the only layer that would need to change." },
        ],
      },
      {
        title: "The full folder tree, and how it actually gets run",
        code: `my-api/
├── package.json          # scripts.dev = "node src/server.js"
├── src/
│   ├── server.js          # entry point: starts the app, calls app.listen()
│   ├── app.js             # creates the Express app, wires up middleware + routes
│   ├── routes/
│   │   └── users.js
│   ├── controllers/
│   │   └── usersController.js
│   ├── services/
│   │   └── usersService.js
│   ├── models/
│   │   └── usersModel.js
│   └── config/
│       └── db.js          # database connection setup
└── .env                   # DATABASE_URL, PORT, etc.

# Run it with:
$ npm run dev`,
        explanation: "server.js is the one file that actually gets executed — everything else (app.js and the folders beneath it) is just code that server.js, directly or indirectly, requires and calls. npm run dev is a shortcut defined in package.json for node src/server.js, so nobody has to remember the exact entry-file path by hand.",
      },
    ],
    howItWorks: `
A request flows down through the layers and the response flows back up:
the route matches a URL to a controller function, the controller pulls
out what it needs from the request and calls a service, the service
applies business rules and calls a model when it needs data, and the
model is the only layer that actually knows how that data is stored.
Each layer only talks to the one directly below it, which is what makes
it possible to change one layer (like swapping databases) without
rewriting the others.
    `.trim(),
    diagram: `
Route  →  Controller  →  Service  →  Model  →  Database
(URL)     (HTTP in/out)  (business    (data
                          rules)       access)
    `.trim(),
    whyItExists: `
Without any structure, HTTP concerns, business rules, and database
queries end up tangled together in the same functions. That makes code
hard to test (you can't test a business rule without also faking an
entire HTTP request), hard to change (a database swap touches every
route), and hard for a new developer to navigate (there's no
predictable place to look for a given kind of logic).
    `.trim(),
    whenToUse: `
Reach for a layered structure as soon as a project has more than a
handful of endpoints, or as soon as the same logic (like "is this email
already taken") needs to be reused from more than one place.
    `.trim(),
    whenNotToUse: `
For a tiny prototype, a quick script, or a project with two or three
endpoints total, splitting into four folders is often pure overhead —
one well-organized file is easier to follow than jumping between five
nearly-empty ones. Add structure when the pain of not having it shows up,
not before.
    `.trim(),
    commonMistakes: [
      "Putting raw database queries directly inside route handlers or controllers, defeating the point of having a separate data-access layer.",
      "Letting controllers grow their own business logic instead of delegating to a service, so the same rule gets duplicated across multiple controllers.",
      "Introducing the full layered structure for a two-endpoint prototype, adding indirection before there's any real complexity to manage.",
      "Not knowing which file is actually the entry point, and guessing at how to start the app instead of checking package.json's scripts.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "For a function that checks whether a discount code has expired, name which layer (route, controller, service, or model) it belongs in and why." },
      { difficulty: "Medium", prompt: "Take a route handler that both queries a database and formats a JSON response, and split it into a controller and a model function." },
      { difficulty: "Hard", prompt: "Explain the trade-off between using a full layered structure for a 3-endpoint prototype versus keeping it in one file, and describe the signal that would tell you it's time to split it up." },
    ],
    interviewQuestions: [
      { question: "Why split a backend project into routes, controllers, services, and models instead of one file?", answer: "To separate concerns so each layer has one job and a predictable location — making the code easier to test, change, and navigate as it grows." },
      { question: "What's the difference between a controller and a service?", answer: "A controller translates an HTTP request into a plain function call and shapes the response; a service holds the actual business logic, independent of HTTP." },
      { question: "How does a command like npm run dev know which file to actually run?", answer: "It's a shortcut defined in package.json's scripts section, pointing at the project's real entry file — the file that calls app.listen() and starts the server." },
    ],
    prerequisites: ["routing", "middleware"],
    relatedTopics: ["routing", "middleware", "dependency-injection", "npm-and-packages"],
    keywords: ["project structure", "MVC", "layered architecture", "separation of concerns", "controllers", "services", "models"],
  },
  {
    id: "npm-and-packages",
    title: "npm & Package Management",
    level: "beginner",
    description: "How Node.js projects declare, install, and lock their external dependencies using npm and package.json.",
    explanation: `
Almost no backend is written entirely from scratch — a project reaches
for a web framework, a database driver, a validation library, and
dozens of things those libraries themselves depend on. **npm** (Node
Package Manager) is the tool that installs and manages all of that.

Every Node project has a \`package.json\` file describing it: its name,
its **dependencies** (code needed to run in production, like a web
framework) and **devDependencies** (tools only needed while developing,
like a test runner), and a \`scripts\` section defining shortcuts like
\`npm run dev\`. Running \`npm install\` reads that file, downloads
everything listed (plus whatever *those* packages depend on), and puts
it all in a \`node_modules\` folder.
    `.trim(),
    analogy:
      "package.json is like a shopping list for your project — 'we need this framework, this validator, and only this test tool while we're building.' node_modules is the fully-stocked pantry that results from shopping off that list. The lock file is the receipt, recording the exact brand and size of everything bought, so a second shopping trip buys precisely the same items again.",
    examples: [
      {
        title: "A minimal package.json",
        code: `{
  "name": "my-api",
  "version": "1.0.0",
  "scripts": {
    "dev": "node server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.19.0",
    "pg": "^8.11.0"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}`,
        explanation: "express and pg are needed for the app to actually run in production; jest is only used while developing and testing, so it's kept separate.",
        walkthrough: [
          { code: '"scripts": { "dev": "node server.js" }', explanation: "Defines a shortcut — running npm run dev is equivalent to typing node server.js." },
          { code: '"dependencies": { "express": "^4.19.0" }', explanation: "The ^ allows npm to install newer compatible versions (any 4.x.x) but never a breaking major version change." },
          { code: '"devDependencies": { "jest": "^29.7.0" }', explanation: "Installed locally for development, but excluded when installing only production dependencies for deployment." },
        ],
      },
      {
        title: "Common npm commands",
        code: `npm install              # install everything listed in package.json
npm install express      # add express as a dependency
npm install -D jest      # add jest as a devDependency
npm run dev              # run the "dev" script
npx some-cli-tool        # run a package's command without installing it globally`,
        explanation: "npm install without arguments sets up a project you just cloned; with a package name, it adds something new and updates package.json for you.",
      },
    ],
    howItWorks: `
When you run \`npm install <package>\`, npm looks up that package (and
every package *it* depends on) in the public npm registry, downloads
them all into \`node_modules\`, and adds an entry to \`package.json\`. It
also writes the exact resolved version of every package — direct and
transitive — into \`package-lock.json\`. That lock file is what makes
installs reproducible: without it, two developers running
\`npm install\` weeks apart could get different versions of the same
"^4.19.0" dependency as new compatible releases come out.
    `.trim(),
    whyItExists: `
Before package managers, reusing someone else's code meant manually
downloading and copying files, with no easy way to track versions or
pull in updates. npm exists to standardize declaring what a project
needs, discovering existing packages instead of writing everything from
scratch, and installing all of it (transitive dependencies included) in
a reproducible way.
    `.trim(),
    whenToUse: `
Any real Node.js project uses npm — even a project with just one
dependency benefits from package.json documenting what it needs and
scripts standardizing how to run it.
    `.trim(),
    whenNotToUse: `
The question is less "when to skip npm" and more "when to skip adding a
dependency": pulling in a package for something trivial you could write
in a few lines yourself (like checking if a number is even) adds an
extra thing to keep updated and trust, for very little benefit.
    `.trim(),
    commonMistakes: [
      "Committing the node_modules folder to git instead of .gitignore-ing it and letting npm install regenerate it from package.json.",
      "Hand-editing package-lock.json, which npm manages automatically and expects to stay in sync with actual installs.",
      "Installing something needed only for testing or building as a regular dependency instead of a devDependency, bloating what ships to production.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain the difference between dependencies and devDependencies in package.json." },
      { difficulty: "Medium", prompt: "Given a package.json with express under dependencies and jest under devDependencies, name the command that installs only what's needed to run the app in production." },
      { difficulty: "Hard", prompt: "Explain how two developers without a package-lock.json file could end up with different versions of the same dependency, and how committing that file prevents it." },
    ],
    interviewQuestions: [
      { question: "What is package.json?", answer: "A file describing a Node.js project — its name, its dependencies and devDependencies, and shortcut commands defined under scripts." },
      { question: "What's the difference between dependencies and devDependencies?", answer: "dependencies are needed for the app to run in production; devDependencies are only needed while developing, like test runners or build tools." },
      { question: "What is package-lock.json for?", answer: "It records the exact resolved version of every installed package, direct and transitive, so future installs are reproducible instead of drifting as new compatible versions are published." },
    ],
    prerequisites: ["servers-and-web-frameworks"],
    relatedTopics: ["servers-and-web-frameworks", "project-structure", "deployment-and-cicd"],
    keywords: ["npm", "package.json", "package-lock.json", "node_modules", "dependencies", "devDependencies", "semver"],
  },
];
