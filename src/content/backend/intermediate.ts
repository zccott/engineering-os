import type { Topic } from "../../types/content";

export const backendIntermediateTopics: Topic[] = [
  {
    id: "env-vars-and-config",
    title: "Environment Variables & Config",
    level: "intermediate",
    description: "Keeping secrets and settings that differ between environments out of your code, so the same code can run safely in development, testing, and production.",
    explanation: `
A backend needs to know things like which database to connect to, what
API key to use for sending emails, and whether it's running in
development or production. It's tempting to just write those values
directly into the code — but that causes real problems: a secret key
written into a file gets committed to version control for anyone with
repo access to see, and a database address hardcoded for your laptop
breaks the moment the same code runs on a production server.

**Environment variables** are values set outside the code, in the
environment the program runs in, and read by the program at startup.
Instead of writing the actual value in your source file, you write code
that asks "whatever the environment says this value is" — and each
environment (your laptop, a staging server, production) can supply a
different answer.
    `.trim(),
    analogy:
      "Think of a recipe that says 'add the number of servings you need' instead of hardcoding 'serves 4.' The same recipe card works whether you're cooking for 2 people or 20 — you just supply a different number depending on the situation, without editing the recipe itself.",
    examples: [
      {
        title: "Reading configuration from the environment",
        code: `// .env file (never committed to version control)
DATABASE_URL=postgres://localhost:5432/myapp_dev
STRIPE_SECRET_KEY=sk_test_abc123
PORT=3000

// app.js
require("dotenv").config();

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;

app.listen(port, () => console.log(\`Listening on \${port}\`));`,
        explanation: "The actual secret values live in a .env file that's excluded from version control, while the code just refers to process.env.DATABASE_URL by name.",
        walkthrough: [
          { code: 'require("dotenv").config();', explanation: "Loads key-value pairs from a .env file into process.env when the app starts, so local development can simulate real environment variables." },
          { code: "process.env.PORT || 3000", explanation: "Reads the PORT variable from the environment, falling back to a sensible default if it isn't set." },
          { code: "process.env.DATABASE_URL", explanation: "The database connection string lives outside the codebase entirely — different environments supply different values." },
        ],
      },
      {
        title: "Switching behavior per environment",
        code: `const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.use(compressionMiddleware());
  logger.level = "warn";
} else {
  logger.level = "debug";
}`,
        explanation: "A single environment variable, NODE_ENV, lets the exact same code file behave differently depending on where it's deployed.",
      },
    ],
    howItWorks: `
Environment variables are set at the operating system or process level
— outside of your source code entirely. In production, a hosting
platform typically lets you set them through a dashboard or config file
that's separate from your codebase. In local development, a \`.env\` file
combined with a small library (like \`dotenv\`) simulates that same
mechanism by loading values into \`process.env\` when the app starts. Your
code then reads from \`process.env\` rather than containing the literal
values.
    `.trim(),
    whyItExists: `
Secrets committed to source control stay in that repository's history
forever, even if you delete them later — a serious security risk if the
repo is ever exposed. Separately, the same code genuinely needs
different settings in different places (a local database versus a
production one). Environment variables solve both problems at once:
secrets stay out of the codebase, and configuration becomes swappable
per environment without touching a single line of code.
    `.trim(),
    whenToUse: `
Use environment variables for anything that's either sensitive (API
keys, database credentials, tokens) or that legitimately differs between
environments (a port number, a feature flag, which environment the app
thinks it's running in).
    `.trim(),
    whenNotToUse: `
Values that never change and aren't sensitive — like the name of a
constant used only inside a single calculation — don't need to be
environment variables; that just adds indirection for no benefit. Keep
genuine constants as regular code.
    `.trim(),
    commonMistakes: [
      "Committing a real `.env` file (with actual secrets) to version control instead of adding it to `.gitignore`.",
      "Forgetting to set a required environment variable in production, causing the app to crash or silently misbehave.",
      "Hardcoding a fallback secret value directly in code 'just for now' and forgetting to remove it before shipping.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Move a hardcoded database URL out of a source file and into a `.env` file, reading it via `process.env`." },
      { difficulty: "Medium", prompt: "Write code that uses `NODE_ENV` to log at 'debug' level in development and 'error' level in production." },
      { difficulty: "Hard", prompt: "Explain what could go wrong if a required environment variable is missing in production, and how you'd make the app fail loudly instead of silently at startup." },
    ],
    interviewQuestions: [
      { question: "What are environment variables and why are they used?", answer: "Configuration values supplied by the environment a program runs in rather than hardcoded in source — used to keep secrets out of the codebase and to let the same code adapt to different environments." },
      { question: "Why shouldn't secrets be committed to version control?", answer: "Because they remain in the repository's history indefinitely, even after later removal, and anyone with repo access (now or in the future) could see them." },
      { question: "What's the role of a `.env` file in local development?", answer: "It simulates real environment variables locally by defining key-value pairs that a library like dotenv loads into process.env at startup, without those secrets living in the actual source code." },
    ],
    prerequisites: ["request-response-lifecycle"],
    relatedTopics: ["error-handling-apis", "deployment-and-cicd"],
    keywords: ["environment variables", "dotenv", "process.env", "configuration", "secrets"],
  },
  {
    id: "error-handling-apis",
    title: "Error Handling in APIs",
    level: "intermediate",
    description: "Catching errors in one central place and returning consistent, safe responses, instead of letting the server crash or leak internal details to callers.",
    explanation: `
Things go wrong constantly in a running backend: a database might be
temporarily unreachable, a client might send malformed data, a bug
might cause an unexpected exception deep inside some function. If
nothing catches these problems, a few bad outcomes can happen — the
whole server process can crash, taking down every other request it was
handling too, or the raw error (possibly including a stack trace or
internal file paths) can leak straight back to whoever made the
request, which is both unhelpful and a security risk.

**Centralized error handling** means having one place — usually a
special piece of middleware — that catches errors from anywhere in the
app and turns them into a consistent, safe response shape, so every
route doesn't need to duplicate that logic itself.
    `.trim(),
    analogy:
      "It's like having one dedicated customer service desk at the back of a large store, instead of expecting every single cashier to personally know how to handle every possible complaint. Whatever goes wrong anywhere in the store, it gets routed to that one desk, which knows how to respond consistently and politely, without exposing the store's internal problems to the customer.",
    examples: [
      {
        title: "A route that forwards its errors instead of crashing",
        code: `app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await db.users.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err); // hand off to centralized error-handling middleware
  }
});`,
        explanation: "Rather than letting a thrown database error crash the process, the route catches it and passes it along to a dedicated error handler.",
        walkthrough: [
          { code: "try {", explanation: "Wraps the risky work — anything that might throw, like a database call — so failures don't escape uncontrolled." },
          { code: 'return res.status(404).json({ error: "User not found" });', explanation: "A 'known' failure case (no such user) is handled directly here with a clear, expected response." },
          { code: "next(err);", explanation: "An 'unknown' failure (a thrown exception) is passed on, by convention, to Express's error-handling middleware rather than handled locally." },
        ],
      },
      {
        title: "Centralized error-handling middleware",
        code: `app.use((err, req, res, next) => {
  console.error(err); // log the full details internally
  res.status(err.statusCode || 500).json({
    error: "Something went wrong. Please try again.",
  });
});`,
        explanation: "This special four-argument middleware is Express's designated way to catch errors passed via next(err) from anywhere in the app, logging the full detail internally while sending a safe, generic message to the caller.",
      },
    ],
    howItWorks: `
Frameworks like Express recognize a middleware function by its number
of arguments: a normal middleware takes \`(req, res, next)\`, while an
error-handling one takes \`(err, req, res, next)\` — four arguments. When
any route or middleware calls \`next(err)\` (passing something to
\`next\`), Express skips ahead past all remaining normal middleware and
routes, straight to the nearest error-handling middleware. That's where
you decide what to log internally and what safe message to send back.
    `.trim(),
    whyItExists: `
Without centralized handling, every single route would need its own
copy-pasted logic for catching errors, deciding on status codes, and
avoiding leaking internal details — and it's easy to forget one spot,
leaving a crash or a leak waiting to happen. Centralizing it guarantees
one consistent policy applies everywhere, and makes it much harder to
accidentally expose a stack trace to a real user.
    `.trim(),
    whenToUse: `
Add centralized error handling to essentially every real backend
project, from the start — it's cheap to set up early and expensive to
retrofit once dozens of routes already handle errors inconsistently.
    `.trim(),
    whenNotToUse: `
It doesn't replace handling *expected* failure cases close to where
they happen — a missing record (404) or invalid input (400) usually
deserves its own specific, immediate response rather than being funneled
through the generic error handler meant for unexpected failures.
    `.trim(),
    commonMistakes: [
      "Sending the raw error object (including its stack trace) directly to the client in a production response.",
      "Forgetting to call `next(err)` inside an async route, so a thrown error is never caught and the process may crash.",
      "Treating every failure the same way instead of distinguishing expected failures (bad input, missing resource) from truly unexpected ones (a bug, a downed dependency).",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write a route that catches a thrown error and forwards it to `next(err)` instead of letting it crash the server." },
      { difficulty: "Medium", prompt: "Write centralized error-handling middleware that logs the full error internally but returns only a generic message and status code to the client." },
      { difficulty: "Hard", prompt: "Design an error-handling scheme that distinguishes 'expected' errors (like validation failures, with a custom `statusCode`) from truly unexpected ones, and returns different levels of detail for each." },
    ],
    interviewQuestions: [
      { question: "Why is centralized error handling important in an API?", answer: "It ensures errors are handled consistently everywhere, prevents unhandled exceptions from crashing the server, and avoids leaking sensitive internal details like stack traces to clients." },
      { question: "How does Express know a middleware function is meant for error handling?", answer: "By its signature — an error-handling middleware takes four arguments, (err, req, res, next), instead of the usual three." },
      { question: "What's the difference between an expected error and an unexpected one in API design?", answer: "An expected error (like invalid input or a missing resource) is handled explicitly with a clear status and message; an unexpected error (a bug or crash) is caught generically, logged in detail, and reported to the client with a safe, non-revealing message." },
    ],
    prerequisites: ["middleware", "env-vars-and-config"],
    relatedTopics: ["middleware", "validation-and-sanitization", "logging"],
    keywords: ["error handling", "next(err)", "status codes", "try/catch"],
  },
  {
    id: "validation-and-sanitization",
    title: "Validation & Sanitization",
    level: "intermediate",
    description: "Checking that incoming data is well-formed and expected before your code uses it, and cleaning up anything unsafe it might contain.",
    explanation: `
A backend can never fully trust the data that arrives in a request —
even from your own frontend, because a request can be sent by anyone,
using anything, not just the app you built. A field you expect to be a
number might arrive as text; a required field might be missing
entirely; a text field might contain something malicious, like a chunk
of HTML or a database command hidden inside a name field.

**Validation** is the process of checking that incoming data matches
what your code expects — the right fields are present, and they're the
right type and shape — before you act on it. **Sanitization** goes a
step further: actively cleaning or transforming data to strip out
anything unsafe (like stripping HTML tags from a comment field) rather
than just rejecting it outright.
    `.trim(),
    analogy:
      "Think of a bouncer at a club checking IDs at the door (validation — rejecting anyone who doesn't meet the requirements) versus a coat check that removes anything dangerous from a bag before letting it inside (sanitization — cleaning up what's allowed to pass through, rather than turning it away entirely).",
    examples: [
      {
        title: "Manual validation before using data",
        code: `app.post("/signup", (req, res) => {
  const { email, age } = req.body;

  if (typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (typeof age !== "number" || age < 13) {
    return res.status(400).json({ error: "Invalid age" });
  }

  createUser({ email, age });
  res.status(201).json({ ok: true });
});`,
        explanation: "The route refuses to even attempt to create a user until it's confirmed the incoming data looks the way it's supposed to.",
        walkthrough: [
          { code: '!email.includes("@")', explanation: "A simple, deliberately basic check — real apps typically use a proper email-validation rule or library, but the idea is the same: reject shapes that can't be right." },
          { code: "typeof age !== \"number\"", explanation: "Confirms the field is actually the type the rest of the code assumes it is, before doing arithmetic or comparisons on it." },
          { code: 'return res.status(400).json({ error: "Invalid age" });', explanation: "Stops processing immediately and tells the caller exactly what was wrong, rather than continuing with bad data." },
        ],
      },
      {
        title: "Using a validation library for a declarative schema",
        code: `const { z } = require("zod");

const signupSchema = z.object({
  email: z.string().email(),
  age: z.number().min(13),
});

app.post("/signup", (req, res) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  createUser(result.data);
  res.status(201).json({ ok: true });
});`,
        explanation: "Instead of hand-writing every check, a schema declares the expected shape once, and the library validates the incoming data against it in one call.",
      },
    ],
    howItWorks: `
Validation typically runs early — often as middleware, before a route's
main logic — comparing incoming data (the body, query string, or route
parameters) against a set of rules: is this field present, is it the
right type, does it fall within an allowed range or set of values. If
the data fails, the request is rejected immediately with a clear error,
before touching a database or running business logic. Sanitization
similarly runs early, but transforms the data (trimming whitespace,
escaping special characters, removing disallowed HTML) rather than
outright rejecting it.
    `.trim(),
    whyItExists: `
Trusting incoming data blindly leads to two classes of problems:
ordinary bugs (a function crashes because a field it expected to be a
number was actually text) and security vulnerabilities (an attacker
deliberately sends specially crafted data to manipulate a database
query or inject a malicious script that other users will later see).
Validation and sanitization exist to catch both at the door, before bad
data can do any damage deeper in the system.
    `.trim(),
    whenToUse: `
Validate and sanitize any data that arrives from outside your own
trusted backend code — request bodies, query strings, route parameters,
uploaded file names — especially before that data touches a database,
gets rendered back into a webpage, or gets used to construct a file
path.
    `.trim(),
    whenNotToUse: `
Data your own backend code generated internally and never exposed to
outside input doesn't need the same scrutiny — re-validating data you
already fully control adds unnecessary overhead without any real safety
benefit.
    `.trim(),
    commonMistakes: [
      "Validating only on the frontend and assuming the backend never needs to check the same data again.",
      "Checking that a field merely exists, without checking its type or shape, letting malformed data slip through.",
      "Confusing validation (rejecting bad data) with sanitization (cleaning it up) and using only one when the situation calls for both.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write validation for a POST /login route that requires both `username` and `password` to be non-empty strings." },
      { difficulty: "Medium", prompt: "Add a check that rejects a `signup` request if the `age` field is present but not a positive number." },
      { difficulty: "Hard", prompt: "Explain the difference between rejecting a comment containing HTML tags (validation) and stripping the HTML tags out before saving it (sanitization), and describe a situation where each is the right choice." },
    ],
    interviewQuestions: [
      { question: "What's the difference between validation and sanitization?", answer: "Validation checks that data meets expected rules and rejects it if not; sanitization actively cleans or transforms data to remove unsafe parts, rather than outright rejecting it." },
      { question: "Why can't you rely solely on frontend validation?", answer: "A request can be sent by anything, not just your own frontend — a malicious or buggy client can bypass frontend checks entirely, so the backend must validate independently." },
      { question: "Why is validating data early in the request lifecycle useful?", answer: "It stops bad data before it reaches business logic or a database, preventing crashes and security issues rather than discovering them deeper in the system." },
    ],
    prerequisites: ["error-handling-apis"],
    relatedTopics: ["error-handling-apis", "file-uploads"],
    keywords: ["validation", "sanitization", "schema validation", "input validation"],
  },
  {
    id: "file-uploads",
    title: "File Uploads",
    level: "intermediate",
    description: "How a server receives a file sent from a form or client, at a conceptual level — and what happens to it once it arrives.",
    explanation: `
Most data a backend receives is simple text — JSON objects with strings
and numbers. But sometimes a client needs to send an actual file: a
profile picture, a PDF, a spreadsheet. Files are binary data, often
large, and usually accompanied by other regular form fields (like a
caption or a category) in the same request — which raw JSON isn't well
suited to carrying alongside binary content.

To handle this, browsers and servers use a request format called
**multipart form data**, which packages one or more files together with
regular fields into a single request, each part clearly separated and
labeled. On the server, a small library (like \`multer\` in the Node.js
world) unpacks that multipart request, saving each file somewhere (disk,
memory, or straight to cloud storage) and making its details available
to your route handler.
    `.trim(),
    analogy:
      "A multipart form-data request is like a padded envelope containing several separately wrapped items — a letter (a text field), a photo (a file), and a receipt (another field) — each clearly labeled, so the person opening it (the server) can tell exactly what each piece is and handle it appropriately, rather than receiving one big unlabeled blob.",
    examples: [
      {
        title: "Accepting a single file upload with multer",
        code: `const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.post("/profile-picture", upload.single("avatar"), (req, res) => {
  console.log(req.file);   // { filename, path, size, mimetype, ... }
  console.log(req.body);   // any other regular form fields sent alongside it
  res.json({ url: \`/uploads/\${req.file.filename}\` });
});`,
        explanation: "multer runs as middleware, intercepting the multipart request, saving the uploaded file to disk, and attaching its details to req.file before the route handler ever runs.",
        walkthrough: [
          { code: 'multer({ dest: "uploads/" })', explanation: "Configures where uploaded files should be temporarily or permanently stored on disk." },
          { code: 'upload.single("avatar")', explanation: "Middleware that expects exactly one file, sent under the field name 'avatar', matching whatever name the client's form used." },
          { code: "req.file", explanation: "After the middleware runs, the route handler can read details about the uploaded file — its saved path, size, and original name." },
        ],
      },
      {
        title: "Validating an upload before accepting it",
        code: `const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg"];
    cb(null, allowed.includes(file.mimetype));
  },
});`,
        explanation: "Restricting file size and type at the upload layer prevents huge or unexpected files from ever reaching your application logic or storage.",
      },
    ],
    howItWorks: `
When a form is submitted with a file, the browser encodes the request
body as \`multipart/form-data\` instead of plain JSON: the body is split
into distinct sections, each with its own small header describing
whether it's a regular field or a file, and — for files — its original
name and content type. On the server, an upload-handling library reads
that multipart body, extracts each file's raw bytes, writes them
somewhere (a temp folder, then often onward to permanent or cloud
storage), and populates \`req.file\` (or \`req.files\`) with metadata your
route can use, while regular fields land in \`req.body\` as usual.
    `.trim(),
    whyItExists: `
Plain JSON bodies are text-based and not designed to efficiently carry
large binary data alongside other fields. Multipart form data exists as
a standard way to bundle files and regular form fields together in one
request, and libraries like multer exist so that every project doesn't
need to hand-write multipart parsing from scratch.
    `.trim(),
    whenToUse: `
Reach for multipart file uploads whenever a user needs to send an
actual file — images, documents, videos — rather than just structured
text data.
    `.trim(),
    whenNotToUse: `
If a client only needs to reference an already-hosted file (a URL to an
image already uploaded elsewhere) or send small amounts of encoded
binary data, plain JSON with a base64-encoded string can be simpler —
though it's less efficient for large files.
    `.trim(),
    commonMistakes: [
      "Not limiting file size or type, allowing huge or unexpected files to exhaust server disk space or memory.",
      "Storing uploaded files directly inside the app's own codebase directory instead of separate, dedicated storage.",
      "Trusting the client-reported file extension or MIME type as proof of what the file actually contains.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Set up a route that accepts a single file upload under the field name 'document' and returns its saved filename." },
      { difficulty: "Medium", prompt: "Add a file size limit of 5MB and reject any upload exceeding it with a clear error message." },
      { difficulty: "Hard", prompt: "Explain why trusting a file's declared MIME type alone isn't sufficient to guarantee it's actually a safe image file, and describe one additional check you could add." },
    ],
    interviewQuestions: [
      { question: "What is multipart form data and why is it used for file uploads?", answer: "A request format that bundles files and regular form fields together, each clearly separated and labeled, since plain JSON isn't well suited to carrying large binary content alongside text fields." },
      { question: "What role does a library like multer play in handling uploads?", answer: "It parses the incoming multipart request, extracts uploaded files, saves them (to disk, memory, or onward to cloud storage), and exposes their metadata to the route handler via req.file or req.files." },
      { question: "Why should you limit file size and validate file type on the server, not just the frontend?", answer: "Because a request can bypass the frontend entirely, so limits enforced only there provide no real protection against oversized or malicious uploads." },
    ],
    prerequisites: ["validation-and-sanitization"],
    relatedTopics: ["validation-and-sanitization", "logging"],
    keywords: ["file upload", "multipart form data", "multer", "binary data"],
  },
  {
    id: "logging",
    title: "Logging",
    level: "intermediate",
    description: "Recording what a running server is doing in a structured, searchable way, so problems can be understood after the fact instead of only while watching a terminal.",
    explanation: `
While you're actively developing, a stray \`console.log\` is often enough
to see what's happening — you're watching the terminal right there. But
a real production server runs unattended, often across multiple
machines, for weeks at a time, handling requests you'll never
personally watch happen. When something goes wrong at 3 AM, you need a
record of what the server was doing at that moment — not to have been
standing there watching.

**Logging** is the practice of deliberately recording events as a
server runs — a request came in, a database call took 400ms, a payment
failed — usually as structured, timestamped entries with a **severity
level** (like \`debug\`, \`info\`, \`warn\`, \`error\`) attached, and often sent
somewhere searchable rather than just printed to a terminal that
disappears when the process restarts.
    `.trim(),
    analogy:
      "console.log is like shouting something out loud in an empty room — useful if you happen to be standing there listening at that exact moment, but gone forever otherwise. Structured logging is like a ship's logbook: every entry is timestamped, labeled by importance, and kept in a permanent, searchable record that anyone can review later, even long after the moment has passed.",
    examples: [
      {
        title: "Ad-hoc console.log vs. structured logging",
        code: `// Ad-hoc — fine for local debugging, poor for production
console.log("user logged in", userId);

// Structured — with a logging library like winston or pino
logger.info("user_login", { userId, ip: req.ip, timestamp: Date.now() });`,
        explanation: "The structured version attaches a severity level, a machine-readable event name, and consistent fields, making it possible to filter and search logs later rather than parsing free-form text.",
        walkthrough: [
          { code: 'console.log("user logged in", userId);', explanation: "Only visible in whatever terminal or console the process happens to be attached to, in an inconsistent, hard-to-search text format." },
          { code: 'logger.info("user_login", { userId, ip: req.ip, ... })', explanation: "Uses a named severity level (info) so later filtering can show only warnings and errors, ignoring routine noise." },
          { code: "{ userId, ip: req.ip, timestamp: Date.now() }", explanation: "Structured, consistent fields (rather than a free-form sentence) make it possible to search or aggregate logs — e.g., 'show me all logins from this IP.'" },
        ],
      },
      {
        title: "Logging at different severity levels",
        code: `logger.debug("cache lookup", { key: cacheKey });      // routine, verbose detail
logger.info("order created", { orderId });             // normal operation
logger.warn("payment retry", { orderId, attempt: 2 });  // recoverable issue
logger.error("payment failed", { orderId, err });       // needs attention`,
        explanation: "Severity levels let you dial the verbosity up or down per environment — full detail in development, only warnings and errors in production — without changing the logging calls themselves.",
      },
    ],
    howItWorks: `
A logging library gives you methods for each severity level (\`debug\`,
\`info\`, \`warn\`, \`error\`) instead of one flat \`console.log\`. Each call
records a structured entry — typically including a timestamp, the
level, a message, and any extra data you attach — and sends it to one
or more destinations: the terminal during development, and often a
file or an external logging service in production, where entries from
many server instances can be searched and monitored together. A
configured minimum level (like "only info and above") controls which
calls actually get recorded in a given environment.
    `.trim(),
    whyItExists: `
Production problems are almost never diagnosed live — they're
investigated after the fact, often much later, by someone who wasn't
watching the server when the problem happened. Logging exists to leave
behind a durable, searchable trail of what the system was doing, so
that trail can answer questions no one thought to ask in the moment.
    `.trim(),
    whenToUse: `
Log meaningful events: requests, errors, retries, and any decision
point useful for understanding behavior later — especially around
payments, authentication, and anything involving external services that
can fail.
    `.trim(),
    whenNotToUse: `
Don't log extremely high-frequency, low-value events at a verbose level
in production (logging every single cache hit, for instance) — it
drowns out the signal you actually need and can itself become a
performance or cost problem.
    `.trim(),
    commonMistakes: [
      "Logging sensitive data — passwords, full credit card numbers, tokens — directly into logs where they can be seen or leaked.",
      "Using one severity level (usually everything as `console.log`) for everything, making it impossible to filter noise from real problems.",
      "Relying only on logs that live in a terminal or a single server's disk, which disappear when that specific process or machine goes away.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Replace three `console.log` calls in a small Express app with structured `logger.info` calls that include relevant context data." },
      { difficulty: "Medium", prompt: "Add a `logger.error` call inside a catch block that records the error and the request path, without leaking the raw error to the client's response." },
      { difficulty: "Hard", prompt: "Explain why logging a user's raw password would be a serious mistake even if the log file itself is 'internal only,' and describe a safer alternative." },
    ],
    interviewQuestions: [
      { question: "Why is structured logging preferred over ad-hoc console.log statements in production?", answer: "Structured logs are timestamped, leveled, and machine-readable, making them searchable and filterable after the fact, and persist beyond a single terminal session." },
      { question: "What are severity levels in logging, and why do they matter?", answer: "Levels like debug, info, warn, and error indicate how important a log entry is, letting you control verbosity per environment — for example, showing full detail in development but only warnings and errors in production." },
      { question: "What kind of data should never be written to logs?", answer: "Sensitive information such as passwords, full payment card numbers, or authentication tokens, since logs can be read by more people or systems than the original data was meant for." },
    ],
    prerequisites: ["error-handling-apis"],
    relatedTopics: ["error-handling-apis", "background-jobs"],
    keywords: ["logging", "log levels", "structured logging", "observability"],
  },
  {
    id: "background-jobs",
    title: "Background Jobs",
    level: "intermediate",
    description: "Running work outside the normal request/response cycle, so a slow task doesn't force a user to sit and wait for it to finish.",
    explanation: `
Some work a backend needs to do simply doesn't fit neatly inside the
short window of a single request. Sending a confirmation email,
resizing an uploaded image, generating a large report, or running a
nightly cleanup of old records can take seconds, minutes, or longer —
far longer than a user should reasonably wait staring at a spinner for
a response.

**Background jobs** are units of work that run outside the normal
request/response cycle: instead of doing the slow work immediately and
making the user wait for it, the server quickly acknowledges the
request and hands the actual work off to run separately — either right
away in the background, on a **queue** processed by separate worker
processes, or later on a **schedule** (like "every night at 2 AM").
    `.trim(),
    analogy:
      "A restaurant doesn't make you stand at the counter until your food is ready — it takes your order, gives you a buzzer, and lets you sit down while the kitchen (a background worker) prepares the meal separately. You get an immediate acknowledgment ('order received') without blocking on the actual, slower work.",
    examples: [
      {
        title: "Handing off slow work to a queue",
        code: `app.post("/signup", async (req, res) => {
  const user = await createUser(req.body);

  // Instead of sending the email right here and making the user wait...
  await emailQueue.add("welcome-email", { userId: user.id });

  res.status(201).json({ ok: true }); // responds immediately
});

// Elsewhere: a separate worker process consumes the queue
emailQueue.process("welcome-email", async (job) => {
  const user = await db.users.findById(job.data.userId);
  await sendEmail(user.email, "Welcome!");
});`,
        explanation: "The request handler stays fast because it only enqueues the job — the actual, slower email-sending work happens separately, in a worker process, without the user ever waiting on it.",
        walkthrough: [
          { code: 'await emailQueue.add("welcome-email", { userId: user.id });', explanation: "Puts a small description of the work onto a queue almost instantly — it doesn't actually send the email itself." },
          { code: "res.status(201).json({ ok: true });", explanation: "The response goes out right away, since the slow part has been handed off rather than performed inline." },
          { code: 'emailQueue.process("welcome-email", async (job) => {', explanation: "A separate worker, running independently of the web server, picks up queued jobs and does the actual slow work whenever it gets to them." },
        ],
      },
      {
        title: "A scheduled background job",
        code: `const cron = require("node-cron");

// Runs automatically every day at 2:00 AM, with no request involved at all
cron.schedule("0 2 * * *", async () => {
  await deleteExpiredSessions();
  logger.info("cleanup_complete");
});`,
        explanation: "This job isn't triggered by any user request at all — it runs on a fixed schedule, entirely independent of the request/response cycle.",
      },
    ],
    howItWorks: `
Rather than doing slow work inline, a request handler records that the
work needs to happen — often by pushing a small message describing the
job onto a **queue** (backed by something like Redis) — and immediately
returns a response. One or more separate **worker** processes
continuously watch that queue, pick up jobs as they arrive, and do the
actual work, independently of any specific web request. Scheduled jobs
work similarly but are triggered by a timer (a cron schedule) rather
than an event, running on their own regardless of whether any request
happens at all.
    `.trim(),
    whyItExists: `
If every request had to fully complete every piece of related work
before responding, slow operations would make the whole app feel
unresponsive, and a spike in slow work (like a burst of signups all
needing welcome emails) could overwhelm the web server itself.
Background jobs exist to decouple "acknowledge the request quickly"
from "actually get the slow work done," and to let that work be scaled,
retried, and monitored independently of the web servers handling live
traffic.
    `.trim(),
    whenToUse: `
Use background jobs for anything slow, non-essential to the immediate
response, or safely retryable: sending emails, processing images,
generating reports, syncing with third-party services, or any
scheduled, recurring maintenance task.
    `.trim(),
    whenNotToUse: `
If the user genuinely needs the result of the work before you can
respond meaningfully (like a login endpoint that must confirm the
password matches before saying 'success'), that work belongs inline in
the request, not deferred to a background job.
    `.trim(),
    commonMistakes: [
      "Putting genuinely time-sensitive work (like checking a password) into a background job, when the request truly can't respond correctly without its result.",
      "Not handling job failures — a queued job that silently fails with no retry or alert can quietly drop real work (like a never-sent email).",
      "Assuming a background job that succeeded once will always succeed, without planning for retries when a dependency (like an email provider) is temporarily down.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Identify which of the following belongs in a background job and which belongs inline in a request: validating a login password, sending a password-reset email, resizing a profile photo." },
      { difficulty: "Medium", prompt: "Sketch the shape of a signup endpoint that enqueues a welcome email job instead of sending the email inline, and explain why that keeps the endpoint fast." },
      { difficulty: "Hard", prompt: "Describe what should happen if a background job that sends a confirmation email fails partway through, and how you'd make sure the email eventually still gets sent." },
    ],
    interviewQuestions: [
      { question: "What is a background job and why would you use one?", answer: "Work performed outside the normal request/response cycle — used for slow or non-essential tasks so the user isn't forced to wait for them before getting a response." },
      { question: "What's the difference between a queued job and a scheduled job?", answer: "A queued job is triggered by an event (like a user signing up) and processed by a worker as soon as it can; a scheduled job runs automatically on a fixed timer, independent of any specific request." },
      { question: "Why shouldn't login password verification be handled as a background job?", answer: "Because the request genuinely needs the result immediately to decide how to respond — deferring it would mean the server couldn't tell the user whether login succeeded." },
    ],
    prerequisites: ["logging"],
    relatedTopics: ["logging", "deployment-and-cicd"],
    keywords: ["background jobs", "queue", "worker", "cron", "async processing"],
  },
  {
    id: "connecting-to-a-database",
    title: "Connecting to a Database",
    level: "intermediate",
    description: "The different ways backend code can talk to a database — raw drivers, query builders, and ORMs — and how a connection is actually established.",
    explanation: `
Your application code and your database are two separate programs, so
they need a way to actually talk to each other. That happens over a
network connection (even if the database is on the same machine), using
a **connection string** that packs together everything needed to reach
it: the host, port, username, password, and database name — something
like \`postgres://user:pass@localhost:5432/mydb\`.

On top of that raw connection, you have a choice of how directly you
want to write SQL: a **driver** (like \`pg\` in Node or \`psycopg2\` in
Python) sends SQL strings and hands back rows, giving you full control.
A **query builder** (like Knex, or SQLAlchemy Core) lets you construct
queries with function calls that still map closely to SQL. An **ORM**
(like Prisma, Sequelize, or SQLAlchemy's ORM layer) goes further,
letting you work with rows as objects and generating the SQL for you.
    `.trim(),
    analogy:
      "A raw driver is like speaking directly to a bank teller in exact banking terminology. A query builder is like filling out a structured form that still asks for the same specific details. An ORM is like using the bank's app, where you tap 'send money' and it handles the paperwork underneath without you thinking about it — convenient, but you have less control over exactly what happens.",
    examples: [
      {
        title: "A connection string and a raw query",
        code: `const { Pool } = require("pg");

// postgres://user:password@localhost:5432/mydb
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const result = await pool.query(
  "SELECT * FROM users WHERE id = $1",
  [userId]
);
console.log(result.rows);`,
        explanation: "The connection string tells the driver exactly where and how to connect; the query itself is plain SQL, with $1 as a safe placeholder for the actual value.",
        walkthrough: [
          { code: "new Pool({ connectionString: ... })", explanation: "Opens (and manages, over time) the actual network connection(s) to the database, using credentials read from an environment variable rather than hardcoded." },
          { code: 'pool.query("SELECT * FROM users WHERE id = $1", [userId])', explanation: "Sends the SQL text and the value separately — the driver safely substitutes $1, avoiding the risk of building SQL by string concatenation." },
          { code: "result.rows", explanation: "The driver parses the database's raw response into plain JavaScript objects you can use directly." },
        ],
      },
      {
        title: "The same query at three levels of abstraction",
        code: `// Raw driver
await pool.query("SELECT * FROM users WHERE active = $1", [true]);

// Query builder (Knex)
await knex("users").where({ active: true });

// ORM (Prisma)
await prisma.user.findMany({ where: { active: true } });`,
        explanation: "All three end up running equivalent SQL — they differ only in how much of the SQL you write by hand versus how much the library generates for you.",
      },
      {
        title: "Full CRUD through a raw driver, inside route handlers",
        code: `// Create
app.post("/users", async (req, res) => {
  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [req.body.name, req.body.email]
  );
  res.status(201).json(result.rows[0]);
});

// Read
app.get("/users/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: "not found" });
  res.json(result.rows[0]);
});

// Update
app.put("/users/:id", async (req, res) => {
  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [req.body.name, req.body.email, req.params.id]
  );
  res.json(result.rows[0]);
});

// Delete
app.delete("/users/:id", async (req, res) => {
  await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
  res.status(204).end();
});`,
        explanation: "The same four SQL operations from basic CRUD, each wired to the matching HTTP method and route — this is what 'connecting to a database' actually looks like end to end in a real API, not just a single SELECT.",
        walkthrough: [
          { code: "INSERT INTO users (...) VALUES (...) RETURNING *", explanation: "RETURNING * hands back the newly created row (including any auto-generated id) in the same round trip, instead of needing a second SELECT afterward." },
          { code: 'if (result.rows.length === 0) return res.status(404)', explanation: "A SELECT that matches nothing isn't an error — it just returns zero rows, so the route has to explicitly check for that and respond accordingly." },
          { code: "UPDATE users SET ... WHERE id = $3 RETURNING *", explanation: "Scopes the update to exactly one row with the WHERE clause, and RETURNING * gives back the row as it looks after the change." },
        ],
      },
    ],
    howItWorks: `
The app reads connection details (usually from an environment variable,
never hardcoded) and hands them to a driver, which opens a TCP
connection to the database and authenticates. Rather than opening a new
connection per query, real applications keep a small pool of open
connections ready to reuse (see connection pooling). A query builder or
ORM sits on top of that same driver — at some point, everything still
becomes SQL text sent over that same connection; the abstraction just
decides how much of that SQL you write versus generate.
    `.trim(),
    whyItExists: `
A database speaks its own wire protocol, not JavaScript or Python
directly — without a driver translating between your language's data
types and that protocol, your application code couldn't talk to it at
all. Query builders and ORMs exist on top of that for productivity:
generating repetitive SQL, mapping rows to familiar objects, and
providing tools like migrations that a raw driver doesn't include.
    `.trim(),
    whenToUse: `
Reach for a raw driver when you need full control or you're running a
handful of simple, performance-sensitive queries. Reach for a query
builder when you want dynamic, composable queries with more safety than
hand-built SQL strings. Reach for an ORM for typical CRUD-heavy apps,
where the productivity of models, relations, and built-in migrations
outweighs giving up some fine-grained SQL control.
    `.trim(),
    whenNotToUse: `
Avoid forcing complex analytical or reporting queries through an ORM's
query API — it often produces slower, harder-to-read SQL than writing
it directly; most ORMs let you drop down to raw SQL for exactly this
case. For a tiny script that runs one or two queries, pulling in a full
ORM is usually more setup than the task needs.
    `.trim(),
    commonMistakes: [
      "Hardcoding database credentials directly in source code instead of reading them from environment variables.",
      "Building SQL by concatenating strings with user input, opening the door to SQL injection, instead of using parameterized placeholders.",
      "Opening a brand-new database connection for every incoming request instead of reusing a connection pool, which is slow and can exhaust the database's connection limit under load.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Break down the pieces of the connection string postgres://app:secret@db.internal:5432/orders — host, port, user, password, and database name." },
      { difficulty: "Medium", prompt: "Rewrite this unsafe query to use a parameterized placeholder instead of string concatenation: db.query(\"SELECT * FROM users WHERE email = '\" + email + \"'\")." },
      { difficulty: "Hard", prompt: "Explain what would go wrong, and why, if every incoming HTTP request opened and closed its own new database connection instead of borrowing one from a pool." },
    ],
    interviewQuestions: [
      { question: "What's the difference between a database driver, a query builder, and an ORM?", answer: "A driver sends raw SQL and returns rows with no abstraction; a query builder lets you construct SQL through function calls that still map closely to it; an ORM maps rows to objects and generates the SQL for you, trading some control for productivity." },
      { question: "What does a database connection string typically contain?", answer: "The protocol, host, port, username, password, and the specific database name needed to establish a connection." },
      { question: "Why should database queries use parameterized placeholders instead of string concatenation?", answer: "To prevent SQL injection — the driver safely substitutes values instead of treating attacker-controlled input as part of the SQL itself." },
    ],
    prerequisites: ["env-vars-and-config"],
    relatedTopics: ["env-vars-and-config", "error-handling-apis"],
    keywords: ["database driver", "connection string", "query builder", "ORM", "pg", "psycopg2", "SQL injection", "parameterized queries"],
  },
  {
    id: "python-web-frameworks",
    title: "FastAPI & Python Web Frameworks",
    level: "intermediate",
    description: "How backend concepts like routing and middleware look in Python, using FastAPI as an example of a modern, async, type-driven framework.",
    explanation: `
Everything covered so far — routing, middleware, the request/response
lifecycle — isn't specific to Node.js or Express; it's how backend
frameworks work in general. Python has its own web frameworks: Flask
and Django are the older, synchronous-first options, while **FastAPI**
is a newer framework built around Python's type hints and \`async\`/\`await\`.

FastAPI's defining feature is that it uses ordinary Python type hints
to do double duty: a **Pydantic** model describing a request body
automatically validates incoming data (rejecting anything that doesn't
match, with a clear error) *and* generates interactive API documentation
for free, without writing either by hand.
    `.trim(),
    analogy:
      "It's the same directory board from routing, just installed in a different building — the underlying idea (map a method and path to a function) is identical, only the syntax and a few extra conveniences differ.",
    examples: [
      {
        title: "A route with a path parameter and a request body",
        code: `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.get("/items/{item_id}")
async def get_item(item_id: int):
    return {"item_id": item_id}

@app.post("/items")
async def create_item(item: Item):
    return {"created": item.name, "price": item.price}`,
        explanation: "Declaring item_id: int makes FastAPI convert and validate it automatically; declaring the Item Pydantic model does the same for the whole request body, rejecting requests missing name or price with a 422 error before your function even runs.",
        walkthrough: [
          { code: '@app.get("/items/{item_id}")', explanation: "A decorator-based route, equivalent to app.get(\"/items/:id\", ...) in Express — {item_id} is a path parameter." },
          { code: "async def get_item(item_id: int):", explanation: "The int type hint isn't just documentation — FastAPI actively validates and converts the incoming path segment, returning an error automatically if it isn't a valid integer." },
          { code: "class Item(BaseModel): ...", explanation: "A Pydantic model describing the expected shape of a request body — the same declaration also powers the automatically generated /docs page." },
        ],
      },
      {
        title: "Dependencies — FastAPI's take on shared, cross-cutting logic",
        code: `from fastapi import Depends, FastAPI, HTTPException

app = FastAPI()

def get_current_user(token: str):
    if token != "valid-token":
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"user": "alice"}

@app.get("/profile")
async def profile(user: dict = Depends(get_current_user)):
    return user`,
        explanation: "Depends() is FastAPI's equivalent of Express middleware for things like auth checks — instead of running before the handler in a chain, it's declared as a parameter the handler needs, and FastAPI resolves it before calling the route.",
      },
    ],
    howItWorks: `
FastAPI is built on **Starlette** for the actual async web layer (an
ASGI application, run by a server like Uvicorn) and **Pydantic** for
data validation. When a request arrives, FastAPI matches the path to a
decorated function, uses the function's type hints and any Pydantic
models to validate and parse path parameters, query strings, and the
body before ever calling your function, then serializes whatever you
return back to JSON automatically. Those same type hints are used to
generate an OpenAPI schema, which powers the interactive docs served at
\`/docs\`.
    `.trim(),
    whyItExists: `
Flask and Django predate widespread async support in Python and require
validation to be written by hand. FastAPI exists to bring Node-style
non-blocking I/O performance to Python, while using type hints — which
Python developers were already writing for other reasons — to eliminate
most of the boilerplate around validating requests and documenting an
API.
    `.trim(),
    whenToUse: `
FastAPI is a strong choice when a team is already in the Python
ecosystem (common alongside data or ML work) and wants async
performance, strict request validation, and free interactive API docs
without extra tooling.
    `.trim(),
    whenNotToUse: `
If a team and its libraries are already committed to Node, or the app
is a simple, mostly synchronous CRUD site where Flask or Django's
simpler, more batteries-included conventions are enough, introducing
FastAPI's async model and Pydantic layer is unnecessary complexity.
    `.trim(),
    commonMistakes: [
      "Calling a blocking, non-async library (like an old synchronous database driver) inside an async def route without awaiting an async-compatible alternative, which stalls the entire event loop for every other concurrent request.",
      "Skipping Pydantic models and accepting a raw, untyped request body, losing both automatic validation and the automatically generated documentation.",
      "Treating Depends() as identical to Express-style middleware — it's closer to an injectable parameter the handler declares it needs, rather than a step that always runs before the handler in a fixed chain.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Write the FastAPI equivalent of an Express route: GET /ping returning {\"status\": \"ok\"}." },
      { difficulty: "Medium", prompt: "Define a Pydantic model CreateUser with a name (str) and age (int), and a POST /users route that accepts it and returns the values back." },
      { difficulty: "Hard", prompt: "Explain why calling a blocking, synchronous database call inside an async def route handler can slow down every other concurrent request in FastAPI, not just the one making that call." },
    ],
    interviewQuestions: [
      { question: "What is FastAPI built on?", answer: "Starlette (an ASGI framework) for the async web layer, and Pydantic for data validation and serialization." },
      { question: "How does FastAPI generate interactive API documentation automatically?", answer: "It builds an OpenAPI schema from the same type hints and Pydantic models used to validate requests, and serves an interactive UI from that schema at /docs." },
      { question: "What's the risk of a blocking call inside an async route handler?", answer: "It occupies the single event loop thread, delaying every other concurrent request, the same way a CPU-heavy synchronous operation would block Node.js." },
    ],
    prerequisites: ["servers-and-web-frameworks", "routing"],
    relatedTopics: ["servers-and-web-frameworks", "routing", "middleware", "validation-and-sanitization"],
    keywords: ["FastAPI", "Python", "Pydantic", "ASGI", "Starlette", "async", "Flask", "Django", "Uvicorn"],
  },
  {
    id: "authentication-and-passwords",
    title: "Authentication & Password Hashing",
    level: "intermediate",
    description: "How a backend verifies who's making a request — never storing raw passwords, and remembering that someone is logged in across future requests.",
    explanation: `
A backend regularly needs to know who's actually asking: "who is this
request from, and are they allowed to do this?" That's
**authentication** — proving identity, usually by checking a password at
login.

The single most important rule: **never store a user's actual
password.** Instead, store a **hash** — the output of a one-way function
(like bcrypt or argon2) that scrambles the password so it can't be
reversed back into the original, even if the entire database leaks. At
login, you hash the freshly submitted password the same way and compare
the two *hashes* — the plaintext password itself is never stored or
compared directly.

HTTP itself doesn't remember anything between requests, so once someone
logs in, the backend needs a way to keep recognizing them on later
requests too — either a **session** (the server remembers who's logged
in, and gives the browser a cookie holding just an id to look it up) or
a **token** like a JWT (a small, signed packet of data the client holds
and resends, which the server can verify without storing anything
itself).
    `.trim(),
    analogy:
      "Hashing a password is like feeding it through a paper shredder: you get scrambled confetti out, and there's no way to feed the confetti back in and reconstruct the original page. To check a password later, you shred the newly typed one the same way and compare the confetti — you never keep the original page around to compare against directly.",
    examples: [
      {
        title: "Hashing on signup, comparing on login (bcrypt)",
        code: `const bcrypt = require("bcrypt");

// Signup: hash before storing anything
const passwordHash = await bcrypt.hash(plainPassword, 10);
await pool.query(
  "INSERT INTO users (email, password_hash) VALUES ($1, $2)",
  [email, passwordHash]
);

// Login: compare against the stored hash
const user = await findUserByEmail(email);
const isValid = user && (await bcrypt.compare(submittedPassword, user.password_hash));
if (!isValid) return res.status(401).json({ error: "invalid credentials" });`,
        explanation: "The plaintext password only ever exists briefly in memory — the database stores password_hash, never the password itself, and login works by comparing hashes, not by 'unhashing' anything.",
        walkthrough: [
          { code: "bcrypt.hash(plainPassword, 10)", explanation: "Produces an irreversible, automatically salted hash — the 10 controls how computationally expensive it is, deliberately slow to resist brute-force guessing." },
          { code: "password_hash", explanation: "The only thing ever written to the database — even a full database leak doesn't hand over usable passwords." },
          { code: "bcrypt.compare(submittedPassword, user.password_hash)", explanation: "Hashes the submitted password the same way internally and checks whether it matches — the original stored hash is never reversed." },
        ],
      },
      {
        title: "Protecting a route with an auth middleware",
        code: `function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || !isValidToken(token)) {
    return res.status(401).json({ error: "unauthorized" });
  }
  req.user = decodeToken(token);
  next();
}

app.get("/profile", requireAuth, (req, res) => {
  res.json(req.user);
});`,
        explanation: "This is the requireAuth middleware referenced back in the middleware topic — it runs before the route handler and only calls next() once it has confirmed who the caller actually is.",
      },
    ],
    howItWorks: `
Password-hashing algorithms (bcrypt, scrypt, argon2) are deliberately
slow, and mix in a random **salt** for every password, so that two
users with the same password get different-looking hashes and an
attacker can't precompute one shared table of hashes to crack many
accounts at once (a "rainbow table"). After a successful login, staying
recognized on future requests works one of two ways: a session stores
the logged-in state server-side and hands the browser a cookie with
just an id to look it up, while a token like a JWT carries the identity
data itself, signed so the server can verify it wasn't tampered with —
without needing to store anything server-side at all.
    `.trim(),
    whyItExists: `
If a database stored passwords directly, any breach, backup leak, or
careless insider access would hand over every user's actual password
immediately — and because people reuse passwords across sites, that
damage doesn't stay contained to just this one app. Hashing exists to
make stored passwords useless to an attacker even if the entire database
is exposed. Authentication overall exists because a server otherwise has
no way to tell a returning, legitimate user apart from anyone else
simply sending a similar-looking request.
    `.trim(),
    whenToUse: `
Any system with real user accounts needs authentication once there's a
"you" to log in as — hashing wherever a password is stored, and a
session or token wherever the backend needs to keep recognizing a
logged-in user across requests.
    `.trim(),
    whenNotToUse: `
Don't hand-roll password hashing or session handling for anything real
— use a well-audited library (bcrypt, argon2) or a full auth
framework/service rather than inventing your own scheme, since subtle
cryptographic mistakes are easy to make and extremely costly. Internal
tools with no real user accounts to protect may not need full
authentication at all.
    `.trim(),
    commonMistakes: [
      "Storing passwords in plaintext, or hashing them with a fast general-purpose hash (like MD5 or SHA-256) instead of a slow, purpose-built one like bcrypt.",
      "Comparing passwords with a simple equality check after hashing manually without a salt, letting identical passwords produce identical hashes and enabling rainbow-table attacks.",
      "Confusing authentication ('who are you?') with authorization ('what are you allowed to do?') — being logged in doesn't automatically mean access to every resource should be granted.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Explain why a database breach is far less damaging if passwords were hashed with bcrypt instead of stored as plaintext." },
      { difficulty: "Medium", prompt: "Write a signup and login flow using bcrypt.hash and bcrypt.compare, including the SQL to store and look up a user's password_hash." },
      { difficulty: "Hard", prompt: "Explain the difference between session-based and token-based (JWT) authentication, including exactly where the 'you're logged in' state lives in each approach." },
    ],
    interviewQuestions: [
      { question: "Why shouldn't passwords ever be stored in plaintext?", answer: "Because anyone who gains access to the database — through a breach, an insider, or a leaked backup — would get every user's actual password immediately, and since people reuse passwords across sites, that damage spreads beyond just this app." },
      { question: "What's the difference between hashing and encryption for storing passwords?", answer: "Encryption is reversible with the right key; hashing is designed to be irreversible — which is exactly what's wanted for passwords, since you only ever need to verify a match, never recover the original." },
      { question: "What's the difference between authentication and authorization?", answer: "Authentication confirms who a user is; authorization determines what that already-authenticated user is allowed to do." },
    ],
    prerequisites: ["middleware", "validation-and-sanitization"],
    relatedTopics: ["middleware", "error-handling-apis", "connecting-to-a-database"],
    keywords: ["authentication", "password hashing", "bcrypt", "JWT", "session", "authorization", "salt"],
  },
  {
    id: "fastapi-database-and-crud",
    title: "FastAPI Project Structure & Database CRUD",
    level: "intermediate",
    description: "How a real FastAPI project is split into files, connects to a database with SQLAlchemy, and exposes full CRUD endpoints.",
    explanation: `
A single \`main.py\` is fine for a two-route demo, but a real FastAPI
project splits responsibilities across files, much like a layered
Node.js app: \`database.py\` sets up the database connection,
\`models.py\` defines the actual database tables as Python classes,
\`schemas.py\` defines the Pydantic models describing what the API
accepts and returns, and one or more router files group related
endpoints, all wired together in \`main.py\`.

**SQLAlchemy** is Python's most common tool for talking to a relational
database. Used here as an ORM, it maps each database row to a Python
object — the same idea as Prisma or Sequelize in Node, just in Python.
    `.trim(),
    analogy:
      "It's the same layered kitchen from backend project structure, just relabeled for a Python kitchen: routers are the host seating guests, path functions are the server taking the order, and SQLAlchemy models are the pantry holding the actual ingredients.",
    examples: [
      {
        title: "Project layout and the database connection",
        code: `myapp/
├── main.py           # creates the app, includes routers
├── database.py        # engine + session setup
├── models.py           # SQLAlchemy table definitions
├── schemas.py          # Pydantic request/response shapes
└── routers/
    └── items.py         # /items endpoints

# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine("postgresql://user:password@localhost/mydb")
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()`,
        explanation: "get_db is a FastAPI dependency: because it uses yield, FastAPI runs everything before the yield, hands the route the session, then runs everything after the yield (closing it) once the request finishes — even if the route raised an error.",
        walkthrough: [
          { code: 'create_engine("postgresql://...")', explanation: "Opens the connection using a connection string — the exact same idea as pg.Pool in Node, just SQLAlchemy's version of it." },
          { code: "SessionLocal = sessionmaker(bind=engine)", explanation: "A factory for creating a scoped 'unit of work' session, rather than sharing one connection across every unrelated request." },
          { code: "def get_db(): ... yield db ... finally: db.close()", explanation: "Guarantees each request gets its own session and that it's always cleaned up afterward, success or failure." },
        ],
      },
      {
        title: "Full CRUD endpoints using that session",
        code: `# routers/items.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter()

@router.post("/items", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    db_item = models.Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/items/{item_id}", response_model=schemas.Item)
def read_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.put("/items/{item_id}", response_model=schemas.Item)
def update_item(item_id: int, updated: schemas.ItemCreate, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    for key, value in updated.dict().items():
        setattr(item, key, value)
    db.commit()
    return item

@router.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db.query(models.Item).filter(models.Item.id == item_id).delete()
    db.commit()
    return {"deleted": item_id}`,
        explanation: "The same four CRUD operations from SQL — Create, Read, Update, Delete — expressed through SQLAlchemy's query API instead of raw SQL text, each one wired to its own route.",
      },
    ],
    howItWorks: `
\`db: Session = Depends(get_db)\` is FastAPI's dependency injection reusing
\`get_db\` for every request — each request gets its own fresh session,
used only for that request's queries, then closed. Calls like
\`db.add\`, \`db.commit\`, \`db.query\`, and \`.delete()\` map to INSERT,
UPDATE/COMMIT, SELECT, and DELETE statements that SQLAlchemy generates
and sends over the underlying database connection, the same way the
\`pg\` driver does in Node. To actually run the app, you start an ASGI
server pointed at it: \`uvicorn main:app --reload\` — the Python
equivalent of running \`node server.js\`, watching for changes with
\`--reload\` during development.
    `.trim(),
    whyItExists: `
Splitting a FastAPI project this way mirrors exactly why a Node backend
gets split into routes/controllers/services/models: as endpoints and
tables multiply, keeping the app's setup, data shape, and database logic
each in one dedicated place keeps the project navigable, instead of
tangled into a single growing file.
    `.trim(),
    whenToUse: `
Reach for this structure once a FastAPI project has more than a couple
of endpoints or more than one table — the same threshold as reaching
for a layered structure in a Node project.
    `.trim(),
    whenNotToUse: `
For a two-endpoint script or a quick prototype, separate
database.py/models.py/schemas.py/router files are more scaffolding than
the project needs — one main.py is easier to follow at that size.
    `.trim(),
    commonMistakes: [
      "Forgetting db.commit() after db.add() or a mutation, leaving the change only staged in the session instead of actually written to the database.",
      "Reusing one global session across every request instead of a fresh one per request via Depends(get_db), which can leak stale data or connections between unrelated requests.",
      "Returning a raw SQLAlchemy model object instead of going through a Pydantic response_model, exposing internal fields (like a password hash) that were never meant to reach the client.",
    ],
    exercises: [
      { difficulty: "Easy", prompt: "Name which file — database.py, models.py, schemas.py, or a router — a new 'orders' table definition belongs in." },
      { difficulty: "Medium", prompt: "Write a DELETE /items/{item_id} endpoint that returns a 404 if the item doesn't exist before deleting it." },
      { difficulty: "Hard", prompt: "Explain what would go wrong if a single database session, created once at app startup, were reused across every incoming request instead of one session per request." },
    ],
    interviewQuestions: [
      { question: "What does Depends(get_db) provide to a FastAPI route?", answer: "A fresh, request-scoped SQLAlchemy session that's automatically closed afterward — similar to Express middleware attaching something onto the request object." },
      { question: "What command actually runs a FastAPI app?", answer: "uvicorn main:app --reload — an ASGI server pointed at the created FastAPI instance, with --reload restarting it on code changes during development." },
      { question: "Why use a Pydantic response_model instead of returning the raw database object?", answer: "It controls exactly which fields are exposed to the client, preventing internal-only fields from leaking into the API response." },
    ],
    prerequisites: ["python-web-frameworks", "connecting-to-a-database"],
    relatedTopics: ["python-web-frameworks", "connecting-to-a-database", "project-structure"],
    keywords: ["FastAPI", "SQLAlchemy", "CRUD", "Pydantic", "dependency injection", "uvicorn", "Python ORM"],
  },
];
