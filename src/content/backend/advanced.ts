import type { Topic } from "../../types/content";

export const backendAdvancedTopics: Topic[] = [
  {
    id: "api-versioning",
    title: "API Versioning",
    level: "advanced",
    description: "How to change an API's shape over time without breaking the other applications and clients already relying on it.",
    explanation: `
Once an API is live, you rarely control every single thing that calls
it. A mobile app might be installed on thousands of phones, some of
which won't update for months. A partner company might have built
their own integration against your endpoints. If you change how an
endpoint behaves — renaming a field, changing what a status code means,
removing something you thought nobody used — every one of those
existing callers can break the moment you deploy, with no warning.

**API versioning** is a strategy for making changes to an API while
still letting existing clients keep working exactly as before,
typically by letting multiple versions of an endpoint exist side by
side, at least for a transition period. Two common approaches are
**URL versioning** (\`/v1/users\` vs. \`/v2/users\`) and **header
versioning** (the same URL, but the client specifies a version in a
request header).
    `.trim(),
    analogy:
      "Think of a road under construction. You don't close the only bridge into town overnight and strand everyone driving toward it — you build a new bridge alongside the old one, let both operate for a while, and only remove the old one once you're confident nobody still needs it.",
    examples: [
      {
        title: "URL versioning",
        code: `// v1: returns a flat "name" field
app.get("/v1/users/:id", (req, res) => {
  res.json({ id: req.params.id, name: "Ada Lovelace" });
});

// v2: splits name into first/last, without touching v1's contract at all
app.get("/v2/users/:id", (req, res) => {
  res.json({ id: req.params.id, firstName: "Ada", lastName: "Lovelace" });
});`,
        explanation: "Old clients keep calling /v1/users and get exactly the response shape they always have, while new clients can opt into /v2/users for the improved shape.",
        walkthrough: [
          { code: 'app.get("/v1/users/:id", ...)', explanation: "The original contract, kept running unchanged for as long as any client still depends on it." },
          { code: '{ id: req.params.id, name: "Ada Lovelace" }', explanation: "v1's response shape is frozen — changing it here would break every existing caller relying on a single 'name' field." },
          { code: 'app.get("/v2/users/:id", ...)', explanation: "A separate route entirely, free to introduce a breaking change (splitting name into two fields) because it doesn't affect v1's callers at all." },
        ],
      },
      {
        title: "Header-based versioning",
        code: `app.get("/users/:id", (req, res) => {
  const version = req.headers["api-version"] || "1";

  const user = { id: req.params.id, name: "Ada Lovelace" };

  if (version === "2") {
    const [firstName, lastName] = user.name.split(" ");
    return res.json({ id: user.id, firstName, lastName });
  }
  res.json(user);
});`,
        explanation: "The URL never changes, but the client's requested version — sent as a header — determines the exact shape of the response.",
      },
    ],
    howItWorks: `
Rather than changing an existing endpoint's behavior in place, a new
version is introduced alongside it — either as a distinct URL prefix
(\`/v2/...\`) or by reading a version identifier from a header (or
sometimes a query parameter) and branching internally. Existing clients
that don't specify a version, or that explicitly ask for the old one,
keep getting the original behavior indefinitely (or until a
communicated deprecation date), while new clients can adopt the new
version whenever they're ready.
    `.trim(),
    whyItExists: `
An API is a contract: whoever calls it is trusting that its shape and
behavior won't shift unexpectedly under them. But software still needs
to evolve — fields get renamed, response shapes improve, entire
concepts get restructured. Versioning exists to let evolution and
backward compatibility coexist, so an API owner can improve their
design without holding every past decision hostage forever, and without
breaking clients they don't control or can't instantly force to update.
    `.trim(),
    whenToUse: `
Introduce a new version when you need to make a **breaking** change —
removing a field, changing a field's type or meaning, changing what a
status code represents — to an API that already has external or
independently-deployed consumers.
    `.trim(),
    whenNotToUse: `
Purely additive changes — adding a new optional field, adding a brand
new endpoint — generally don't require a new version at all, since
well-behaved existing clients simply ignore fields they don't recognize.
Versioning everything, even non-breaking changes, adds unnecessary
maintenance overhead.
    `.trim(),
    commonMistakes: [
      "Treating every single change as breaking and creating a new version far more often than necessary.",
      "Introducing a new version but never actually retiring old ones, leaving an ever-growing pile of versions to maintain forever.",
      "Changing an existing version's behavior 'just this once' instead of creating a proper new version, breaking clients who trusted that version to stay stable.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain the difference between a breaking change and a non-breaking change to an API, with one example of each." },
      { difficulty: "Medium", prompt: "Design a /v1/ and /v2/ pair of routes for a `/products/:id` endpoint where v2 adds a new required field that v1 didn't have." },
      { difficulty: "Hard", prompt: "Propose a deprecation plan for retiring an old API version: how would you warn existing clients, and how would you decide when it's finally safe to remove it?" },
    ],
    interviewQuestions: [
      { question: "Why is API versioning necessary?", answer: "Because an API is a contract other systems depend on, and breaking changes to that contract can silently break clients you don't control — versioning lets you evolve the API while keeping existing consumers working." },
      { question: "What's the difference between URL versioning and header versioning?", answer: "URL versioning encodes the version directly in the path (like /v2/users), making it visible and cacheable; header versioning keeps one URL and lets the client specify a version via a request header, keeping URLs stable over time." },
      { question: "Does every change to an API require a new version?", answer: "No — only breaking changes (removing or restructuring existing fields, changing behavior clients rely on) typically require a new version; purely additive changes usually don't." },
    ],
    prerequisites: ["routing", "error-handling-apis"],
    relatedTopics: ["testing-backend-code", "deployment-and-cicd"],
    keywords: ["api versioning", "breaking changes", "backward compatibility"],
  },
  {
    id: "dependency-injection",
    title: "Dependency Injection",
    level: "advanced",
    description: "Handing a function or class the things it needs from outside, rather than letting it create those things itself — making it far easier to swap or test.",
    explanation: `
Imagine a function that sends a welcome email, and inside that function
it directly creates a connection to a real email-sending service. That
seems fine, until you try to write a test for it: every single test run
would actually try to send a real email, hit a real network, and depend
on a real third-party service being up and configured correctly. You
can't easily swap in a fake version, because the function decided, all
by itself, exactly which email service to talk to — and that decision
is buried inside it.

**Dependency injection** flips that: instead of a function or class
creating the things it depends on, those dependencies are handed to it
from the outside — usually as parameters — so whoever is calling it
controls what gets used. In a test, you can hand it a fake, predictable
version of the email service instead of the real one; in production,
you hand it the real one.
    `.trim(),
    analogy:
      "A restaurant kitchen that insists on growing its own vegetables, raising its own chickens, and mining its own salt would be nearly impossible to inspect or adjust. A kitchen that instead receives its ingredients from outside suppliers can easily swap one supplier for another — including, for a health inspection, temporarily swapping in ingredients specifically prepared for testing.",
    examples: [
      {
        title: "Without dependency injection — hard to test",
        code: `const realEmailService = require("./realEmailService");

async function sendWelcomeEmail(user) {
  // The function decides, internally, exactly which service to use
  await realEmailService.send(user.email, "Welcome!");
}`,
        explanation: "This function can only ever use the real email service — there's no way to substitute anything else without editing this file itself.",
      },
      {
        title: "With dependency injection — swappable and testable",
        code: `async function sendWelcomeEmail(user, emailService) {
  await emailService.send(user.email, "Welcome!");
}

// Production
await sendWelcomeEmail(user, realEmailService);

// Test
const fakeEmailService = { send: jest.fn() };
await sendWelcomeEmail(user, fakeEmailService);
expect(fakeEmailService.send).toHaveBeenCalledWith(user.email, "Welcome!");`,
        explanation: "The function no longer decides which email service to use — it just uses whatever is passed in, letting a test supply a fake, observable version instead of touching anything real.",
        walkthrough: [
          { code: "async function sendWelcomeEmail(user, emailService) {", explanation: "emailService arrives as a parameter instead of being created or imported directly inside the function." },
          { code: "await sendWelcomeEmail(user, realEmailService);", explanation: "In production, the caller supplies the real dependency — the function's own code never changes." },
          { code: "const fakeEmailService = { send: jest.fn() };", explanation: "In a test, a lightweight fake stands in for the real service — no network calls, no real emails sent, and its calls can be inspected." },
        ],
      },
    ],
    howItWorks: `
A function or class that needs something (a database connection, an
email service, a clock, a logger) declares that need as a parameter (or
a constructor argument, in an object-oriented style) instead of
constructing or importing it directly inside its own body. Whoever
calls the function — production code, a test, or a wiring layer set up
at app startup — decides what concrete implementation to supply. In
larger applications, a **dependency injection container** can
automate that wiring, but the core idea is the same at any scale: the
dependency comes from outside, not from within.
    `.trim(),
    whyItExists: `
Code that constructs its own dependencies internally is rigid: it can
only ever be tested and run against those exact, real dependencies,
which is often slow, flaky, or outright impossible in a test
environment (you don't want tests actually charging real credit cards).
Dependency injection exists to decouple *what* a piece of code needs
from *which specific implementation* satisfies that need, making code
dramatically easier to test in isolation and to reconfigure without
editing its internals.
    `.trim(),
    whenToUse: `
Reach for dependency injection for anything that talks to the outside
world — databases, external APIs, the filesystem, the current time —
especially in code you want to unit test without those real
dependencies being involved.
    `.trim(),
    whenNotToUse: `
For small, self-contained utility functions with no external
dependencies at all (like a pure function that formats a date), there's
nothing to inject — adding indirection here just adds noise without any
testability benefit.
    `.trim(),
    commonMistakes: [
      "Importing and using a real dependency directly inside a function, then being surprised it's impossible to test in isolation.",
      "Over-engineering dependency injection for simple, pure logic that has no external dependencies to swap in the first place.",
      "Injecting a dependency but still reaching for a global or imported version of it somewhere else in the same code path, defeating the purpose.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Rewrite a function that directly calls `Date.now()` internally so that the current time is instead passed in as a parameter." },
      { difficulty: "Medium", prompt: "Take a function that directly imports and uses a real database client, and refactor it to accept the database client as a parameter instead." },
      { difficulty: "Hard", prompt: "Write a test for a `chargeCustomer(order, paymentService)` function using a fake `paymentService`, and explain what real-world problems that avoids compared to testing against the real payment provider." },
    ],
    interviewQuestions: [
      { question: "What is dependency injection?", answer: "A design approach where a function or class receives the things it depends on from outside — usually as parameters or constructor arguments — instead of creating or importing them internally." },
      { question: "Why does dependency injection make code easier to test?", answer: "Because a test can supply a fake, predictable version of a dependency (like a fake email service or database) instead of the real one, avoiding slow, flaky, or unsafe real-world side effects." },
      { question: "Give an example of a dependency worth injecting rather than hardcoding.", answer: "An external service client (email, payments, a database connection) or even something like the current time — anything that a test would want to replace with a controlled, fake version." },
    ],
    prerequisites: ["error-handling-apis"],
    relatedTopics: ["testing-backend-code"],
    keywords: ["dependency injection", "testability", "inversion of control", "mocking"],
  },
  {
    id: "testing-backend-code",
    title: "Testing Backend Code",
    level: "advanced",
    description: "The difference between checking one small piece of logic in isolation and checking that a real request flows correctly through the whole app.",
    explanation: `
As a backend grows, manually clicking through the app (or firing off
requests by hand) to check that everything still works becomes slower
and less reliable with every new feature. Automated tests exist to do
that checking for you, quickly and repeatedly — but not all tests check
the same thing, or at the same scope.

A **unit test** checks one small, isolated piece of logic — usually a
single function — on its own, often replacing its dependencies with
fakes (see dependency injection) so the test focuses purely on that
one function's behavior. An **integration test** goes further: it
sends a real request through the actual running app — through routing,
middleware, and often a real (or realistic test) database — and checks
that the whole chain produces the right result together.
    `.trim(),
    analogy:
      "A unit test is like testing a single car part on a bench — does this brake pad grip correctly under pressure — in isolation from the rest of the car. An integration test is like taking the whole assembled car out for a test drive: you're no longer checking one part alone, you're checking that the brakes, engine, and steering all work together correctly as a system.",
    examples: [
      {
        title: "A unit test — one function, in isolation",
        code: `function calculateDiscount(price, percentOff) {
  if (percentOff < 0 || percentOff > 100) {
    throw new Error("Invalid discount percentage");
  }
  return price - (price * percentOff) / 100;
}

test("applies a 20% discount correctly", () => {
  expect(calculateDiscount(100, 20)).toBe(80);
});

test("rejects an invalid discount percentage", () => {
  expect(() => calculateDiscount(100, 150)).toThrow();
});`,
        explanation: "This test never starts a server or touches a network — it calls the function directly and checks its return value, making it extremely fast and focused.",
        walkthrough: [
          { code: "function calculateDiscount(price, percentOff) {", explanation: "A small, self-contained piece of logic with no external dependencies — an ideal candidate for a unit test." },
          { code: 'expect(calculateDiscount(100, 20)).toBe(80);', explanation: "Calls the function directly with known input and checks the exact expected output, with nothing else involved." },
          { code: 'expect(() => calculateDiscount(100, 150)).toThrow();', explanation: "Also checks the failure path — that invalid input is rejected the way the function promises to." },
        ],
      },
      {
        title: "An integration test — a real request through the app",
        code: `const request = require("supertest");
const app = require("../app");

test("GET /products/:id returns the requested product", async () => {
  const res = await request(app).get("/products/42");

  expect(res.status).toBe(200);
  expect(res.body).toMatchObject({ id: "42" });
});

test("GET /products/:id returns 404 for a missing product", async () => {
  const res = await request(app).get("/products/does-not-exist");
  expect(res.status).toBe(404);
});`,
        explanation: "This test sends an actual HTTP request through the app's real routing and middleware, checking the full response the way a real client would see it — not just one internal function.",
      },
      {
        title: "The same integration test, in FastAPI with pytest",
        code: `from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_existing_product():
    response = client.get("/products/42")
    assert response.status_code == 200
    assert response.json()["id"] == 42

def test_get_missing_product_returns_404():
    response = client.get("/products/does-not-exist")
    assert response.status_code == 404`,
        language: "python",
        explanation: "TestClient wraps the actual FastAPI app the same way supertest wraps an Express app — it sends real requests through routing, dependencies, and validation, and lets you assert on the real response, without needing a live server running somewhere.",
      },
    ],
    howItWorks: `
Unit tests call a function or method directly, typically supplying
fake versions of any dependencies (see dependency injection) so the
test stays fast, isolated, and unaffected by anything outside that one
function. Integration tests instead run through the app as a whole —
usually by simulating an actual HTTP request against the app's real
routing and middleware, often against a real (but test-only) database —
verifying that all the pieces genuinely work together, not just in
isolation.
    `.trim(),
    whyItExists: `
Unit tests alone can all pass while the app as a whole is still broken
— if two individually-correct functions are wired together incorrectly,
no unit test would catch that. Integration tests alone, meanwhile, are
slower and harder to pinpoint failures in — a single failing integration
test might not tell you exactly which function is at fault. Having both
kinds of tests exists because they catch different classes of problems,
at different speeds, and a healthy test suite typically leans on many
fast unit tests plus a smaller number of integration tests for the
critical paths.
    `.trim(),
    whenToUse: `
Write unit tests for individual pieces of business logic, especially
ones with several branches or edge cases (like a discount calculation
or validation rule). Write integration tests for the critical paths a
real user or client actually exercises end-to-end, like signing up,
logging in, or placing an order.
    `.trim(),
    whenNotToUse: `
Don't write an integration test for something a unit test could check
just as well, more quickly and reliably — spinning up the whole app to
test that a pure calculation function returns the right number is
unnecessary overhead.
    `.trim(),
    commonMistakes: [
      "Writing only unit tests and never verifying that the pieces actually work correctly wired together.",
      "Writing only integration tests, resulting in a slow test suite where a single failure is hard to trace back to its root cause.",
      "Letting integration tests depend on real external services (a real payment provider, a real third-party API) instead of test doubles, making the suite flaky and slow.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a unit test for a `isValidEmail(email)` function, covering both a valid and an invalid case." },
      { difficulty: "Medium", prompt: "Write an integration test for a POST /login route that checks it returns a 200 with valid credentials and a 401 with invalid ones." },
      { difficulty: "Hard", prompt: "Explain a scenario where all unit tests pass but an integration test still fails, and what that reveals about where the bug actually lives." },
    ],
    interviewQuestions: [
      { question: "What's the difference between a unit test and an integration test?", answer: "A unit test checks one isolated piece of logic, usually with fake dependencies; an integration test checks that multiple real pieces of the app — routing, middleware, and often a database — work correctly together." },
      { question: "Why might all unit tests pass while the app is still broken?", answer: "Because unit tests check pieces in isolation — if those pieces are wired together incorrectly, no individual unit test would necessarily catch that, since it isn't a problem with any one piece in isolation." },
      { question: "Why do integration tests typically run slower than unit tests?", answer: "They exercise more of the real system — routing, middleware, and often a real or realistic database — rather than a single function in isolation, so there's more work happening per test." },
    ],
    prerequisites: ["dependency-injection"],
    relatedTopics: ["dependency-injection", "api-versioning", "deployment-and-cicd", "python-web-frameworks"],
    keywords: ["unit testing", "integration testing", "test doubles", "supertest"],
  },
  {
    id: "deployment-and-cicd",
    title: "Deployment & CI/CD Basics",
    level: "advanced",
    description: "What actually happens between pushing a code change and that change running live for real users, at a conceptual level.",
    explanation: `
Writing code that works on your own laptop is only part of the job — it
still needs to get onto a real server somewhere, running in a way real
users can reach, without breaking whatever was already working. Doing
that by hand each time (manually copying files to a server, restarting
things, hoping nothing was forgotten) is slow and error-prone,
especially as a team grows.

**CI/CD** stands for **Continuous Integration** and **Continuous
Deployment** (or **Delivery**). Continuous integration means every code
change is automatically built and tested the moment it's pushed, to
catch problems early rather than after they've piled up. Continuous
deployment (or delivery) means that once a change passes those checks,
it's automatically (or with one click) shipped out to run in
production, following the same repeatable steps every single time.
    `.trim(),
    analogy:
      "Think of an assembly line at a factory versus a single craftsperson manually building one product at a time by hand. The assembly line runs the exact same checks and steps on every single item — the same quality inspection, the same packaging process — every time, catching defects early and shipping consistently, instead of relying on a person to remember every step correctly by hand each time.",
    examples: [
      {
        title: "A CI pipeline definition",
        code: `# .github/workflows/ci.yml (conceptual)
name: CI
on: [push]
jobs:
  test:
    steps:
      - run: npm install
      - run: npm run build
      - run: npm test`,
        language: "yaml",
        explanation: "Every time code is pushed, this pipeline automatically installs dependencies, builds the project, and runs the test suite — without anyone needing to remember to do it manually.",
        walkthrough: [
          { code: "on: [push]", explanation: "Defines the trigger: this pipeline runs automatically every time new code is pushed, with no manual step needed to kick it off." },
          { code: "- run: npm test", explanation: "If any test fails here, the pipeline stops and reports failure — catching a broken change before it ever reaches production." },
        ],
      },
      {
        title: "A deployment step that only runs after tests pass",
        code: `jobs:
  test:
    steps:
      - run: npm test

  deploy:
    needs: test   # only runs if the "test" job succeeded
    steps:
      - run: ./deploy.sh production`,
        language: "yaml",
        explanation: "The deploy job is deliberately gated on the test job succeeding first, so broken code never gets a chance to reach production.",
      },
    ],
    howItWorks: `
When code is pushed, a CI/CD system automatically runs a defined
sequence of steps: installing dependencies, building the project (if
it needs a build step), running the automated test suite, and
sometimes additional checks like linting or security scanning. If every
step succeeds, a deployment step can run: packaging the app (often as a
container image), pushing it to a hosting platform or server, and
switching live traffic over to the new version — ideally with a way to
quickly roll back if something still goes wrong once it's live.
    `.trim(),
    whyItExists: `
Manual deployment is slow, inconsistent, and entirely dependent on a
human remembering every step correctly, every single time — which
inevitably fails as a team and codebase grow. CI/CD exists to make
shipping code a repeatable, automated, and verified process: every
change gets the same checks applied to it, and getting a fix or feature
live becomes fast and low-risk instead of a stressful, manual ritual.
    `.trim(),
    whenToUse: `
Set up CI from the very start of a real project — even a single
automated test run on every push catches obvious mistakes early. Add
continuous deployment once you have enough test coverage and confidence
that a passing pipeline genuinely means the change is safe to ship.
    `.trim(),
    whenNotToUse: `
For a throwaway prototype or a script that will only ever run once,
manually, setting up a full pipeline is unnecessary ceremony — the
investment pays off once code is going to be deployed and iterated on
repeatedly, not for one-off work.
    `.trim(),
    commonMistakes: [
      "Deploying automatically even when tests fail, defeating the entire purpose of having tests gate the pipeline.",
      "Having no way to quickly roll back a bad deployment once it's already live.",
      "Treating a green CI pipeline as proof that everything is fine, when the test suite itself doesn't actually cover the part of the app that broke.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Describe, in order, the steps you'd expect a CI pipeline to run for a typical Node.js backend project." },
      { difficulty: "Medium", prompt: "Explain why a deployment step should be configured to run only after the test step succeeds, and what could go wrong if it wasn't." },
      { difficulty: "Hard", prompt: "Describe a rollback strategy for a deployment that turns out to have a serious bug discovered only after it reached production." },
    ],
    interviewQuestions: [
      { question: "What does CI/CD stand for, and what does each part mean?", answer: "Continuous Integration (automatically building and testing every code change as it's pushed) and Continuous Deployment/Delivery (automatically or reliably shipping a change that passes those checks out to production)." },
      { question: "Why is it important that deployment only happens after tests pass?", answer: "Because it prevents broken or untested code from ever reaching production automatically — the test suite acts as a gate the change must pass first." },
      { question: "Why is manual deployment risky as a team or codebase grows?", answer: "It relies on a person correctly remembering and performing every step every time, which becomes increasingly error-prone and inconsistent as complexity and team size increase." },
    ],
    prerequisites: ["testing-backend-code", "background-jobs"],
    relatedTopics: ["testing-backend-code", "env-vars-and-config"],
    keywords: ["ci/cd", "continuous integration", "continuous deployment", "deployment pipeline"],
  },
  {
    id: "websockets-in-practice",
    title: "Building with WebSockets",
    level: "advanced",
    description: "What actually changes on the server when a connection stays open — handling events, pushing messages, broadcasting, and what happens when a client drops.",
    explanation: `
A WebSocket connection is a real-time, two-way upgrade on top of a
normal HTTP request. You don't need a whole separate subject to work
with one — just a clear picture of a few things that are genuinely
different from a normal request handler: the connection sticks around
instead of closing after one response, either side can send a message
at any moment, and your server code needs to actively track who's
currently connected if it wants to reach more than one client at once.

That means a WebSocket route isn't shaped like \`(req, res) => ...\`
anymore — it's shaped like "a connection just opened, here's what to do
each time a message arrives on it, and here's what to do when it
closes."
    `.trim(),
    analogy:
      "A normal API route is a phone call where you dial, ask one question, get one answer, and hang up. A WebSocket connection is more like a walkie-talkie left on: it stays open, either person can key in and speak whenever they want, and if you want to reach a whole group at once, you have to actually keep a list of everyone whose walkie-talkie is currently on.",
    examples: [
      {
        title: "Connection lifecycle and messages (Node.js, the ws library)",
        code: `const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket) => {
  console.log("client connected");

  socket.on("message", (data) => {
    console.log("received:", data.toString());
    socket.send("ack: " + data.toString());
  });

  socket.on("close", () => {
    console.log("client disconnected");
  });
});`,
        explanation: "This is the whole lifecycle in one place: 'connection' fires once when a client connects, 'message' fires every time that specific client sends something, and 'close' fires once the connection ends — there's no single request/response pair to reason about anymore.",
        walkthrough: [
          { code: 'wss.on("connection", (socket) => {', explanation: "Runs once per client, handing you a socket object scoped to that one connection — everything below is specific to this one client." },
          { code: 'socket.on("message", (data) => {', explanation: "Fires every time this client sends anything, at any point, unprompted — unlike a route handler, this isn't triggered by 'a request coming in' in the usual sense." },
          { code: 'socket.on("close", () => {', explanation: "Fires when the connection ends, whether the client closed it deliberately, lost network access, or crashed — this is where you'd clean up anything tracked for that client." },
        ],
      },
      {
        title: "Broadcasting to every connected client",
        code: `const clients = new Set();

wss.on("connection", (socket) => {
  clients.add(socket);

  socket.on("close", () => clients.delete(socket));

  socket.on("message", (data) => {
    // send this message out to everyone else connected
    for (const client of clients) {
      if (client !== socket && client.readyState === client.OPEN) {
        client.send(data.toString());
      }
    }
  });
});`,
        explanation: "A single socket only knows about itself — reaching every connected client (like a chat room) means the server has to keep its own list of open connections and loop over it, adding and removing entries as clients connect and disconnect.",
      },
      {
        title: "The same lifecycle in FastAPI",
        code: `from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

@app.websocket("/ws")
async def chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"ack: {data}")
    except WebSocketDisconnect:
        print("client disconnected")`,
        language: "python",
        explanation: "await websocket.accept() completes the upgrade, the while True loop plays the same role as the 'message' event in Node (it just runs until the client sends something, over and over), and WebSocketDisconnect is FastAPI's way of surfacing the equivalent of the 'close' event.",
      },
    ],
    howItWorks: `
Once a WebSocket connection is accepted, the server holds it open and
both sides communicate through events rather than a single
request/response pair: a "connected" event, repeated "message" events
in either direction, and a "closed" event. Because the connection has
no built-in concept of "everyone in this chat room," broadcasting is
entirely the server's own responsibility — it has to keep some
in-memory collection of currently-open connections and iterate over it
to reach more than one client.

**Reconnection** is the client's responsibility, not the server's: a
dropped connection (a phone losing signal, a laptop sleeping) just
closes the socket, and a well-behaved client detects that and calls
\`new WebSocket(...)\` again, usually with a short backoff delay, to
reconnect on its own. The server doesn't "resume" an old connection —
it just sees a brand-new one arrive.

**Scaling** is where WebSockets get genuinely harder than a stateless
HTTP API: if a server keeps its list of connected clients only in its
own memory, and you run more than one server instance behind a load
balancer, a message from a client on server A can't reach a client
connected to server B just by looping over server A's local list. That
turns broadcasting into a distribution problem — every server instance
needs to hear about every message, typically by having each instance
publish incoming messages to a shared message broker (like Redis
pub/sub) that every other instance is also subscribed to, and re-send
them to its own locally connected clients.
    `.trim(),
    whyItExists: `
Polling an HTTP endpoint every few seconds to check "did anything
change?" wastes requests on "no" answers and still isn't fast enough for
things that genuinely need to feel instant. WebSockets exist so a
server can push a message the moment something happens, instead of
waiting for the client to ask again.
    `.trim(),
    whenToUse: `
Reach for a WebSocket for chat, live notifications, collaborative
editing, live dashboards, or multiplayer interactions — anything where
the server frequently has something to say before the client asks.
    `.trim(),
    whenNotToUse: `
For data that only changes occasionally, or where a few seconds of
staleness is fine, a normal request (or occasional polling) is far
simpler to build, test, and scale than a WebSocket — don't reach for a
persistent connection just because "real-time" sounds appealing.
    `.trim(),
    commonMistakes: [
      "Forgetting to remove a client from the tracked connections list on 'close'/WebSocketDisconnect, leaking references to dead connections and eventually crashing when the server tries to send to one.",
      "Assuming the server needs to handle reconnection — it doesn't; a dropped connection is just gone, and it's the client's job to detect that and open a new one.",
      "Keeping the list of connected clients only in one server's memory and expecting broadcasts to reach clients connected to a different server instance behind a load balancer.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Using the ws library, write the 'connection' and 'close' handlers needed to log when clients connect and disconnect." },
      { difficulty: "Medium", prompt: "Extend the broadcasting example so a message is echoed back to every connected client, including the sender." },
      { difficulty: "Hard", prompt: "Explain, step by step, why running three instances of the same WebSocket server behind a load balancer breaks naive in-memory broadcasting, and what changes would be needed to fix it." },
    ],
    interviewQuestions: [
      { question: "Why does broadcasting a message to all connected clients require extra work on the server, when a socket already exists for each client?", answer: "Each socket only knows about its own single connection — reaching every client requires the server to maintain its own collection of currently-open connections and iterate over it." },
      { question: "Whose responsibility is reconnection — the client's or the server's?", answer: "The client's — a dropped connection simply closes, and a well-behaved client detects that and opens a brand-new connection, typically with a short backoff delay." },
      { question: "Why does scaling WebSockets across multiple server instances complicate broadcasting?", answer: "Because each instance only knows about the clients connected directly to it, a message from a client on one instance can't reach a client on another instance without some shared mechanism (like a pub/sub message broker) that every instance subscribes to." },
    ],
    prerequisites: ["routing", "background-jobs"],
    relatedTopics: ["routing", "middleware", "background-jobs"],
    keywords: ["WebSocket", "real-time", "broadcasting", "reconnection", "scaling", "pub/sub", "ws", "connection lifecycle"],
  },
];
